const { pronet, genesis } = require('../database/database');
const { Campania } = require('../models/campanias');
const { Etapa } = require('../models/etapa');
const { Participacion } = require('../models/Participacion');

const { PremioCampania } = require('../models/premioCampania');
const { Premio } = require('../models/premio');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');


const { Op } = require('sequelize');

const getUsuariosNotificacionesOfferCraftSel = async (idCampanas, fecha1, fecha2, archivadas) => {
    try {
        let whereConditions = {
            id: idCampanas,
            [Op.or]: [{ estado: [1, 2, 3] }],
            fechaInicio: { [Op.gte]: fecha1 },
            fechaFin: { [Op.lte]: fecha2 },
            estado: 1,
            esArchivada: archivadas ? 1 : 0,
        };

        const envio = await Campania.findAll({
            where: whereConditions,
            include: [{
                model: Participacion,
                attributes: ['fecha', 'descripcionTrx', 'urlPremio', 'valor', 'idPremio', 'idTransaccion', 'customerId'],
                include: [{
                    model: Premio,
                    attributes: ['descripcion']
                }]
            }]
        });

        const newArray = [];
        for (const c of envio) {
            const participaciones = [];
            for (const p of c.participacions) {
                const customerInfo = await getCustomerInfoById(p.customerId);
                participaciones.push({
                    ...p.toJSON(),
                    campanium: {
                        nombre: c.nombre,
                        fechaCreacion: c.fechaCreacion
                    },
                    premioDescripcion: p.premio ? p.premio.descripcion : "Sin premio",
                    customerInfo
                });
            }
            newArray.push({
                id: c.id,
                nombre: c.nombre,
                descripcion: c.descripcion,
                fechaCreacion: c.fechaCreacion,
                fechaRegistro: c.fechaRegistro,
                fechaInicio: c.fechaInicio,
                fechaFin: c.fechaFin,
                edadInicial: c.edadInicial,
                edadFinal: c.edadFinal,
                sexo: c.sexo,
                tipoUsuario: c.tipoUsuario,
                tituloNotificacion: c.tituloNotificacion,
                descripcionNotificacion: c.descripcionNotificacion,
                imgPush: c.imgPush,
                imgAkisi: c.imgAkisi,
                estado: c.estado,
                maximoParticipaciones: c.maximoParticipaciones,
                participaciones
            });
        }

        return newArray;
    } catch (error) {
        console.error('Error al obtener las campañas:', error);
        throw new Error('Ha ocurrido un error al obtener las campañas.');
    }
};

const getCustomerInfoById = async (customerId) => {
    try {
        const customerInfo = await pronet.query(`
            SELECT 
                cu.customer_id,
                cu.customer_reference,
                cu.telno,
                ui.lname,
                ui.fname
            FROM 
                pronet.tbl_customer cu
            JOIN 
                pronet.tblUserInformation ui ON cu.telno = ui.userno
            WHERE 
                cu.customer_id = ${customerId}
        `, {
            type: pronet.QueryTypes.SELECT
        });

        return customerInfo[0];
    } catch (error) {
        console.error('Error al obtener la información del cliente:', error);
        throw new Error('Error al obtener la información del cliente');
    }
};

module.exports = { getUsuariosNotificacionesOfferCraftSel };