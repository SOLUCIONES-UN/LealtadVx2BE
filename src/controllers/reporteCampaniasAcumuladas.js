const { Sequelize } = require("sequelize");
const { pronet, sequelize, Op } = require("../database/database");
const { CampaniasNumeros } = require("../models/campanianumero");
const { CampaniaRegiones } = require("../models/campaniaregions");
const { Campania } = require("../models/campanias")
const {
    campaniaNumerosRestringidos,
    validarLimiteParticipacionesPorUsuario,
} = require("../controllers/emuladorUsuarioController");
const { regionesValidasCampania } = require(`../controllers/emuladorUsuarioController`);


const fechaminimavalida = async (req, res) => {

    const query =
        `
        SELECT MIN(fechaInicio) AS fechaApartir FROM dbepco7agwmwba.campania WHERE fechaFin >= CAST(NOW() AS DATE)
    `
    try {
        const result = await sequelize.query(query, {
            replacements: {},
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].fechaApartir;
    } catch (error) {
        console.error('Error en obtener fechaminimavalida:', error);
        throw error;
    };
}

const fechamaximavalida = async (req, res) => {

    const query =
        `
        SELECT MIN(fechaFin) AS fechaApartir FROM dbepco7agwmwba.campania WHERE fechaFin >= CAST(NOW() AS DATE)
    `
    try {
        const result = await sequelize.query(query, {
            replacements: {},
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].fechaApartir;
    } catch (error) {
        console.error('Error en obtener fechamaximavalida:', error);
        throw error;
    };
}

const transaccionesDelUsuarioPendientes = async (req, res) => {
    const { idUsuario, fecha1, fecha2 } = req.params; 

    const query = `
        SELECT *, CAST(fechaParticipacion AS DATE) AS solofecha 
        FROM dbepco7agwmwba.campaniaadicional 
        WHERE yaAplico = 0 AND idCampania = 0 AND idUsuarioParticipante = :idUsuario 
        AND fechaParticipacion BETWEEN :fecha1 AND :fecha2;
    `;

    try {
        const result = await sequelize.query(query, {
            replacements: {
                idUsuario: idUsuario,
                fecha1: fecha1,
                fecha2: `${fecha2} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT
        });

        console.log(`transacciones del usuario:`, result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las transacciones del usuario:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });

    }
};

const CampanasActualesActivas = async () => {
    return await Campania.findAll({
        where: { estado: 1 },
        attributes: ['id', 'nombre', 'descripcion', 'edadInicial', 'tituloNotificacion', 'descripcionNotificacion', 'imgPush', 'imgAkisi'],
        order: [['fechaCreacion', 'DESC']]
    });
};



async function usuarioParticipantes_get(fechaI, fechaF) {
    const query = `
        SELECT 
            pc.idUsuarioParticipante, 
            tc.telno, 
            CONCAT(tui.fname, ' ', tui.mname, ' ', tui.lname, ' ', tui.slname) AS nombre 
        FROM 
            genesis.participante_campana_adicional pc 
        JOIN 
            pronet.tbl_customer tc ON tc.customer_id = pc.idUsuarioParticipante 
        JOIN 
            pronet.tblUserInformation tui ON tui.userid = tc.fk_userid 
        WHERE 
            pc.yaAplico = 0 
            AND pc.fechaParticipacion BETWEEN :fechaI AND :fechaF
        GROUP BY 
            pc.idUsuarioParticipante, 
            tc.telno, 
            tui.fname, tui.mname, tui.lname, tui.slname;
    `;
    try {
        const results = await pronet.query(query, {
            replacements: {
                fechaI: `${fechaI} 00:00:00`,
                fechaF: `${fechaF} 23:59:59`
            },
            type: Sequelize.QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error in usuarioParticipantes_get:', error);
        throw error;
    }
}


async function informacionGeneralUsuario(usuarioId) {


    try {
        const results = await pronet.query(`
            SELECT 
                DATE_FORMAT(tc.created_date, '%Y-%m-%d') AS fechaCreacion,
                TIMESTAMPDIFF(YEAR, tui.bdate, NOW()) AS edad,
                CASE 
                    WHEN tui.gender = 'MALE' THEN 1 
                    WHEN tui.gender = 'FEMALE' THEN 2 
                END AS genero,
                tc.telno 
            FROM pronet.tblUserInformation tui
            INNER JOIN pronet.tbl_customer tc ON tc.fk_userid = tui.userid 
            WHERE tc.customer_id = :usuarioId;
        `, {
            replacements: { usuarioId: usuarioId },
            type: pronet.QueryTypes.SELECT
        });

        if (results && results.length > 0) {
            return results[0]; 
        } else {
            return null; 
        }


    } catch (error) {
        console.error('Error en informacionGeneralUsuario:', error);
        throw error;
    }
}

async function campanaPremiosInfoCliente(idTransaccion) {
    try {
        const query = `
            SELECT telno, department, municipality 
            FROM pronet.tbl_customer 
            WHERE customer_id = :idTransaccion;
        `;
        const results = await pronet.query(query, {
            replacements: { idTransaccion },
            type: pronet.QueryTypes.SELECT
        });

        if (results.length > 0) {
            return results[0];
        } else {
            throw error;
        }
    } catch (error) {
        console.error('Error al obtener información del cliente:', error);
        throw error;
    }
}

const reporteClientesContraCampanas = async (req, res) => {

    try {
        console.log("Obteniendo fechas mínima y máxima válidas...");
        const fechaI = await fechaminimavalida();
        const fechaF = await fechamaximavalida();
        const infoParticipantes = await usuarioParticipantes_get(fechaI, fechaF);
        console.log(`Fechas obtenidas: ${fechaI} a ${fechaF}`, infoParticipantes);

        if (!fechaI || !fechaF) {
            console.error('Las fechas no se han obtenido correctamente:', fechaI, fechaF);
            return res.status(500).json({ error: 'Fechas no válidas' });
        }

        console.log(`Participantes obtenidos: ${infoParticipantes.length} encontrados`);

        const campaniasActivasEnc = await CampanasActualesActivas();

        const results = await processParticipations(infoParticipantes, campaniasActivasEnc);
        console.log("Procesamiento completado.", results);

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al procesar el reporte de campañas.', error);
        return res.status(500).json({ error: 'Fallo al procesar el reporte de camapañas' });
    }
}

async function processParticipations(participants, campaniasActivasEnc) {
    const results = [];
    console.log("Iniciando el procesamiento de cada participante...");

    for (const participant of participants) {
        const { idUsuarioParticipante, telno, nombre } = participant;
        console.log(`Procesando participante: ${idUsuarioParticipante}`, participant);

        const customerInfo = await campanaPremiosInfoCliente(idUsuarioParticipante);
        const userInfo = await informacionGeneralUsuario(idUsuarioParticipante);
        console.log(`Datos de usuario obtenidos:`, userInfo);

        if (!customerInfo || !userInfo) {
            console.log(`Información insuficiente para el participante: ${idUsuarioParticipante}. Continuando con el siguiente...`);
            continue;
        }

        console.log(`Evaluando campañas para el participante: ${idUsuarioParticipante}`);
        for (const campania of campaniasActivasEnc) {
            const userInfo = await informacionGeneralUsuario(idUsuarioParticipante);
            console.log(`Datos de usuario obtenidos:`, userInfo);

            if (await isEligibleForCampaign(participant, campania, userInfo, customerInfo)) {
                console.log(`Participante ${idUsuarioParticipante} es elegible para la campaña ${campania.nombre}`);
                const recompensas = await calcularRecompensas(idUsuarioParticipante, campania.id);
                console.log(`participantes permitidos o ganandores`, recompensas);

                results.push({
                    telefono: telno,
                    nombre: nombre,
                    campania: campania.nombre,
                    recompensas: recompensas
                });
            }
        }
    }

    console.log("Procesamiento de participantes completado.");
    return results;
}

async function isEligibleForCampaign(participant, campaign, userInfo, customerInfo) {
    const { edadInicial, edadFinal, sexo, id: idCampania } = campaign;
    console.log("userInfo para depuración:", userInfo);

    if (userInfo.edad < edadInicial || userInfo.edad > edadFinal) {
        console.log(`Usuario ${participant.idUsuarioParticipante} no cumple con el criterio de edad.`);
        return false;
    }


   
    if (sexo !== 0) { 
        if ((sexo === 1 && userInfo.genero !== 'MALE') || (sexo === 2 && userInfo.genero !== 'FEMALE')) {
            console.log(`Usuario ${participant.idUsuarioParticipante} no cumple con el criterio de género. Requerido: ${sexo}, actual: ${userInfo.genero}`);
            return false;
        }
    }

    const regionesPermitidas = await regionesValidasCampania(idCampania);
    const usuarioRegionValida = regionesPermitidas.some(region =>
        region.departamentoId === customerInfo.departamentoId &&
        region.municipioId === customerInfo.municipioId
    );

    if (!usuarioRegionValida) {
        console.log(`Usuario ${participant.idUsuarioParticipante} no está en una región válida para la campaña.`, usuarioRegionValida);
        return false;
    }

    return true;
}

async function calcularRecompensas(idUsuarioParticipante, idCampania) {
    const participaciones = await validarLimiteParticipacionesPorUsuario(idUsuarioParticipante, idCampania);
    let recompensa = 0;

    if (participaciones >= 5) {
        recompensa = Math.floor(participaciones / 5);
    }

    return recompensa;
}


module.exports = {

    reporteClientesContraCampanas,
    campaniaNumerosRestringidos,
    validarLimiteParticipacionesPorUsuario,

}