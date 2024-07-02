const Sequelize = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database");

const getReporteNoficacionesOffer = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;

        const queryNotificaciones = await sequelize.query(`
        SELECT 
        c.nombre AS nombreCampania, 
        p2.descripcion AS descripcionPremio,
        DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS fechaParticipacion, 
        'Pendiente' AS premio 
    FROM 
        participacions p
    INNER JOIN 
        premios p2 ON p2.id = p.id
    INNER JOIN 
        campania c ON c.id = p.idCampania 
    INNER JOIN 
        usuarios u ON u.username = p2.usuario
       
        `, {
            replacements: { fechaInicio, fechaFin },
            type: Sequelize.QueryTypes.SELECT
        });
    
        const customerinfo = await genesis.query(`
        SELECT 
        tc.telno telefono,
        CONCAT(tui.fname, ' ', tui.mname, ' ', tui.lname, ' ', tui.slname) nombre,
        pc.descTransaccion,pc.valorPremio,
        pc.idTransaccion as numeroTransaccion,
        ec.nombreCampana campana,ec.idCampana,p.idPremio,p.descripcion,p.link,p.claveSecreta  ,p.estado,ec.fechaInicio, ec.fechaFinal,
        DATE_FORMAT(pc.fechaParticipacion, '%d/%m/%Y %H:%i') fecha, 'Pendiente' premio
       FROM genesis.participante_campana pc
       JOIN genesis.premios p ON p.idPremio = pc.idPremio
       JOIN pronet.tbl_customer tc ON tc.customer_id = pc.idUsuarioParticipante
       JOIN pronet.tblUserInformation tui ON tui.userid = tc.fk_userid
       JOIN genesis.enc_campana ec ON ec.idCampana = pc.idCampana
       WHERE p.idTransaccion = 0 AND pc.fechaParticipacion  BETWEEN '2023-05-15' AND '2024-05-15';
        `, {
            replacements: { fechaInicio, fechaFin },
            type: Sequelize.QueryTypes.SELECT
        });

        res.json({ queryNotificaciones, customerinfo });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};
const SendNotification = async  (req, res)=>{
   
   



}


module.exports = { getReporteNoficacionesOffer, SendNotification};