const { Departamento } = require('../models/departamento');
const { Departamento_Proyectos } = require('../models/departamento_proyectos');
const { Proyectos } = require('../models/proyectos.model');
const { Municipio } = require('../models/municipio')


const GetDepartamentos = async(req, res) => {
    try {

        const depa = await Departamento.findAll({
            where: {
                estado: 1
            }
        });

        res.json({ departamentos: depa });

    } catch (e) {
        console.error(e);
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar realizar la consulta.' })
    }
}

const AddDepartamentos = async(req, res) => {
        try {
            const { nombre, IdLocal } = req.body;


            const departamento = await Departamento.create({
                nombre,
                IdLocal
            });


            res.json({ code: 'ok', message: 'Departamento creado con exito.' });

        } catch (e) {
            res.status(403);
            res.send({ errors: 'Ha ocurrido un error al intentar ingresar el departamento.' });
        }
    }
    //Acutaliza categoria
const UpdateDepartamento = async(req, res) => {
    try {

        const { nombre, IdLocal } = req.body;

        const { id } = req.params;

        await Departamento.update({
                nombre,
                IdLocal
            },

            {
                where: {
                    id: id
                }
            });





        res.json({ code: 'ok', message: 'Departamento Actualizado con exito.' });

    } catch (e) {
        res.status(403);
        res.send({ errors: 'Ha ocurrido un error al intentar actualizar el departamento.' });
    }
}

//eliminado logico de categoria
const DeleteDepartamento = async(req, res) => {
    try {

        const { id } = req.params;
        console.log(id);

        await Departamento.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Departamento inhabilitado con exito.' });

    } catch (e) {
        res.status(403);
        res.send({ errors: 'Ha ocurrido un error al intentar inhabilitar el departamento.' });
    }
}

//obtener departamentos por el id
const GetDepartamentobyId = async(req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const depa = await Departamento.findByPk(id);
        res.json(depa);

    } catch (e) {
        res.status(403);
        res.send({ errors: 'ha sucedido un error al intentar obtener el departamento.' })
    }
}
const GetDepartamentosByProyectoId = async(req, res) => {
    try {
        const { idProyecto } = req.params;

        if (!idProyecto) {
            return res.status(400).json({ error: 'Se requiere proporcionar un ID de proyecto.' });
        }

        const departamentos = await Departamento_Proyectos.findAll({
            where: { idProyecto },
            include: [{
                    model: Departamento,
                    where: { estado: 1 }
                },
                {
                    model: Municipio,
                    where: { estado: 1 }
                }
            ]
        });

        res.json(departamentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al intentar obtener los departamentos por el ID de proyecto.' });
    }
};


module.exports = { GetDepartamentos, GetDepartamentosByProyectoId, AddDepartamentos, UpdateDepartamento, DeleteDepartamento, GetDepartamentobyId }