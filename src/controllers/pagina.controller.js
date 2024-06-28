const { Menu } = require('../models/menu');
const { Pagina } = require('../models/pagina');

//controllador paa obtener la lista de páginas
const GetPaginas = async(req, res) => {
    try {
        const trx = await Pagina.findAll({
            include: { model: Menu },
            where: {
                estado: 1
            }
        })
        res.json(trx)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de páginas.' });
    }
}



const AddPagina = async(req, res) => {
    try {
        const { descripcion, idMenu, path, icono } = req.body;

        const paginaExistente = await Pagina.findOne({ where: { descripcion } });
        if (paginaExistente) {
            return res.status(400).json({ code: 'error', message: 'La página ya existe con esta descripcion' });
        }

        await Pagina.create({
            descripcion,
            idMenu,
            path,
            icono
        });

        res.json({ code: 'ok', message: 'Página creada con éxito.' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar crear la página.' });
    }
}


//controllador para actualizar Paginás
const UpdatePagina = async(req, res) => {
    try {
        const { descripcion, idMenu, path, icono } = req.body;
        const { id } = req.params
        await Pagina.update({
            descripcion,
            idMenu,
            path,
            icono
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Página actualizada con éxito.' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al intentar actualizar la página.' });
    }
}

//controllador para eliminar una pagina
const DeletePagina = async(req, res) => {
    try {
        const { id } = req.params
        await Pagina.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Página inhabilitada con éxito.' });
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar deshabilitar el Menu.' });
    }
}

const GetPaginaById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Pagina.findByPk(id, {
            include: { model: Menu }
        });
        res.json(project)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al intentar realizar la página.' });
    }
}

module.exports = { GetPaginas, AddPagina, UpdatePagina, DeletePagina, GetPaginaById }