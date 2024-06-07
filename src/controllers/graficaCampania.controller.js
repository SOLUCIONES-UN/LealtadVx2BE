const { sequelize } = require("../database/database");

const ObtenerParticipacionesByFecha = async (req, res) => {
  

  try {
    const { fechaInicio,fechaFin} = req.body;
    console.log(req.body);
    console.log(fechaInicio);
    console.log(fechaFin);
    const participantes = await sequelize.query(
      `
      SELECT p.idCampania, c.nombre, p.fecha,
      COUNT(p.idCampania) as participantes 
      FROM participacions p
      JOIN campania c ON c.id = p.idCampania  
      WHERE p.fecha >= '${fechaInicio}' AND p.fecha <= '${fechaFin}'
      GROUP BY p.idCampania, c.nombre, p.fecha;	
      `,
      {
        replacements: { fechaInicio:fechaInicio, fechaFin:fechaFin } ,
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(participantes);
    console.log(participantes);
  } catch (error) {
    console.error("Error al obtener los participantes por año y mes:", error);
    throw error;
  }
};


module.exports = { ObtenerParticipacionesByFecha };
