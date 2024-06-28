const { pronet, genesis } = require('../database/database');
const { Campania } = require('../models/campanias');
const { Etapa } = require('../models/etapa');
const { Participacion } = require('../models/Participacion');
const { PremioCampania } = require('../models/premioCampania');
const { Premio } = require('../models/premio');


const { Op } = require('sequelize');

const getParticipacionesActivas = async(req, res) => {
    try {
        const { fecha1, fecha2, } = req.body;

        

        // Realizamos la consulta a la base de datos
        const envio = await Campania.findAll({
            where: {
                [Op.or]: [{ estado: [1, 2, 3] }],
                fechaInicio: {
                    [Op.gte]: fecha1
                },
                fechaFin: {
                    [Op.lte]: fecha2
                },
                estado: 1,
            },
            include: [{
                model: Participacion,
                as: 'participacions',
                attributes: ['fecha', 'descripcionTrx', 'urlPremio', 'valor', 'idPremio', 'idTransaccion', 'customerId'],
            }]
        });


        console.log(envio)

        const newArray = [];
        for (const c of envio) {
            const participacions = [];
            for (const p of c.participacions) {
                const customerInfo = await getCustomerInfoById(p.customerId);
                participacions.push({
                    ...p.toJSON(),
                    campanium: {
                        "nombre": c.nombre,
                       
                    },
                    premioDescripcion: p.premio ? p.premio.descripcion : "Sin premio", 
                    customerInfo
                });
            }
            newArray.push({
                "id": c.id,
                "nombre": c.nombre,
                "descripcion": c.descripcion,
                "fechaRegistro": c.fechaRegistro,
                "fechaInicio": c.fechaInicio,
                "fechaFin": c.fechaFin,
                "diaReporte": c.diaReporte,
                "horaReporte": c.horaReporte,
                "emails": c.emails,
                "edadInicial": c.edadInicial,
                "edadFinal": c.edadFinal,
                "sexo": c.sexo,
                "tipoUsuario": c.tipoUsuario,
                "tituloNotificacion": c.tituloNotificacion,
                "descripcionNotificacion": c.descripcionNotificacion,
                "imgPush": c.imgPush,
                "imgAkisi": c.imgAkisi,
                "estado": c.estado,
                "maximoParticipaciones": c.maximoParticipaciones,
                "participacions": participacions
            });
        }

        res.json(newArray);
    } catch (error) {
        console.error('Error al obtener las campañas:', error);
        res.status(403).send({ errors: 'Ha ocurrido un error al obtener las campañas.' });
    }
};

const getCustomerInfoById = async(customerId) => {
    try {
        const customerInfo = await pronet.query(`
            SELECT 
                cu.customer_id,
                cu.telno,
                ui.lname,
                ui.fname,
                ui.mname, 
                ui.slname
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





const getclientes = async (req, res) => {
    try {
      const customerInfo = await pronet.query(`
        SELECT COUNT(customer_id) AS customer_count
        FROM pronet.tbl_customer
        WHERE created_date >= NOW() - INTERVAL 7 DAY;
      `, {
        type: pronet.QueryTypes.SELECT
      });
  
      res.status(200).json(customerInfo[0]);
    } catch (error) {
      console.error('Error al obtener clientes creados en los últimos 7 días:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  };
  


module.exports = { getParticipacionesActivas,getclientes };