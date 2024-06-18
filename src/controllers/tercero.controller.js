const { Tercero } = require('../models/tercero');

//Obtener lista de clientes terceros
const GetTerceros = async(req, res) => {

    try {

        const ter = await Tercero.findAll({
            where: {
                estado: 1
            }
        });

        res.json(ter)

    } catch (e) {
        res.status(403)
        res.send({ errors: 'Ha ocurrido un error al intentar obtener los terceros' })
    }
}

//Agregar cliente tercero
const AddTercero = async(req, res) => {
    try {
        const { nombre, token } = req.body;

        const terceroExistente = await Tercero.findOne({ where: { nombre } });
        if (terceroExistente) {
            return res.status(400).json({ code: 'error', message: 'El tercero ya existe con este nombre' });
        }

        await Tercero.create({
            nombre,
            token
        });

        res.json({ code: 'ok', message: 'Tercero agregado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: 'Ha ocurrido un error al intentar agregar tercero.' });
    }
}


//Actualizar cliente tercero
const UpdateTercero = async(req, res) => {
        try {
            const { nombre, token } = req.body;
            const { id } = req.params;
            await Tercero.update({
                nombre,
                token
            }, {
                where: {
                    id: id
                }
            });

            res.json({ code: 'ok', message: 'Actualizacion exitosa' })
        } catch (e) {
            console.log(e);
            res.status(403);
            res.send({ errors: 'Ha ocurrido un error al intentar realziar la modificacion' });
        }
    }
    //Eliminado logico 
const DeleteTercero = async(req, res) => {
    try {

        const { id } = req.params
        await Tercero.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Tercero inhabilitado con exito' });

    } catch (e) {
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar realziar la eliminacion' })
    }
}

//Obtener por id los cliente tercero
const GetTerceroById = async(req, res) => {
    try {
        const { id } = req.params;
        const tercero = await Tercero.findByPk(id);
        res.json(tercero);

    } catch (e) {
        res.status(403);
        res.send({ errors: 'Ha ocurrido un error al intentar realizar la obtencion' })
    }
}

module.exports = { GetTerceros, AddTercero, UpdateTercero, DeleteTercero, GetTerceroById }