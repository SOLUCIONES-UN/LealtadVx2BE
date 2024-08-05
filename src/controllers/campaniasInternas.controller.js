const { CampaniaInterna } = require('../models/campaniasinterno');
const { sequelize } = require('../database/database');
const { Op } = require('sequelize');
const { CampaniaInternoNumber } = require('../models/campaniaInternaNumber');
const { Premio } = require('../models/premio');


const AddCampaniaInterna = async (req, res) => {
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
        return res.status(201).json({ code: 'ok', message: 'Campania Interna creado con exito.'});

    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la campania interna:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar crear la campania interna', details: error.message });
    }
};


const GetCampaniaInternaActivas = async (req, res) => {
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


const GetCampaniaInternaById = async (req, res) => {

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

const GetTelnoCampanias = async (req, res) => {
    try {
        const { id } = req.params;
        const telefonos = await CampaniaInternoNumber.findByPk({
            where: { idCampaniaInterna: id}
        });
        res.json(telefonos);
    } catch (error) {
        console.log("ha error", telefonos);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener los telefonos de la Campaña Interna' });
    }
}

const GetPremiosLink = async (req, res) => {
    try {
        const premios = await Premio.findAll({
            where: {
                estado: 1,
                link: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            }
        });

        res.status(200).json(premios);
    } catch (error) {
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener el premio por link.' });
    }
};

const PausarCampaniaInterna = async (req, res) => {
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

const ActivarCampaniaInterna = async (req, res) => {
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

const DeleteCampaniaInterna = async (req, res) => {
    try {

        const { id } = req.params;

        await CampaniaInterna.update({
            estado: 0,
        }, {
            where: {
                id: id,
            },
        });

        res.status(200).json({ code: 'ok', message: 'Campaña deshabilitada con exito'});

    } catch (error) {
        res.status(404)
        res.send({ errors: 'Ha sucedido un error al intentar deshabilitar la Campaña Interna' });
    }
}

const Addnumbers = async ( req, res ) => {

    let transaction;
    try {
        const { idCampaniaInterna, telefonos } = req.body;

        if (!Array.isArray(telefonos)) {
            return res.status(400).json({ code: 'error', message: 'El campo "telefonos" debe ser un array.'});
        }

        transaction = await sequelize.transaction();

        for (const telefono of telefonos) {
            const numExistente = await CampaniaInternoNumber.findOne({
                where: {
                    telefono: telefono,
                    idCampaniaInterna: idCampaniaInterna,
                }
            });

            if (numExistente) {
                await transaction.rollback();
                return res.status(400).json({
                    code: 'error',
                    message: `El número ${telefono} ya existe en la campaña interna ${idCampaniaInterna}.`,
                })
            }

        }


        await transaction.commit();
        return res.status(201).json({ code: 'ok', message: 'Numeros agregados con exito.' });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error al agregar numeros:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar agregar los numeros', details: error.message });
    }
}

const actualizarNumero = async (req, res ) => {
    try {
        const { id} = req.params;
        
        await CampaniaInternoNumber.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        })

        res.json({ code: 'ok', message: 'numero elminado con exito'});

    }catch (error){
        console.error('Error al actualizar numero:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar actualizar el número', details: error.message });
    }
}

module.exports = { AddCampaniaInterna, Addnumbers, actualizarNumero, GetCampaniaInternaActivas, GetCampaniaInternaById, PausarCampaniaInterna, ActivarCampaniaInterna, DeleteCampaniaInterna, GetTelnoCampanias, GetPremiosLink };