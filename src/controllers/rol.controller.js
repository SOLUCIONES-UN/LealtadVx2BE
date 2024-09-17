const { Rol } = require('../models/rol')

const GetRoles = async(req, res) => {
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



const AddRol = async(req, res) => {
    try {
        const { descripcion } = req.body;

        const rolExistente = await Rol.findOne({ where: { descripcion } });
        if (rolExistente) {
            return res.status(400).json({ code: 'error', message: 'El rol ya existe con esta Descripcion.' });
        }

        await Rol.create({
            descripcion,
        });

        res.json({ code: 'ok', message: 'Rol creado con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar agregar un nuevo rol.' });
    }
}


const UpdateRol = async(req, res) => {

    try {
        const { descripcion, } = req.body;
        const { id } = req.params
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


const DeleteRol = async(req, res) => {

    try {
        const { id } = req.params
        await Rol.update({
            estado: 0
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


const GetRolById = async(req, res) => {
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