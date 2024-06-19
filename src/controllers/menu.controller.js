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


const AddMenu = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const menuExistente = await Menu.findOne({ where: { descripcion } });
        if (menuExistente) {
            return res.status(400).json({ code: 'error', message: 'El menú ya existe con esta Descripcion' });
        }

        await Menu.create({
            descripcion,
        });

        res.json({ code: 'ok', message: 'Menú creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar crear el menú.' });
    }
};



// controllador para actualizar Menus
const UpdateMenu = async(req, res) => {
    try {
        const { descripcion } = req.body;
        const { id } = req.params
        await Menu.update({
            descripcion,

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