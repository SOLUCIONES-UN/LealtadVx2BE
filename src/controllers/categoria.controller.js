const { Categoria } = require('../models/categoria');


const GetCategorias = async(req, res) => {
    try {
        const categorias = await Categoria.findAll({
            where: {
                estado: 1
            }
        });
        console.log('Categorias obtenidas:', categorias);
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al consultar las Categorias.' });
    }
};



const AddCategoria = async(req, res) => {
    try {
        const { nombre } = req.body;

        const categoriaExistente = await Categoria.findOne({ where: { nombre } });
        if (categoriaExistente) {
            return res.status(400).json({ code: 'error', message: 'La categoría ya existe con este nombre' });
        }

        await Categoria.create({
            nombre
        });

        res.json({ code: 'ok', message: 'Categoría creada con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar crear la categoría.' });
    }
}


// Controlador para actualizar Categorias
const UpdateCategoria = async(req, res) => {
    try {
        const { nombre } = req.body;
        const { id } = req.params;
        await Categoria.update({
            nombre
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Categoria actualizada con exito' });
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar realizar la Categoria.' });
    }
};

// Controlador para inhabilitar Categorias
const DeleteCategoria = async(req, res) => {
    try {
        const { id } = req.params;
        await Categoria.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Categoria inhabilitada con exito' });
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar realizar la Categoria.' });
    }
};

// Controlador para obtener Categoria por ID
const GetCategoriaById = async(req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        res.json(categoria);
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar realizar la Categoria.' });
    }
};

module.exports = { GetCategorias, AddCategoria, UpdateCategoria, DeleteCategoria, GetCategoriaById };