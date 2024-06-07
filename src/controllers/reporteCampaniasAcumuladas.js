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
        SELECT MIN(fechaInicio) AS fechaApartir FROM lealtadv2.campania WHERE fechaFin >= CAST(NOW() AS DATE)
    `
    try {
        const result = await sequelize.query(query, {
            replacements: {},
            type: sequelize.QueryTypes.SELECT
        });

        // res.status(200).json(result);
        return result[0].fechaApartir;
    } catch (error) {
        console.error('Error en obtener fechaminimavalida:', error);
        // return res.status(500).json({ error: 'Error al obtener la fecha minivavalida' });
        throw error;
    };
}

const fechamaximavalida = async (req, res) => {

    const query =
        `
        SELECT MIN(fechaFin) AS fechaApartir FROM lealtadv2.campania WHERE fechaFin >= CAST(NOW() AS DATE)
    `
    try {
        const result = await sequelize.query(query, {
            replacements: {},
            type: sequelize.QueryTypes.SELECT
        });

        // res.status(200).json(result);
        return result[0].fechaApartir;
    } catch (error) {
        console.error('Error en obtener fechamaximavalida:', error);
        // return res.status(500).json({ error: 'Error al obtener la fecha maximavalida' });
        throw error;
    };
}

const transaccionesDelUsuarioPendientes = async (req, res) => {
    const { idUsuario, fecha1, fecha2 } = req.params; // Asegúrate de enviar estos datos en los parámetros de la ruta

    const query = `
        SELECT *, CAST(fechaParticipacion AS DATE) AS solofecha 
        FROM lealtadv2.campaniaadicional 
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
        // return result;
    } catch (error) {
        console.error('Error al obtener las transacciones del usuario:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
        // throw error;
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
    // const { fechaI, fechaF } = req.params;
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
        // return res.status(500).send('Error al procesar la solicitud');
        throw error;
    }
}

// async function usuarioParticipantes_get(fechaI, fechaF) {
//     // const { fechaI, fechaF } = req.params;
//     const localQuery = `
//         SELECT idUsuarioParticipante
//         FROM lealtadv2.campaniaadicional
//         WHERE yaAplico = 0 AND fechaParticipacion BETWEEN :fechaI AND :fechaF
//     `;

//     const remoteQuery = `
//         SELECT tc.customer_id, tc.telno, CONCAT(tui.fname, ' ', tui.mname, ' ', tui.lname, ' ', tui.slname) AS nombre
//         FROM pronet.tbl_customer tc
//         JOIN pronet.tblUserInformation tui ON tui.userid = tc.fk_userid
//         WHERE tc.customer_id IN (:customerIds)
//     `;

//     try {
//         // Primero, obtener IDs de participantes desde la base local
//         const localResults = await sequelize.query(localQuery, {
//             replacements: {
//                 fechaI: `${fechaI} 00:00:00`,
//                 fechaF: `${fechaF} 23:59:59`
//             },
//             type: sequelize.QueryTypes.SELECT
//         });

//         // Verificar si tenemos resultados antes de continuar
//         if (localResults.length === 0) {
//             return res.status(404).send('No se encontraron participantes en el período especificado.');
//         }

//         const customerIds = localResults.map(item => item.idUsuarioParticipante);

//         // Luego, obtener detalles de esos IDs desde la base remota
//         const remoteResults = await pronet.query(remoteQuery, {
//             replacements: { customerIds },
//             type: pronet.QueryTypes.SELECT
//         });

//         return remoteResults;
//     } catch (error) {
//         console.error('Error in usuarioParticipantes_get:', error);
//         // return res.status(500).send('Error al procesar la solicitud');
//         throw error;
//     }
// }

async function informacionGeneralUsuario(usuarioId) {
    // const usuarioId = req.params.usuarioId; 

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
            return results[0]; // Asegúrate de devolver solo el primer resultado.
        } else {
            return null; // Devuelve null si no hay resultados para manejar este caso correctamente.
        }

        // res.json(results);  // Devuelve el resultado como JSON
        // return results;
    } catch (error) {
        console.error('Error en informacionGeneralUsuario:', error);
        // res.status(500).send('Error al procesar la solicitud');
        throw error;
    }
}

async function campanaPremiosInfoCliente(idTransaccion) {
    // const { idTransaccion } = req.params; 
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
            // res.status(200).json(results[0]); 
            return results[0];
        } else {
            throw error;
            //  res.status(404).send('No se encontró el cliente con el ID proporcionado.');
        }
    } catch (error) {
        console.error('Error al obtener información del cliente:', error);
        // res.status(500).send('Error al procesar la solicitud'); 
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

        // Aquí asegúrate de que las fechas son strings y no null o undefined
        if (!fechaI || !fechaF) {
            console.error('Las fechas no se han obtenido correctamente:', fechaI, fechaF);
            return res.status(500).json({ error: 'Fechas no válidas' });
        }

        //   const infoParticipantes = await usuarioParticipantes_get({ params: { fechaI, fechaF } }, null);
        console.log(`Participantes obtenidos: ${infoParticipantes.length} encontrados`);

        const campaniasActivasEnc = await CampanasActualesActivas();
        //   console.log(`Campañas activas encontradas: ${campaniasActivasEnc.length}`, campaniasActivasEnc);

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

    // Verificar si el número está restringido para la campaña
    // console.log(`Número de teléfono recibido: ${userInfo.telno}, tipo: ${typeof userInfo.telno}`);
    // if (!userInfo.telno || userInfo.telno.trim() === "") {
    //     console.log("Número de teléfono no proporcionado o vacío.", userInfo);
    //     return false;
    // }

    // try {
    //     const numeroPermitido = await campaniaNumerosRestringidos(idCampania, userInfo.telno, campaign.restringe);
    //     if (!numeroPermitido) {
    //         console.log(`Número de teléfono ${userInfo.telno} restringido para la campaña ${campaign.nombre}.`);
    //         return false;
    //     }
    // } catch (error) {
    //     console.error("Error al verificar la restricción del número:", error);
    //     return false;
    // }

    // Verificar rango de edad
    if (userInfo.edad < edadInicial || userInfo.edad > edadFinal) {
        console.log(`Usuario ${participant.idUsuarioParticipante} no cumple con el criterio de edad.`);
        return false;
    }


    // Verificar género
    if (sexo !== 0) { // Si sexo es diferente de 0, se verifica el género específico.
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
    // return await isUserInValidRegion(idCampania, customerInfo);
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
    // campanaPremiosInfoCliente,
    // informacionGeneralUsuario 
    // transaccionesDelUsuarioPendientes,
    // fechaminimavalida,
    // fechamaximavalida,
    // usuarioParticipantes,
    // usuarioParticipantes_get

}