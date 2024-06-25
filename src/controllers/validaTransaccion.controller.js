
const { Sequelize } = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database"); 
const { Campania } = require('../models/campanias');
const { participacionReferidos } = require('../models/participacionReferidos');
const { codigoReferido } = require('../models/codigoReferidos');
// const { referidosIngresos } = require('../models/ReferidosIngresos'); // Aquí se agregó la importación faltante
const { ConfigReferido } = require('../models/configReferidos');
const { Usuario } = require('../models/usuario');
const { Op } = require('sequelize');
const { Participacion } = require('../models/Participacion');
const { Transaccion } = require('../models/transaccion');




const validarTransaccionesDuplicadas = (transaccionesConPremio) => {
  const transaccionesValidadas = [];
  const transaccionesDuplicadas = [];

  transaccionesConPremio.forEach((transaccion, index, array) => {
    const transaccionFecha = new Date(transaccion.fecha);

    const duplicado = array.some((otraTransaccion, otraIndex) => {
      if (index === otraIndex) return false;

      const otraTransaccionFecha = new Date(otraTransaccion.fecha);

      return (
        otraTransaccion.descripcionTrx === transaccion.descripcionTrx &&
        otraTransaccion.customerId === transaccion.customerId &&
        otraTransaccion.idPremio === transaccion.idPremio &&
        Math.abs(otraTransaccionFecha - transaccionFecha) < 2 * 60 * 1000 
      );
    });

    if (duplicado) {
      transaccionesDuplicadas.push(transaccion);
    } else {
      transaccionesValidadas.push(transaccion);
    }
  });

  return {
    transaccionesValidadas,
    transaccionesDuplicadas
  };
};

const validarTransaccionesConPremio = (participaciones) => {
  const transaccionesConPremio = participaciones.filter(p => p.urlPremio && p.urlPremio.trim() !== "");
  const transaccionesSinPremio = participaciones.filter(p => !p.urlPremio || p.urlPremio.trim() === "");

  const { transaccionesValidadas, transaccionesDuplicadas } = validarTransaccionesDuplicadas(transaccionesConPremio);

  return {
    transaccionesConPremio: transaccionesValidadas,
    transaccionesSinPremio,
    transaccionesDuplicadas
  };
};

const getransaccion = async (req, res) => {
  try {
    const participaciones = await Participacion.findAll({
      where: {
        estado: 1
      },
      include: {
        model: Transaccion,
      }
    });

    const { transaccionesConPremio, transaccionesSinPremio, transaccionesDuplicadas } = validarTransaccionesConPremio(participaciones);

    res.status(200).json({
      transaccionesConPremio,
      transaccionesSinPremio,
      transaccionesDuplicadas
    });
  } catch (error) {
    console.error('Error al obtener participaciones en la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener participaciones' });
  }
};
module.exports = { getransaccion };