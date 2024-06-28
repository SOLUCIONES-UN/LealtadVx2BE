


const { Sequelize } = require("sequelize");
const { genesis, pronet, sequelize } = require("../database/database");
const { Campania } = require('../models/campanias');
const { participacionReferidos } = require('../models/participacionReferidos');
const { codigoReferido } = require('../models/codigoReferidos');
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

       
        const validacion = 'tercera'; 

        console.log('Data obtenida de pronet:', customerInfo);
        console.log('Validación solicitada:', validacion);

        let transaccionesValidadas = [];
        let transaccionesSospechosas = [];
        let transaccionesValidadas2 = [];
        let transaccionesSospechosas2 = [];
        let transaccionesValidadas3 = []; // Nuevo array para resultados de la tercera validación
        let transaccionesSospechosas3 = []; // Nuevo array para transacciones sospechosas de la tercera validación

        if (validacion === 'primera' || validacion === 'ambas') {
            const resultadoPrimeraValidacion = await validarTransaccion(customerInfo);
            transaccionesValidadas = resultadoPrimeraValidacion.transaccionesValidadas;
            transaccionesSospechosas = resultadoPrimeraValidacion.transaccionesSospechosas;

            console.log('Transacciones validadas (primera validación):', transaccionesValidadas);
            console.log('Transacciones sospechosas (primera validación):', transaccionesSospechosas);
        }

        if ((validacion === 'segunda' || validacion === 'ambas') && transaccionesSospechosas.length === 0) {
            const resultadoSegundaValidacion = await validarDuplicados(customerInfo);
            transaccionesValidadas2 = resultadoSegundaValidacion.transaccionesValidadas2;
            transaccionesSospechosas2 = resultadoSegundaValidacion.transaccionesSospechosas2;

            console.log('Transacciones validadas (segunda validación):', transaccionesValidadas2);
            console.log('Transacciones sospechosas (segunda validación):', transaccionesSospechosas2);
        }

        // Añadimos la tercera validación si es solicitada
        if ((validacion === 'tercera' || validacion === 'ambas') && transaccionesSospechosas.length === 0 && transaccionesSospechosas2.length === 0) {
            const resultadoTerceraValidacion = await validarValorTotalPorDia(customerInfo);
            transaccionesValidadas3 = resultadoTerceraValidacion.transaccionesValidadas3;
            transaccionesSospechosas3 = resultadoTerceraValidacion.transaccionesSospechosas3;

            console.log('Transacciones validadas (tercera validación):', transaccionesValidadas3);
            console.log('Transacciones sospechosas (tercera validación):', transaccionesSospechosas3);
        }

        res.status(200).json({
            transaccionesValidadas,
            transaccionesSospechosasPrimeraValidacion: transaccionesSospechosas,
            transaccionesValidadasSegundaValidacion: transaccionesValidadas2,
            transaccionesSospechosasSegundaValidacion: transaccionesSospechosas2,
            PuedeSeguirJugando: transaccionesValidadas3, 
            transaccionesSospechosasTerceraValidacion: transaccionesSospechosas3 
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
                                fecha,
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
            const { fk_customer_id, idCampania, idPremio, idParticipacion, idTransaccion, fecha } = info;

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
                        fecha,
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






const validarValorTotalPorDia = async (customerInfo) => {
    const transaccionesValidadas3 = [];
    const transaccionesSospechosas3 = [];

    try {
        for (const info of customerInfo) {
            const { fk_customer_id, idCampania, fecha, idParticipacion, idTransaccion } = info;

            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);

            const fechaFin = new Date(fechaInicio);
            fechaFin.setHours(23, 59, 59, 999);

            const participacionesDia = await Participacion.findAll({
                where: {
                    customerId: fk_customer_id,
                    idCampania: idCampania,
                    fecha: {
                        [Op.between]: [fechaInicio, fechaFin]
                    },
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('valor')), 'totalValor']
                ],
                raw: true
            });

            const totalValor = participacionesDia[0].totalValor || 0;

            console.log(`Total valor para la campaña ${idCampania} en el día ${fecha}: ${totalValor}`);

            if (totalValor + parseFloat(info.valor) >= 1000) {
                transaccionesSospechosas3.push(info);

                await sequelize.transaction(async (t) => {
                    await FailTransaccion.create({
                        idCampania: idCampania,
                        idTransaccion: idTransaccion,
                        idParticipacion: idParticipacion,
                        fecha,
                        failmessage: 'Transacción sospechosa: el total de valor de participaciones para este cliente y campaña en el día excede 1000',
                        estado: 1
                    }, { transaction: t });
                });
            } else {
                transaccionesValidadas3.push(info);
            }
        }
    } catch (error) {
        console.error(`Error al validar valor total por día: ${error.message}`);
    }

    return {
        transaccionesValidadas3,
        transaccionesSospechosas3
    };
};


module.exports = { getransaccion };