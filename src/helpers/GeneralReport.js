const { pronet, genesis } = require('../database/database');



const  getParticipacionesFechasGeneral = async (fecha1, fecha2) => {
    try {
        

        const fecha1Obj = fecha1 instanceof Date ? fecha1 : new Date(fecha1);
        const fecha2Obj = fecha2 instanceof Date ? fecha2 : new Date(fecha2);


        const fechaInicioFormatted = fecha1Obj.toISOString().split('T')[0];
        const fechaFinFormatted = fecha2Obj.toISOString().split('T')[0];


        const results = await genesis.query(`
            SELECT uic.userno, CONCAT(uic.fname, ' ', uic.lname) AS nombreReferidor, codRef.codigo, uir.userno AS noReferido,
            CONCAT(uir.fname, ' ', uir.lname) AS nombreReferido, DATE_FORMAT(ri.fecha, '%d/%m/%Y %H:%i') AS fecha
            FROM genesis.codigos_referidos codRef
            INNER JOIN genesis.referidos_ingresos ri ON codRef.idcodigos_referidos = ri.idcodigos_referidos
            INNER JOIN pronet.tbl_customer csc ON csc.customer_id = codRef.idUsuario
            INNER JOIN pronet.tblUserInformation uic ON uic.userid = csc.fk_userid
            INNER JOIN pronet.tbl_customer csr ON csr.customer_id = ri.usuario
            INNER JOIN pronet.tblUserInformation uir ON uir.userid = csr.fk_userid
            WHERE ri.fecha BETWEEN '${fechaInicioFormatted} 00:00:00' AND '${fechaFinFormatted} 23:59:59'
            LIMIT 10;
        `);

        
        return results;
        
    } catch (error) {
        console.error('Error al obtener participaciones en la base de datos "genesis":', error);
        throw new Error('Error al obtener participaciones');
    }
};

module.exports = { getParticipacionesFechasGeneral };


