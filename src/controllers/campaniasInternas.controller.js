const { CampaniaInterna } = require('../models/campaniasinterno');
const { sequelize } = require('../database/database');
const { CampaniaInternoNumber } = require('../models/campaniaInternaNumber');


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
            emails
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
        res.status(201).json(newCampaniaInterna);

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





module.exports = { AddCampaniaInterna, GetCampaniaInternaActivas, GetCampaniaInternaById, PausarCampaniaInterna, ActivarCampaniaInterna, DeleteCampaniaInterna, GetTelnoCampanias };