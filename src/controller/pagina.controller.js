const { Menu } = require('../models/menu');
const { Pagina } = require('../models/pagina');

//controllador paa obtener la lista de páginas
const GetPaginas = async (req, res) => {
    const {idMenu}=req.params
    try {
        const trx = await Pagina.findAll({
            include: { model: Menu },
            where: {
                estado: 1,
                idMenu
            }
        })
        res.json(trx)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de páginas.' });
    }
}

//controllador para agregar nuevas paginas
const AddPagina = async (req, res) => {
    try {
        const { descripcion, idMenu, path } = req.body;
        await Pagina.create({
            descripcion,
            idMenu,
            path
        })
        res.json({ code: 'ok', message: 'Página creada con éxito.' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar crear la página.' });
    }
}

//controllador para actualizar Paginás
const UpdatePagina = async (req, res) => {
    try {
        const { descripcion, idMenu, path } = req.body;
        const { id } = req.params
        await Pagina.update({
            descripcion,
            idMenu,
            path
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
const DeletePagina = async (req, res) => {
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

const GetPaginaById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Pagina.findByPk(id);
        res.json(project)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al intentar realizar la página.' });
    }
}

module.exports = { GetPaginas, AddPagina, UpdatePagina, DeletePagina, GetPaginaById}