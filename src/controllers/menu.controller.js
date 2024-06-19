const { Menu } = require('../models/menu');
const { Pagina } = require('../models/pagina');
const { pronet } = require('../database/database');



const GetMenus = async(req, res) => {
    try {
        const menus = await Menu.findAll({
            include: { model: Pagina },
            where: {
                estado: 1
            }
        });

        console.log(menus); // Cambiado de 'result' a 'menus'

        res.json(menus);
    } catch (error) {
        console.log("Ocurrió un error: ", error);
        res.status(403).send({ errors: 'Ha ocurrido un error al intentar obtener la lista de menús.' });
    }
};









const AddMenu = async(req, res) => {
    try {
        const { descripcion, icono, pagina } = req.body;

        await Menu.create({
            descripcion,
            icono,
            idPagina: pagina,
        })
        res.json({ code: 'ok', message: 'Menu creado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el menu.' });
    }
}




// controllador para actualizar Menus
const UpdateMenu = async(req, res) => {
    try {
        const { descripcion, icono } = req.body;
        const { id } = req.params
        await Menu.update({
            descripcion,
            icono,

        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Menu actualizado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar actualizar el menu.' });
    }
}

//controllador para eliminar Menus
const DeleteMenu = async(req, res) => {
    try {
        const { id } = req.params
        await Menu.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Menu inhabilitado con exito' });
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar deshabilitar el Menu.' });
    }
}

//obtener el menu por su id 
const GetMenuById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Menu.findByPk(id, {
            include: { model: Pagina },
            where: {
                estado: 1
            }
        });

        res.json(project)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al intentar buscar el menu.' });
    }
}

module.exports = { GetMenus, AddMenu, UpdateMenu, DeleteMenu, GetMenuById }