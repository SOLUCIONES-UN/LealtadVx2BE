const { Sequelize } = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database"); 
const { Campania } = require('../models/campanias');
const { participacionReferidos } = require('../models/participacionReferidos');
const { Participacion } = require('../models/Participacion');
const { codigoReferido } = require('../models/codigoReferidos');
const { ConfigReferido } = require('../models/configReferidos');
const { Usuario } = require('../models/usuario');
const { Op } = require('sequelize');


const getParticipaciones = async (campanas, fecha1, fecha2) => {
  try {

    const fecha1Obj = fecha1 instanceof Date ? fecha1 : new Date(fecha1);
        const fecha2Obj = fecha2 instanceof Date ? fecha2 : new Date(fecha2);


        const fechaInicioFormatted = fecha1Obj.toISOString().split('T')[0];
        const fechaFinFormatted = fecha2Obj.toISOString().split('T')[0];
        

        console.log('Campanias:', campanas);
        console.log('Fecha de inicio:', fechaInicioFormatted);
        console.log('Fecha de fin:', fechaFinFormatted);
        

        const campanasArray = Array.isArray(campanas) ? campanas : [campanas];

        let campanias = "";
        campanasArray.forEach((c, index) => {
          campanias += index > 0 ? `, '${c}'`: `'${c}'`;
        });




    const participaciones = await sequelize.query(`
         SELECT 
        c.id AS campania_id,
        c.nombre AS nombre_campania,
        c.descripcionNotificacion,
        p.fecha,
        p.descripcionTrx,
        p.valor,
        p.customerId,
        p.idTransaccion,
        cr.codigo AS codigo_referido,
        p2.refiriente,
        p2.referido,
        crf.opcion AS opcion_referido,
        u.nombre AS nombre_usuario,
        u.telefono AS telefono_usuario
      FROM 
        campania c
      LEFT JOIN 
      participacions p ON c.id = p.idCampania 
      LEFT JOIN 
      codigosreferidos cr ON cr.customerId = p.customerId 
      LEFT JOIN 
      configreferidos crf ON cr.codigo = crf.id
      LEFT JOIN 
      usuarios u ON u.nombre = u.username 
      LEFT JOIN 
      participacionreferidos p2 ON p2.referido = cr.codigo
      WHERE p.fecha BETWEEN '${fechaInicioFormatted}00:00:00' AND '${fechaFinFormatted}00:00:00'
      AND c.nombre in (${campanias});	
    `, { type: sequelize.QueryTypes.SELECT });
    
    const participacionesConCliente = await Promise.all(participaciones.map(async (participacion) => {
      const customerInfo = await getCustomerById(participacion.customerId);
      participacion.customerInfo = customerInfo; 
      return participacion;
    }));

    return participacionesConCliente;
  }

catch (error) {
  console.error('Error al obtener las participaciones":', error);
  throw new Error('Error al obtener las participaciones' );
}
};


const getCustomerById = async (customerid) => {
  try {
   
    const customerInfo = await pronet.query(`
    SELECT ui.userid,
          ui.userno as noreferido,
                cu.customer_id,
                cu.customer_reference,
                cu.telno,
                cu.fk_userid,
                ri.idUsuario,
                ri.codigo,
                
    CONCAT(uir.fname, ' ', uir.lname) AS nombreReferido
            FROM 
                pronet.tbl_customer cu
            JOIN 
                pronet.tblUserInformation ui ON cu.telno = ui.userno
                LEFT JOIN    
                genesis.codigos_referidos ri on cu.fk_userid = ri.idcodigos_referidos
                LEFT JOIN 
                genesis.referidos_ingresos ru on ri.idcodigos_referidos = ru.idcodigos_referidos
                
                INNER JOIN  pronet.tblUserInformation uic ON uic.userid = cu.fk_userid
                
                INNER JOIN pronet.tblUserInformation uir ON uir.userid = cu.fk_userid
WHERE 
    cu.customer_id = (${customerid}) 
    
        
    `, {
      type: pronet.QueryTypes.SELECT
    });

return customerInfo;

  } catch (error) {
    console.error('Error al obtener participaciones en la base de datos "genesis":', error);
    throw new Error('Error al obtener participaciones');
}
};


module.exports = { getParticipaciones, getCustomerById };
