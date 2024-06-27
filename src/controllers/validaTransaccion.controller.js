//VAIDACION FUNCIONAL 



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
        const customerInfo = [
            {
                idParticipacion: 19,
                fk_customer_id: 130,
                fecha: '2024-09-06T00:32:00.000Z',
                descripcionTrx: 'Recarga de Saldo',
                idPremio: 24,
                idCampania: 33,
                idTransaccion: 1
            },
            
        ];

        console.log('Data obtenida de pronet:', customerInfo);

        const { transaccionesValidadas, transaccionesSospechosas } = await validarTransaccion(customerInfo);
        // const { transaccionesValidadas2, transaccionesSospechosas2 } = await validarDuplicados(customerInfo);

        console.log('Transacciones validadas (primera validación):', transaccionesValidadas);
        console.log('Transacciones sospechosas (primera validación):', transaccionesSospechosas);
        // console.log('Transacciones validadas (segunda validación):', transaccionesValidadas2);
        // console.log('Transacciones sospechosas (segunda validación):', transaccionesSospechosas2);

        res.status(200).json({
            transaccionesValidadas: transaccionesValidadas,
            transaccionesSospechosasPrimeraValidacion: transaccionesSospechosas,
            // transaccionesValidadasSegundaValidacion: transaccionesValidadas2,
            // transaccionesSospechosasSegundaValidacion: transaccionesSospechosas2
        });
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

            for (const info of customerInfo) {
                const { fk_customer_id, fecha, idCampania, idParticipacion, idPremio, idTransaccion } = info;

                if (fk_customer_id === customerId) {
                    const participaciones = await Participacion.findAll({
                        where: {
                            customerId: fk_customer_id,
                            fecha: {
                                [Op.between]: [
                                    sequelize.literal(`DATE_SUB('${fecha}', INTERVAL 2 MINUTE)`),
                                    sequelize.literal(`DATE_ADD('${fecha}', INTERVAL 2 MINUTE)`)
                                ]
                            },
                            idCampania,
                            id: {
                                [Op.ne]: idParticipacion
                            },
                            idPremio,
                            idTransaccion
                        },
                        order: [['fecha', 'ASC']]
                    });

                    if (participaciones.length > 0) {
                        transaccionesSospechosas.push(info); 

                        await sequelize.transaction(async (t) => {
                            await FailTransaccion.create({
                                idCampania: info.idCampania,
                                idTransaccion: info.idTransaccion,
                                idParticipacion: info.idParticipacion,
                                failmessage: 'Transacción sospechosa: duplicado dentro de 2 minutos',
                                estado: 1
                            }, { transaction: t });
                        });
                    } else {
                        transaccionesValidadas.push(info);  
                    }
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



const validarDuplicados = async (customerInfo) => {
    const transaccionesValidadas2 = [];
    const transaccionesSospechosas2 = [];

    try {
        for (const info of customerInfo) {
            const { fk_customer_id, idCampania, idPremio, idParticipacion, idTransaccion } = info;

            const participacionesDuplicadas = await Participacion.findAll({
                where: {
                    customerId: fk_customer_id,
                    idCampania: idCampania,
                    idPremio: idPremio,
                    id: {
                        [Op.ne]: idParticipacion
                    }
                }
            });

            if (participacionesDuplicadas.length > 0) {
                transaccionesSospechosas2.push(info);

                await sequelize.transaction(async (t) => {
                    await FailTransaccion.create({
                        idCampania: idCampania,
                        idTransaccion: idTransaccion,
                        idParticipacion: idParticipacion,
                        failmessage: 'Transacción sospechosa: el premio ya fue canjeado con anterioridad',
                        estado: 1
                    }, { transaction: t });
                });
            } else {
                transaccionesValidadas2.push(info);
            }
        }
    } catch (error) {
        console.error(`Error al validar duplicados: ${error.message}`);
    }

    return {
        transaccionesValidadas2,
        transaccionesSospechosas2
    };
};

module.exports = { getransaccion };