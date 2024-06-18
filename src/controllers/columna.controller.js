const { Columna } = require("../models/columna");
const { TablaDB } = require("../models/tabladb.js");
const { Proyectos } = require("../models/proyectos.model.js");

//controllador paa obtener la lista de Columnaes
const GetColumnas = async(req, res) => {
    try {
        const trx = await Columna.findAll({
            include: { model: TablaDB },
            where: {
                estado: 1,
            },
        });
        res.json(trx);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la Columna.",
        });
    }
};

//controllador para agregar nuevas Columnaes
const AddColumna = async(req, res) => {
    try {
        const { nombre, fila_insertada, fila_actualizada, idProyectos, idTablas } =
        req.body;
        await Columna.create({
            nombre,
            fila_insertada,
            fila_actualizada,
            idProyectos,
            idTablas,
        });
        res.json({ code: "ok", message: "Columna creada con exito" });
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la Columna.",
        });
    }
};

//controllador para actualizar Columnaes
const UpdateColumna = async(req, res) => {
    try {
        const { nombre, fila_insertada, fila_actualizada, idProyectos, idTablas } =
        req.body;
        const { id } = req.params;
        await Columna.update({
            nombre,
            fila_insertada,
            fila_actualizada,
            idProyectos,
            idTablas,
        }, {
            where: {
                id: id,
            },
        });

        res.json({ code: "ok", message: "Columna actualizada con exito" });
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la Columna.",
        });
    }
};

//controllador para eliminar Columnaes
const DeleteColumna = async(req, res) => {
    try {
        const { id } = req.params;
        await Columna.update({
            estado: 0,
        }, {
            where: {
                id: id,
            },
        });

        res.json({ code: "ok", message: "Columna inhabilitada con exito" });
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la Columna.",
        });
    }
};

const GetColumnaById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Columna.findByPk(id, {
            where: {
                estado: 1,
            },
        });
        res.json(project);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la Columna.",
        });
    }
};

const GetTablaByProyectos = async(req, res) => {
    try {
        const { idProyectos } = req.params;
        const trx = await TablaDB.findAll({
            include: { model: Proyectos },
            where: {
                idProyectos: idProyectos,
                estado: 1,
            },
        });
        res.json(trx);
    } catch (error) {
        res.status(403);
        console.log(error);
        res.send({ errors: "Ha sucedido un error al acceder a Tablas." });
    }
};

const GetColumnasByTablas = async(req, res) => {
    try {
        const { idTablas } = req.params;
        const columnas = await Columna.findAll({
            where: {
                estado: 1,
                idTablas,
            },
        });
        res.json(columnas)
    } catch (error) {
        res.status(500);
        console.log(error);
        res.send({ errors: "Ha sucedido un error al buscar la columna." });
    }
};

module.exports = {
    GetColumnas,
    AddColumna,
    UpdateColumna,
    DeleteColumna,
    GetColumnaById,
    GetTablaByProyectos,
    GetColumnasByTablas
};