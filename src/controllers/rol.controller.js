const { Rol } = require('../models/rol')


//controllador paa obtener la lista de roles
const GetRoles = async (req, res) => {
    try {
        const trx = await Rol.findAll({
            where: {
                estado: 1
            }
        })
        res.json(trx)
    } catch (error) {
        res.status(403)
        console.log(error)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar un nuevo rol.' });
    }

}


//controllador para agregar nuevos roles
const AddRol = async (req, res) => {

    try {
        console.log(req.body);
        const { descripcion } = req.body;
        await Rol.create({
            descripcion,
        })
        res.json({ code: 'ok', message: 'Rol creado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar un nuevo rol.' });
    }

}


//controllador para actualizar los roles
const UpdateRol = async (req, res) => {

    try {
        const { descripcion, } = req.body;
        const {id} = req.params
        await Rol.update({
            descripcion,
            
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Rol actualizado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar actualizar el rol.' });
    }

}


//controllador para eliminar roles
const DeleteRol = async (req, res) => {

    try {
        const {id} = req.params
        await Rol.update({
            estado : 0
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Rol inhabilitado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el Rol.' });
    }

}


const GetRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Rol.findByPk(id);
        res.json(project)
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el Rol.' });
    }

}



module.exports = { GetRoles, AddRol, UpdateRol, DeleteRol, GetRolById }