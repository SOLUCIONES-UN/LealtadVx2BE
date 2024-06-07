const { EnviaPremio } = require('../models/enviaPremio.js');
const { Campania } = require('../models/campanias');







const GetEnviaPremio = async(req, res) => {
    try {
        console.log("Si llega el método obtener premios");
        const trx = await EnviaPremio.findAll({
            where: {
                estado: 1
            },
            include: [{
                model: Campania,
                as: 'campaign', // Así es como especificamos el alias de la asociación en el modelo EnviaPremio
                attributes: ['nombre'] // Solo seleccionamos el nombre de la campaña para mostrar
            }]
        });

        console.log(trx);
        res.json(trx);
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener la lista de premios.' });
    }
}

const AddEnvio = async(req, res) => {
    try {
        const data = req.body; // El cuerpo de la solicitud contendrá un array de objetos
        console.log('Estos son los datos recibidos:', data);

        // Iterar sobre cada objeto en el array y crear una entrada en la base de datos
        for (const item of data) {
            const { telefono, campania } = item;
            await EnviaPremio.create({
                telefono,
                campania
            });
        }

        res.json({ code: 'ok', message: 'Datos enviados con éxito' });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).json({ error: 'Ha ocurrido un error al procesar los datos' });
    }
};








const UpdateEnvio = async(req, res) => {
    try {
        const { telefono } = req.body;
        const { id } = req.params;

        await EnviaPremio.update({
            telefono,
        }, {
            where: {
                id,
            },
        });
        res.json({ code: 'ok', message: 'Envío actualizado con éxito.' });
    } catch (error) {
        res.status(403).send({ errors: 'Ha ocurrido un error al actualizar el envío.' });
    }
};

const DeleteEnvio = async(req, res) => {
    try {
        const { id } = req.params;

        await EnviaPremio.update({
            estado: 0,
        }, {
            where: {
                id,
            },
        });
        res.json({ code: 'ok', message: 'Envío inhabilitado con éxito.' });
    } catch (error) {
        res.status(403).send({ errors: 'Ha ocurrido un error al inhabilitar el envío.' });
    }
};

const GetEnvioById = async(req, res) => {
    try {
        const { id } = req.params;

        const envio = await EnviaPremio.findByPk(id, {
            where: {
                estado: 1,
            },
        });

        res.json(envio);
    } catch (error) {
        res.status(403).send({ errors: 'Ha ocurrido un error al obtener el envío.' });
    }
};

module.exports = {
    GetEnviaPremio,
    AddEnvio,
    UpdateEnvio,
    DeleteEnvio,
    GetEnvioById,
}