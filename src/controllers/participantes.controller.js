
const { Participacion } = require("../models/Participacion");
const { TransaccionPremio } = require("../models/transaccionPremio");
const { Campania } = require('../models/campanias');
const { pronet, genesis } = require('../database/database');

const getCustomerInfoById = async(customerId) => {
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
        throw new Error('Error al obtener la información del cliente');
    }
};

const getParticipantes = async(req, res) => {
    try {
        const participantes = await Participacion.findAll({
            include: {
                model: Campania,
                attributes: ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'fechaCreacion']
            },
            order: [['fecha', 'DESC']],  
            limit: 10  
        });

        for (let participante of participantes) {
            const customerInfo = await getCustomerInfoById(participante.customerId);
            participante.dataValues.customerInfo = customerInfo;
        }

        res.json(participantes);
    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al obtener las participaciones.' });
    }
};

module.exports = { getParticipantes };