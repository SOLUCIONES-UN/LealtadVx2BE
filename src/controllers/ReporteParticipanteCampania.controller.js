const { Sequelize } = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database");

const getUsuariosParticipantesFechasCampanasSel = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, campanias, incluirArchivadas } = req.body;
    console.log(incluirArchivadas);
    console.log(fechaInicio);
    console.log(fechaFin);

    // Construcción de la consulta SQL para participantes de campañas
    let queryParticipantes = `
      SELECT 
        c.nombre AS nombre_campania,
        pr.fecha as fechaParticipacion,
        pr.descripcionTrx,
        pr.valor, 
        p.descripcion as premio, 
        p.descripcion as descripcionpremio,
        cr.codigo AS codigo,
        u.nombre AS nombre_usuario,
        u.telefono AS telefono_usuario
      FROM 
        Campania c
      LEFT JOIN 
        Participacions pr ON c.id = pr.idCampania 
      LEFT JOIN 
        CodigosReferidos cr ON cr.customerId = pr.customerId 
      LEFT JOIN 
        ConfigReferidos crf ON cr.codigo = crf.id
      LEFT JOIN 
        premios p ON p.id = pr.id 
      LEFT JOIN 
        Usuarios u ON u.nombre = u.username 
      WHERE pr.fecha BETWEEN '${fechaInicio}' AND '${fechaFin}'
    `;
    
    // Agregar condición para incluir campañas archivadas
    if (!incluirArchivadas) {
      queryParticipantes += " AND c.esArchivada = 0";
    }
    
    // Agregar condición para campañas específicas si se proporcionan
    if (campanias && campanias.length > 0) {
      const campaniasList = campanias.map(c => `'${c}'`).join(", ");
      queryParticipantes += ` AND c.nombre IN (${campaniasList})`;
    }

    // Ejecutar consulta para participantes de campañas
    const participantesCamp = await sequelize.query(queryParticipantes, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Construcción de la consulta SQL para información personalizada
    let queryInfoCustom = `
      SELECT 
        tur.mname,
        CONCAT(tur.fname, ' ', tur.lname) AS nombreUsuario,
        tur.userno AS telefono,
        tur.userid
      FROM
        genesis.participante_campana pc
      INNER JOIN
        pronet.tbl_customer tc ON tc.customer_id = pc.idUsuarioParticipante
      INNER JOIN
        genesis.referidos_ingresos rin ON rin.idreferidos_ingresos = pc.idTransaccion
      INNER JOIN
        pronet.tbl_customer tcr ON tcr.customer_id = rin.usuario
      INNER JOIN
        pronet.tblUserInformation tur ON tur.userid = tcr.fk_userid
      WHERE
        pc.fechaParticipacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
    `;

    // Ejecutar consulta para información personalizada
    const infoCustom = await genesis.query(queryInfoCustom, {
      type: genesis.QueryTypes.SELECT
    });

    res.json({ participantesCamp, infoCustom });
  } catch (error) {
    console.error("Error al obtener los participantes por año y mes:", error);
    res.status(500).json({ error: "Error al obtener los participantes por año y mes" });
  }
};

module.exports = { getUsuariosParticipantesFechasCampanasSel };
