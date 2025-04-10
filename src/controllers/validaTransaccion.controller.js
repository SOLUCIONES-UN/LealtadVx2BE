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
const { Configurevalidation } = require('../models/configurevalidation');
const { CampaniaValidation } = require('../models/campaniaValidation');
const { TransaccionesTerceros } = require("../models/transaccionesTerceros");

async function getCustomerInfoFromPronet(customerId) {
    try {
        const query = `
            SELECT telno 
            FROM pronet.tbl_customer 
            WHERE customer_id = :customerId;
        `;
        const results = await pronet.query(query, {
            replacements: { customerId },
            type: Sequelize.QueryTypes.SELECT
        });

        if (results.length > 0) {
            const telno = results[0].telno;
            return telno;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

async function getFailTransaccionsByCampania(req, res) {
    try {
        const { campaniaId } = req.params;

        const transacciones = await FailTransaccion.findAll({
            where: {
                idCampania: campaniaId,
                estado: {
                    [Op.in]: [1]
                }
            },
            include: [{
                    model: Campania,
                    attributes: ['nombre'],
                    required: true
                },
                {
                    model: Participacion,
                    attributes: ['customerId'],
                    required: true
                }
            ]
        });

        for (const transaccion of transacciones) {
            const customerId = transaccion.participacion ? transaccion.participacion.customerId : null;

            if (customerId) {
                const telno = await getCustomerInfoFromPronet(customerId);

                if (telno) {
                    transaccion.dataValues.telno = telno;
                } else {
                    transaccion.dataValues.telno = 'Teléfono no encontrado';
                }
            } else {
                transaccion.dataValues.telno = 'Teléfono cliente no disponible';
            }
        }

        res.json(transacciones);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las transacciones fallidas' });
    }
}

async function getFailTransaccions(req, res) {
    try {
        const transacciones = await FailTransaccion.findAll({
            where: {
                estado: {
                    [Op.in]: [1]
                }
            },
            include: [{
                    model: Campania,
                    attributes: ['nombre'],
                    required: true
                },
                {
                    model: Participacion,
                    attributes: ['customerId'],
                    required: true
                }
            ]
        });

        const promesasTelno = transacciones.map(async(transaccion) => {
            const customerId = transaccion.participacion ? transaccion.participacion.customerId : null;

            if (customerId) {
                const telno = await getCustomerInfoFromPronet(customerId);

                if (telno) {
                    transaccion.dataValues.telno = telno;
                } else {
                    transaccion.dataValues.telno = 'Teléfono no encontrado';
                }
            } else {
                transaccion.dataValues.telno = 'Teléfono no disponible';
            }
        });

        await Promise.all(promesasTelno);

        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las transaccciones fallidas' });
    }
}

const validaciones = ['primera', 'segunda', 'tercera', 'primera_segunda', 'primera_tercera', 'segunda_tercera', 'ambas'];

const getransaccion = async (req, res) => {
    try {

        const transacciones = await TransaccionesTerceros.findAll();

        if (!transacciones || transacciones.length === 0) {
            return res.status(404).json({ message: 'Transacciones no encontradas' });
        }

        const customerInfoPromises = transacciones.map(async (trx) => {
            const participacion = await Participacion.findOne({
                where: {
                    customerId: trx.customerId
                },
                attributes: ['idCampania', 'idPremio']
            });

            return {
                idParticipacion: trx.id,
                fk_customer_id: trx.customerId,
                fecha: trx.fechaTransaccion ? trx.fechaTransaccion.toISOString() : new Date().toISOString(), // Default to current date if not provided
                descripcionTrx: trx.descTransaccion,
                idPremio: participacion ? participacion.idPremio : null,
                idCampania: participacion ? participacion.idCampania : null,
                idTransaccion: trx.id
            };
        });

        const customerInfo = await Promise.all(customerInfoPromises);

        if (customerInfo.length === 0) {
            return res.status(404).json({ message: 'No se encontraron participaciones relacionadas' });
        }

            // let customerInfo = [{
            //     idParticipacion: 24,
            //     fk_customer_id: 242,
            //     fecha: '2024-07-29T12:12:00.000Z',
            //     descripcionTrx: 'Recarga de saldo Tigo 3',
            //     idPremio: 24,
            //     idCampania: 26,
            //     idTransaccion: 1
            // }];

        const idCampania = customerInfo[0].idCampania;

        const campaniaValidation = await CampaniaValidation.findOne({
            where: {
                idCampania: idCampania,
                estado: 1,
            },
            include: {
                model: Configurevalidation,
                required: true,
                where: {
                    estado: 1
                }
            }
        });

        if (!campaniaValidation) {
            return res.status(400).json({ message: 'No se encontró una configuración válida para la campaña' });
        }

        const config = campaniaValidation.configurevalidation;
        const tiempoIntervalo = config.time_minutes;
        const cantTransaccion = config.cantTransaccion_time;
        const validacionesSeleccionadas = [config.validacion];

        let transaccionesValidadas = [];
        let transaccionesSospechosas = [];
        let transaccionesValidadas2 = [];
        let transaccionesSospechosas2 = [];
        let transaccionesValidadas3 = [];
        let transaccionesSospechosas3 = [];

        const numeroTransacciones = await contarTransacciones(customerInfo[0].fk_customer_id, customerInfo[0].fecha, tiempoIntervalo);

        if (numeroTransacciones >= cantTransaccion) {
            return res.status(400).json({ message: 'Se está excediendo el límite de transacciones, intente de nuevo más tarde' });
        }

        for (const validacion of validacionesSeleccionadas) {
            if (validacion === 1 || validacion === 4) {
                const resultadoPrimeraValidacion = await validarTransaccion(customerInfo, tiempoIntervalo);
                transaccionesValidadas.push(...resultadoPrimeraValidacion.transaccionesValidadas);
                transaccionesSospechosas.push(...resultadoPrimeraValidacion.transaccionesSospechosas);
            }

            if ((validacion === 2 || validacion === 4) && transaccionesSospechosas.length === 0) {
                const resultadoSegundaValidacion = await validarDuplicados(customerInfo);
                transaccionesValidadas2.push(...resultadoSegundaValidacion.transaccionesValidadas2);
                transaccionesSospechosas2.push(...resultadoSegundaValidacion.transaccionesSospechosas2);
            }

            if ((validacion === 3 || validacion === 4) && transaccionesSospechosas.length === 0 && transaccionesSospechosas2.length === 0) {
                const resultadoTerceraValidacion = await validarValorTotalPorDia(customerInfo);
                transaccionesValidadas3.push(...resultadoTerceraValidacion.transaccionesValidadas3);
                transaccionesSospechosas3.push(...resultadoTerceraValidacion.transaccionesSospechosas3);
            }
        }

        res.status(200).json({
            transaccionesValidadas,
            transaccionesSospechosasPrimeraValidacion: transaccionesSospechosas,
            transaccionesValidadasSegundaValidacion: transaccionesValidadas2,
            transaccionesSospechosasSegundaValidacion: transaccionesSospechosas2,
            transaccionesValidadasTerceraValidacion: transaccionesValidadas3,
            transaccionesSospechosasTerceraValidacion: transaccionesSospechosas3
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener participaciones' });
    }
};

const contarTransacciones = async (customerId, fecha, tiempoIntervalo) => {

    const participaciones = await Participacion.count({
        where: {
            customerId: customerId,
            fecha: {
                [Op.between]: [
                    sequelize.literal(`DATE_SUB('${fecha}', INTERVAL ${tiempoIntervalo} MINUTE)`),
                    sequelize.literal(`DATE_ADD('${fecha}', INTERVAL ${tiempoIntervalo} MINUTE)`)
                ]
            }
        }
    });
    return participaciones;
};

const validarTransaccion = async (customerInfo, tiempoIntervalo, cantTransaccion) => {
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
                                    sequelize.literal(`DATE_SUB('${fecha}', INTERVAL ${tiempoIntervalo} MINUTE)`),
                                    sequelize.literal(`DATE_ADD('${fecha}', INTERVAL ${tiempoIntervalo} MINUTE)`)
                                ]
                            },
                            idCampania,
                            id: {
                                [Op.ne]: idParticipacion
                            },
                            idPremio,
                            idTransaccion
                        },
                        order: [
                            ['fecha', 'ASC']
                        ]
                    });

                    if (participaciones.length >= cantTransaccion) {
                        return { error: `Se está excediendo el límite de ${cantTransaccion} transacciones en ${tiempoIntervalo} minutos. Intente de nuevo más tarde.` };
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

const validarDuplicados = async(customerInfo) => {
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

                await sequelize.transaction(async(t) => {
                    await FailTransaccion.create({
                        idCampania: idCampania,
                        idTransaccion: idTransaccion,
                        idParticipacion: idParticipacion,
                        fecha,
                        failmessage: 'El premio ya fue canjeado con anterioridad',
                        codigoError: 2,
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

const validarValorTotalPorDia = async(customerInfo) => {
    const transaccionesValidadas3 = [];
    const transaccionesSospechosas3 = [];

    try {
        for (const info of customerInfo) {
            const { fk_customer_id, idCampania, fecha, idParticipacion, idTransaccion, valor } = info;

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

            const totalValor = parseFloat(participacionesDia[0].totalValor) || 0;

            if (totalValor >= 1000) {
                transaccionesSospechosas3.push(info);

                await sequelize.transaction(async(t) => {
                    await FailTransaccion.create({
                        idCampania: idCampania,
                        idTransaccion: idTransaccion,
                        idParticipacion: idParticipacion,
                        fecha,
                        failmessage: 'Transacción sospechosa: el total de valor de participaciones para este cliente y campaña en el día excede el valor de 1000',
                        codigoError: 3,
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

const aceptarTransaccionSospechosa = async(req, res) => {

    try {
        const { id } = req.params;
        const { motivo } = req.body;
        await FailTransaccion.update({
            estado: 2,
            motivo: motivo
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Transacción sospechosa aceptada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar pausar la Promocion.' });
    }
}

const rechazarTransaccion = async(req, res) => {

    try {
        const { id } = req.params;
        const { motivo } = req.body;
        await FailTransaccion.update({
            estado: 0,
            motivo: motivo
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Transacción sospechosa rechazada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar rechazar la transaccion.' });
    }
}


module.exports = { getransaccion, getFailTransaccions, rechazarTransaccion, aceptarTransaccionSospechosa, getFailTransaccionsByCampania, getCustomerInfoFromPronet };