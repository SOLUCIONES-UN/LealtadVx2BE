const { Proyectos } = require('../models/proyectos.model.js');
const { Departamento_Proyectos } = require('../models/departamento_proyectos');
const { Departamento } = require('../models/departamento');
const { Municipio } = require('../models/municipio');

const GetProjects = async(req, res) => {
    try {
        const proyectos = await Proyectos.findAll({
            where: {
                estado: 1
            }
        });
        res.json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(403).send({ errors: 'Ha sucedido un error al obtener los proyectos.' });
    }
};


const AddProject = async(req, res) => {
    try {
        console.log('Data recibida en AddProject:', req.body);
        const { descripcion, ruta } = req.body;

        const proyectoExistente = await Proyectos.findOne({ where: { descripcion } });
        if (proyectoExistente) {
            return res.status(400).json({ code: 'error', message: 'El proyecto ya existe con esta descripcion' });
        }

        const proyecto = await Proyectos.create({
            descripcion,
            ruta
        });
        res.json({ code: 'ok', message: 'Proyecto creado con éxito.' });
        console.log('Proyecto creado con éxito:', proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send({ errors: 'Ha sucedido un error al intentar agregar un nuevo proyecto.' });
    }
};



const UpdateProject = async(req, res) => {
    try {
        const { descripcion, ruta } = req.body;
        const { id } = req.params;

        await Proyectos.update({ descripcion, ruta }, { where: { id } });

        res.json({ code: 'ok', message: 'Proyecto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar actualizar el proyecto.' });
    }
};









const DeleteProject = async(req, res) => {
    try {
        const { id } = req.params;
        console.log("ID del proyecto a eliminar:", id);
        await Proyectos.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Proyecto inhabilitado con éxito.' });
    } catch (error) {
        console.log(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar realizar el proyecto.' });
    }
};

const GetProjectByID = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Proyectos.findByPk(id, {
          
        });
        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar realizar el proyecto.' });
    }
};



const Getproyectoscount = async(req, res) => {
    try {
        const proyectoscoun = await Proyectos.count({
            where: {
                estado: 1
            }
        });
        res.json({ cantidad: proyectoscoun });
    } catch (error) {
        console.error("Este es el error:", error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener la lista de referidos.' });
    }
};



module.exports = { GetProjects, AddProject, UpdateProject, DeleteProject, GetProjectByID, Getproyectoscount };