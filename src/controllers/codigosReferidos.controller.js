const { sequelize, pronet } = require("../database/database");
const { codigoReferidos } = require("../models/codigoReferidos");
// Importa la instancia de Sequelize para la base de datos principal

const generarCodigoReferido = () => {
  let codigo = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const characterLength = characters.length;

  for (let i = 0; i <= 10; i++) {
    codigo += characters.charAt(Math.floor(Math.random() * characterLength));
  }

  return codigo;
};

const getCodigoReferido = async (req, res) => {
  const { customerId } = req.body;
  try {
    const codigo = await codigoReferidos.findOne({
      where: {
        customerId: customerId,
        estado: 1,
      },
      attributes: ["codigo"],
    });

    if (codigo !== null) {
      res.json(codigo);
    } else {
      const codigo = generarCodigoReferido();
      const fecha = new Date();

      await codigoReferidos.create({
        codigo,
        fecha,
        customerId,
      });

      res.json(codigo);
    }
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors:
        "Ha sucedido un  error al intentar realizar la consulta de Categoria.",
    });
  }
};

const getCodigoReferidoByPhone = async (req, res) => {
  const { phone } = req.body;
  try {
    // Consulta a la base de datos lealtadV2

    // Consulta a la base de datos pronet
    const queryPronet = `
        SELECT c.customer_id as customer
        FROM tbl_customer c 
        WHERE c.telno = '${phone}'
        ORDER BY c.customer_id
        DESC LIMIT 1
      `;
    const [resultsPronet, metadataPronet] = await pronet.query(queryPronet);
  
      
    const queryLealtadV2 = `
        SELECT a.id, a.codigo
        FROM codigosreferidos a 
        WHERE  customerId = ${resultsPronet[0].customer}
        ORDER BY a.id 
        DESC LIMIT 1
      `;
    const [resultsLealtadV2, metadataLealtadV2] = await sequelize.query(
      queryLealtadV2
    );

    res.json(resultsLealtadV2);
  } catch (error) {
    console.error("Ocurrió un error:", error);
    res.status(403).send({
      errors: "Ha ocurrido un error al intentar obtener el código de referido.",
    });
  }
};

const actualizarCodigoReferido = async (req, res) => {
  const { id, codigo } = req.body;

  try {
    // Actualizar el código de referido utilizando Sequelize
    const [rowsAffected, _] = await sequelize.query(
      `
      UPDATE codigosreferidos
      SET codigo = :codigo  
      WHERE id = :id
      `,  
      {
        replacements: { codigo:codigo , id:id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

      res.status(200).send({
        code: 'ok',
        message: "Datos actualizados exitosamente",
      });
    
  } catch (error) {
    console.error("Ocurrió un error:", error);
    res.status(403).send({
      errors:
        "Ha ocurrido un error al intentar actualizar el código de referido.",
    });
  }
};

  
module.exports = {
  getCodigoReferido,
  actualizarCodigoReferido,
  getCodigoReferidoByPhone
};
