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
        campania c
      LEFT JOIN 
        participacions pr ON c.id = pr.idCampania 
      LEFT JOIN 
        codigosreferidos cr ON cr.customerId = pr.customerId 
      LEFT JOIN 
        configreferidos crf ON cr.codigo = crf.id
      LEFT JOIN 
        premios p ON p.id = pr.id 
      LEFT JOIN 
        usuarios u ON u.nombre = u.username 
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
    
    res.json({ participantesCamp});
  } catch (error) {
    console.error("Error al obtener los participantes por año y mes:", error);
    res.status(500).json({ error: "Error al obtener los participantes por año y mes" });
  }
};

module.exports = { getUsuariosParticipantesFechasCampanasSel };
