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

    // Ordenamos las transacciones por fecha
    transaccionesConPremio.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    transaccionesConPremio.forEach((transaccion, index, array) => {
        if (index === 0) {
            transaccionesValidadas.push(transaccion);
            return;
        }

        const transaccionActual = new Date(transaccion.fecha);
        const transaccionAnterior = new Date(array[index - 1].fecha);

        const diferenciaMinutos = Math.abs((transaccionActual - transaccionAnterior) / (1000 * 60));

        if (diferenciaMinutos < 2) {
            if (!transaccionesDuplicadas.includes(array[index - 1])) {
                transaccionesDuplicadas.push(array[index - 1]);
            }
            transaccionesDuplicadas.push(transaccion);
        } else {
            transaccionesValidadas.push(transaccion);
        }

        if (index === array.length - 1 && diferenciaMinutos < 2 && !transaccionesDuplicadas.includes(transaccion)) {
            transaccionesDuplicadas.push(transaccion);
        }
    });

    return {
        transaccionesValidadas,
        transaccionesDuplicadas
    };
};






const validarTransaccionesConPremio = (participaciones) => {
    const transaccionesConPremio = participaciones.filter(p => p.idPremio !== null && p.idPremio !== undefined);

    const { transaccionesValidadas, transaccionesDuplicadas } = validarTransaccionesDuplicadas(transaccionesConPremio);

    return {
        transaccionesConPremio: transaccionesValidadas,
        transaccionesDuplicadas
    };
};


const getransaccion = async(req, res) => {
    try {
        const participaciones = await Participacion.findAll({
            where: {
                estado: 1
            },
            include: {
                model: Transaccion,
            }
        });


        const { transaccionesConPremio, transaccionesDuplicadas } = validarTransaccionesConPremio(participaciones);

        res.status(200).json({
            transaccionesConPremio,
            transaccionesDuplicadas
        });
    } catch (error) {
        console.error('Error al obtener participaciones en la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener participaciones' });
    }
};
module.exports = { getransaccion };