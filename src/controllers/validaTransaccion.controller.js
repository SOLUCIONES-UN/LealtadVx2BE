const { Sequelize } = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database");
const { Campania } = require('../models/campanias');
const { participacionReferidos } = require('../models/participacionReferidos');
const { codigoReferido } = require('../models/codigoReferidos');
// const { referidosIngresos } = require('../models/ReferidosIngresos'); // Aquí se agregó la importación faltante
const { ConfigReferido } = require('../models/configReferidos');
const { Usuario } = require('../models/usuario');
const { Op } = require('sequelize');
const { Transaccion } = require('../models/transaccion');

const { Participacion } = require('../models/Participacion');
const { FailTransaccion } = require('../models/failTransaccion');





const getransaccion = async (req, res) => {
    try {
      const customerInfo = await pronet.query(`
        SELECT * FROM pronet.tbl_customer_transaction;
      `, {
        type: pronet.QueryTypes.SELECT
      });
      console.log('Data obtenida de pronet:', customerInfo);
      const { transaccionesValidadas, transaccionesSospechosas } = await validarTransaccion(customerInfo);
  
      console.log('Transacciones validadas:', transaccionesValidadas);
      console.log('Transacciones sospechosas:', transaccionesSospechosas);
  
      res.status(200).json({ transaccionesValidadas, transaccionesSospechosas });
    } catch (error) {
      console.error('Error al obtener participaciones en la base de datos "genesis":', error);
      res.status(500).json({ message: 'Error al obtener participaciones' });
    }
  };




  
  const validarTransaccion = async (customerInfo) => {
    const transaccionesValidadas = [];
    const transaccionesSospechosas = [];
  
    try {
      const customerIds = [...new Set(customerInfo.map(t => t.fk_customer_id))];
  
      for (const customerId of customerIds) {
        if (!customerId) {
          console.error('customerId está undefined o null en customerInfo:', customerInfo);
          continue;
        }
  
        const participacionExistente = await Participacion.findOne({
          where: { customerId }
        });
  
        if (!participacionExistente) {
          console.log(`No se encontraron participaciones para el customerId ${customerId}`);
          continue;
        }
  
        const participaciones = await Participacion.findAll({
          where: { customerId },
          order: [['fecha', 'ASC']]
        });
  
        for (let i = 0; i < participaciones.length; i++) {
          const participacionActual = participaciones[i];
  
          if (i < participaciones.length - 1) {
            const participacionSiguiente = participaciones[i + 1];
            const tiempoEntreParticipaciones = Math.abs((new Date(participacionSiguiente.fecha) - new Date(participacionActual.fecha)) / (1000 * 60));
  
            if (tiempoEntreParticipaciones < 2 &&
                participacionActual.idPremio === participacionSiguiente.idPremio &&
                participacionActual.idCampania === participacionSiguiente.idCampania &&
                participacionActual.idTransaccion === participacionSiguiente.idTransaccion) {
              
              transaccionesSospechosas.push(participacionActual);
              transaccionesSospechosas.push(participacionSiguiente);
  
              await sequelize.transaction(async (t) => {
                await FailTransaccion.create({
                  idCampania: participacionActual.idCampania,
                  idTransaccion: participacionActual.idTransaccion,
                  failmessage: 'Transacción sospechosa: duplicado dentro de 2 minutos según fecha.',
                  estado: 1
                }, { transaction: t });
  
                await FailTransaccion.create({
                  idCampania: participacionSiguiente.idCampania,
                  idTransaccion: participacionSiguiente.idTransaccion,
                  failmessage: 'Transacción sospechosa: duplicado dentro de 2 minutos según fecha.',
                  estado: 1
                }, { transaction: t });
  
                await Participacion.update(
                  { estado: 2 },
                  { where: { id: [participacionActual.id, participacionSiguiente.id] }, transaction: t }
                );
              });
  
              i++;
            }
          }
  
          if (!transaccionesSospechosas.includes(participacionActual)) {
            transaccionesValidadas.push(participacionActual);
          }
        }
      }
    } catch (error) {
      console.error(`Error al validar transacciones: ${error.message}`);
    }
  
    return {
      transaccionesValidadas,
      transaccionesSospechosas
    };
  };
  


module.exports = { getransaccion };