const { CampaniaInterna } = require('../models/campaniasinterno');
const { sequelize } = require('../database/database');
const { Op } = require('sequelize');
const { CampaniaInternoNumber } = require('../models/campaniaInternaNumber');
const { Premio } = require('../models/premio');
const { Customer } = require('../models/customerspro');
// const env = require('env');

const AddCampaniaInterna = async(req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            tituloNotificacion,
            descripcionNotificacion,
            imgCampania,
            imgNotificacion,
            estado,
            tipoCampania,
            observaciones,
            esArchivada,
            emails,
            terminos,
            idPremio,
            telefonos
        } = req.body;

        const newCampaniaInterna = await CampaniaInterna.create({
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            tituloNotificacion,
            descripcionNotificacion,
            imgCampania,
            imgNotificacion,
            estado,
            tipoCampania,
            observaciones,
            esArchivada,
            emails,
            terminos,
            idPremio
        }, { transaction });

        if (telefonos && telefonos.length > 0) {
            const numerosData = telefonos.map(telefono => ({
                telefono,
                estado: 1,
                idCampaniaInterna: newCampaniaInterna.id
            }));
            await CampaniaInternoNumber.bulkCreate(numerosData, { transaction });
        }

        await transaction.commit();
        return res.status(201).json({ code: 'ok', message: 'Campania Interna creado con exito.' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la campania interna:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar crear la campania interna', details: error.message });
    }
};


const GetCampaniaInternaActivas = async(req, res) => {
    try {
        const trx = await CampaniaInterna.findAll({

            where: {
                estado: [1, 2, 3]
            },
        });
        res.json(trx);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar obtener las Campanias Internas.",
        });
    }
};


const GetCampaniaInternaById = async(req, res) => {

    try {
        const { id } = req.params;
        const campaniainterna = await CampaniaInterna.findByPk(id, {
            include: [
                { model: CampaniaInternoNumber },
            ],
            where: {
                id: id,
                estado: 1,
            },
        });
        res.json(campaniainterna);
    } catch (error) {
        res.status(403).send({ errors: 'Ha sucedido un error al inentar obtener una Campaña Interna' });
    }
};

const GetTelnoCampaniasById = async(req, res) => {
    try {
        const { id } = req.params;
        const telefonos = await CampaniaInternoNumber.findByPk({
            where: {
                idCampaniaInterna: id
            }
        });
        res.json(telefonos);
    } catch (error) {
        console.log("ha error", telefonos);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener los telefonos de la Campaña Interna' });
    }
}

const GetTelnoCampanias = async(req, res) => {
    try {
        const trx = await CampaniaInternoNumber.findAll({

            where: {
                estado: [1]
            },
        });
        res.json(trx);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar obtener las Campanias Internas.",
        });
    }
};

const GetTelnoCustomerbilletera = async(req, res) => {
    try {

        const {idCampaniaInterna } = req.params;

        const customers = await Customer.findAll({
            attributes: ['telno']
        });

        const customerNumbers = customers.map(customer => customer.telno);

        const campaniaNumbers = await CampaniaInternoNumber.findAll({
            where: { idCampaniaInterna }
        });

        for (const campaniaNumber of campaniaNumbers) {
            if (customerNumbers.includes(campaniaNumber.telefono)) {
                if (campaniaNumber.estado !== 1) {
                    campaniaNumber.estado = 1;
                    await campaniaNumber.save();
                }
            } else {
                if (campaniaNumber.estado !== 2) {
                    campaniaNumber.estado = 2;
                    await campaniaNumber.save();
                }
            }
        }


        const updatedNumbers = await CampaniaInternoNumber.findAll({
            where: { idCampaniaInterna }
        });

        res.json(updatedNumbers);

    } catch (error) {
        console.error('Error al comparar y actualizar los números telefónicos:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar comparar y actualizar los números telefónicos.' });
    }
};

const GetTelnoCustomerbilleteras = async(req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['customer_id', 'telno']
        });

        res.json(customers);

    } catch (error) {
        console.error('Error al obtener los telefonos de la campaña interna:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar obtener los telefonos de los Usuarios Pronet' });
    }
}

const GetPremiosLink = async(req, res) => {
    try {
        const premios = await Premio.findAll({
            where: {
                estado: 1,
                link: {
                    [Op.and]: [{
                            [Op.ne]: null
                        },
                        {
                            [Op.ne]: ''
                        }
                    ]
                }
            }
        });

        res.status(200).json(premios);
    } catch (error) {
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener el premio por link.' });
    }
};

const PausarCampaniaInterna = async(req, res) => {
    try {
        const { id } = req.params;

        await CampaniaInterna.update({
            estado: 2,
        }, {
            where: {
                id: id,
            },
        });
        res.status(200).json({ code: 'ok', message: 'Campaña pausada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ error: 'Ha sucedido un error al intentar Pausar la Campaña Interna' });
    }
}

const ActivarCampaniaInterna = async(req, res) => {
    try {
        const { id } = req.params;

        await CampaniaInterna.update({
            estado: 1,
        }, {
            where: {
                id: id,
            },
        });

        res.status(200).json({ code: 'ok', message: 'Campaña activada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ error: 'Ha sucedido un error al intentar Activar la Campaña Interna' });
    }
}

const DeleteCampaniaInterna = async(req, res) => {
    try {

        const { id } = req.params;

        await CampaniaInterna.update({
            estado: 0,
        }, {
            where: {
                id: id,
            },
        });

        res.status(200).json({ code: 'ok', message: 'Campaña deshabilitada con exito' });

    } catch (error) {
        res.status(404)
        res.send({ errors: 'Ha sucedido un error al intentar deshabilitar la Campaña Interna' });
    }
}

const Addnumbers = async(req, res) => {
    let transaction;
    try {
        const { idCampaniaInterna, telefonos } = req.body;

        if (!Array.isArray(telefonos)) {
            return res.status(400).json({ code: 'error', message: 'El campo "telefonos" debe ser un array.' });
        }

        transaction = await sequelize.transaction();

        for (const telefono of telefonos) {
            const numExistente = await CampaniaInternoNumber.findOne({
                where: {
                    telefono: telefono,
                    idCampaniaInterna: idCampaniaInterna,
                },
                transaction
            });

            if (numExistente) {
                await transaction.rollback();
                return res.status(400).json({
                    code: 'error',
                    message: `El número ${telefono} ya existe en la campaña interna ${idCampaniaInterna}.`,
                });
            }


            await CampaniaInternoNumber.create({
                telefono: telefono,
                idCampaniaInterna: idCampaniaInterna
            }, { transaction });
        }

        await transaction.commit();
        return res.status(201).json({ code: 'ok', message: 'Números agregados con éxito.' });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error al agregar números:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar agregar los números', details: error.message });
    }
};


const actualizarNumero = async(req, res) => {
    try {
        const { id } = req.params;

        await CampaniaInternoNumber.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        })

        res.json({ code: 'ok', message: 'numero elminado con exito' });

    } catch (error) {
        console.error('Error al actualizar numero:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar actualizar el número', details: error.message });
    }
}


const enviarPremiosCampania = async(req, res) => {
    const { idCampaniaInterna, tituloNotificacion, descripcionNotificacion, valorpremiosPermitidos } = req.body;

    try {
        // Obtener la campaña interna
        const campania = await CampaniaInterna.findByPk(idCampaniaInterna);

        if (!campania) {
            return res.status(404).json({ message: 'Campaña interna no encontrada' });
        }

        // Obtener todos los números relacionados con la campaña que no estén deshabilitados
        const numeros = await CampaniaInternoNumber.findAll({
            where: {
                idCampaniaInterna: idCampaniaInterna,
                estado: 1
            }
        });

        if (numeros.length === 0) {
            return res.status(404).json({ message: 'No hay números habilitados para esta campaña' });
        }

        // Enviar premios a todos los números
        const resultados = [];
        for (const numero of numeros) {
            try {
                const username = process.env.OFFERCRAFT_USER;
                const password = process.env.OFFERCRAFT_PASSWORD;
                const apiKey = process.env.OFFERCRAFT_APIKEY;
                const urlConsumo = 'api/v1/marketing/sendindividual_promotions';

                const response = await axios.post(
                    urlConsumo, {
                        R1: numero.telefono,
                        R2: tituloNotificacion,
                        R3: descripcionNotificacion,
                        R4: '',
                        R5: ''
                    }, {
                        headers: {
                            'x-api-key': apiKey
                        },
                        auth: {
                            username,
                            password
                        }
                    }
                );

                resultados.push({ telefono: numero.telefono, resultado: response.data });
            } catch (error) {
                resultados.push({ telefono: numero.telefono, error: error.message });
            }
        }

        res.status(200).json({ message: 'Premios enviados', resultados });
    } catch (error) {
        console.error('Error al enviar premios:', error);
        res.status(500).json({ message: 'Error al enviar premios', details: error.message });
    }
};


const enviarPremioCampania = async(req, res) => {
    const {} = req.body;

    if (condicion) {
        try {
            const username = process.env.OFFERCRAFT_USER;
            const password = process.env.OFFERCRAFT_PASSWORD;
            const urlConsumo = 'api/v1/marketing/sendindividual_promotions';

            const response = await axios.post(
                urlConsumo, {
                    R1: telefono,
                    R2: tituloNotificacion,
                    R3: descripcionNotificacion,
                    R4: '',
                    R5: ''
                }, {
                    headers: {
                        'x-api-key': '7T1S9KEIKYQBCO30SHJSW'
                    },
                    auth: {
                        username,
                        password
                    }
                }
            );

            return res.status(200).json({ estadoTransaccion: 1, message: "Se ha acreditado un premio", data: response.data });
        } catch (error) {
            return res.status(500).json({ estadoTransaccion: 0, message: `Error en envio API externa: ${error.message}`, data: null });
        }
    }

    try {
        const username = process.env.CARGAAKISI_USER;
        const password = process.env.CARGAAKISI_PASSWORD;
        const urlConsumo = 'api/v1/transaction/load_money_offercraft';
        const textoAleatorio = new Date().toISOString().replace(/[-:.TZ]/g, '') + 'xx';

        const response = await axios.post(
            urlConsumo, {
                mobile: telno,
                typeTranx: valorpremiosPermitidos.descripcion,
                amount: valorpremiosPermitidos.valor,
                urlGame: textoAleatorio,
                empresa: 'AKISI'
            }, {
                headers: {
                    'x-api-key': '7T1S9KEIKYQBCO30SHJSW'
                },
                auth: {
                    username,
                    password
                }
            }
        );

        const resp = response.data;

        if (resp.transaction_id) {
            return res.status(200).json({ estadoTransaccion: 1, message: 'Se ha acreditado un premio', data: resp });
        }

        const errmsg = resp.error ? `Error: API externa ${resp.error}` : 'Error: API externa sin respuesta';
        return res.status(500).json({ estadoTransaccion: 0, message: errmsg, data: resp });
    } catch (error) {
        return res.status(500).json({ estadoTransaccion: 0, message: `Error realizando envio API externa: ${error.message}`, data: null });
    }
};

module.exports = { AddCampaniaInterna, Addnumbers, actualizarNumero, GetTelnoCampaniasById, GetCampaniaInternaActivas, GetTelnoCustomerbilletera, GetCampaniaInternaById, PausarCampaniaInterna, ActivarCampaniaInterna, DeleteCampaniaInterna, GetTelnoCampanias, GetPremiosLink };