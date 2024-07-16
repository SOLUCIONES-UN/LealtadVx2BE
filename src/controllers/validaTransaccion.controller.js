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
                    [Op.in]: [1, 2]
                }
            },
            include: [
                {
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
                    [Op.in]: [1, 2]
                }
            },
            include: [
                {
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

        const promesasTelno = transacciones.map(async (transaccion) => {
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

const getransaccion = async(req, res) => {
    try {
        const customerInfo = [{
            idParticipacion: 19,
            fk_customer_id: 130,
            fecha: '2024-09-06T00:32:00.000Z',
            descripcionTrx: 'Recarga de Saldo',
            idPremio: 24,
            idCampania: 33,
            idTransaccion: 1
        }, ];

        const validacionesSeleccionadas = ['primera'];

        console.log('Data obtenida de pronet:', customerInfo);
        console.log('Validaciones solicitadas:', validacionesSeleccionadas);

        let transaccionesValidadas = [];
        let transaccionesSospechosas = [];
        let transaccionesValidadas2 = [];
        let transaccionesSospechosas2 = [];
        let transaccionesValidadas3 = [];
        let transaccionesSospechosas3 = [];

        for (const validacion of validacionesSeleccionadas) {
            if (validacion === 'primera' || validacion === 'ambas') {
                const resultadoPrimeraValidacion = await validarTransaccion(customerInfo);
                transaccionesValidadas.push(...resultadoPrimeraValidacion.transaccionesValidadas);
                transaccionesSospechosas.push(...resultadoPrimeraValidacion.transaccionesSospechosas);
            }

            if ((validacion === 'segunda' || validacion === 'ambas') && transaccionesSospechosas.length === 0) {
                const resultadoSegundaValidacion = await validarDuplicados(customerInfo);
                transaccionesValidadas2.push(...resultadoSegundaValidacion.transaccionesValidadas2);
                transaccionesSospechosas2.push(...resultadoSegundaValidacion.transaccionesSospechosas2);
            }

            if ((validacion === 'tercera' || validacion === 'ambas') && transaccionesSospechosas.length === 0 && transaccionesSospechosas2.length === 0) {
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
        console.error('Error al obtener participaciones en la base de datos "genesis":', error);
        res.status(500).json({ message: 'Error al obtener participaciones' });
    }
};

const validarTransaccion = async(customerInfo) => {
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
                        order: [
                            ['fecha', 'ASC']
                        ]
                    });

                    if (participaciones.length > 0) {
                        transaccionesSospechosas.push(info);

                        await sequelize.transaction(async(t) => {
                            await FailTransaccion.create({
                                idCampania: info.idCampania,
                                idTransaccion: info.idTransaccion,
                                idParticipacion: info.idParticipacion,
                                fecha,
                                failmessage: 'Transacción sospechosa: mas de una transaccion en un rango de 2 minutos',
                                codigoError: 1,
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

            console.log(`Total valor para la campaña ${idCampania} en el día ${fecha}: ${totalValor}`);

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

const aceptarTransaccionSospechosa = async (req, res) => {

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

const rechazarTransaccion = async (req, res) => {

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