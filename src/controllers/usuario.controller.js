const { Rol } = require('../models/rol')
const { Usuario } = require('../models/usuario')
const bcrypt = require("bcryptjs");
const env = require("../bin/env");

const GetUsuarios = async(req, res) => {

    try {

        let usr = await Usuario.findAll({
            include: { model: Rol },
            where: {
                estado: 1
            },
            attributes: ["username", "nombre", "telefono", "emailNotificacion", "idRol"],
        })

        res.json(usr)

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la transacción.' });

    }

}

const AddUsuario = async(req, res) => {
    try {
        let { username, nombre, password, telefono, emailNotificacion, idRol, tipoUsuario } = req.body;
        tipoUsuario = tipoUsuario || 1;
        password = await bcrypt.hash(password, env.bcrypt.sr);

        const usuarioExistente = await Usuario.findOne({ where: { username } });
        if (usuarioExistente) {
            return res.status(400).json({ code: 'error', message: 'El usuario ya existe con este nombre de usuario' });
        }

        await Usuario.create({
            username,
            nombre,
            password,
            telefono,
            emailNotificacion,
            idRol,
            tipoUsuario
        });

        res.json({ code: 'ok', message: 'Usuario creado con éxito' });

    } catch (error) {
        console.error("Error al agregar usuario:", error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar agregar un usuario.' });
    }
}



const UpdateUsuario = async(req, res) => {
    try {
        const { nombre, password, telefono, emailNotificacion, idRol } = req.body;
        const { username } = req.params;


        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, env.bcrypt.sr);
        }

        await Usuario.update({
            nombre,
            password: hashedPassword,
            telefono,
            emailNotificacion,
            idRol
        }, {
            where: {
                username: username
            }
        });

        res.json({ code: 'ok', message: 'Usuario actualizado con éxito' });

    } catch (error) {
        console.log("Error al actualizar usuario:", error);
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al intentar actualizar un usuario.' });
    }
}

//controllador para eliminar los usuarios
const DeleteUsuario = async(req, res) => {

    try {

        const { username } = req.params

        await Usuario.update({

            estado: 0

        }, {
            where: {
                username: username
            }
        });


        res.json({ code: 'ok', message: 'Usuario inhabilitado con exito' });

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar eliminar un usuario.' });

    }

}


const GetUsuarioById = async(req, res) => {

    try {

        const { username } = req.params;
        const project = await Usuario.findByPk(username);
        res.json(project)

    } catch (error) {

        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar ver el usuario.' });

    }

}

module.exports = { GetUsuarios, AddUsuario, UpdateUsuario, DeleteUsuario, GetUsuarioById }