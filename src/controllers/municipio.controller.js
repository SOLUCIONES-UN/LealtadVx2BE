const { Municipio } = require('../models/municipio')
const { Departamento } = require('../models/departamento')


//controllador paa obtener la lista de municipios
const GetMunicipios = async(req, res) => {
    try {
        const trx = await Municipio.findAll({
            include: { model: Departamento },
            where: {
                estado: 1
            }
        })
        res.json(trx)
    } catch (error) {
        res.status(403)
        console.log(error)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar el municipio.' });
    }

}


//controllador para agregar nuevos municipios
const AddMunicipio = async(req, res) => {

    try {
        console.log(req.body);
        const { nombre, departamento, IdLocal } = req.body;
        await Municipio.create({
            nombre,
            IdLocal,
            idDepartamento: departamento,
        })
        res.json({ code: 'ok', message: 'Municipio creado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar el municipio.' });
    }

}


//controllador para actualizar los municipios
const UpdateMunicipio = async(req, res) => {

    try {
        const { nombre, IdLocal, departamento, } = req.body;
        const { id } = req.params
        await Municipio.update({
            nombre,
            IdLocal,
            idDepartamento: departamento,

        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Municipio actualizado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el municipio.' });
    }

}


//controllador para eliminar municipios
const DeleteMunicipio = async(req, res) => {

    try {
        const { id } = req.params
        await Municipio.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Municipio inhabilitado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el municipio.' });
    }

}


const GetMunicipioById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Municipio.findByPk(id);
        res.json(project)
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el municipio.' });
    }

}

const getMunicipalitiesByDepartment = async(req, res) => {
    try {
        const { id } = req.params;
        const trx = await Municipio.findAll({
            include: { model: Departamento },
            where: {
                idDepartamento: id,
                estado: 1

            }
        })
        res.json(trx)
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un error al obtener los municipios.' });
    }

}

module.exports = { GetMunicipios, AddMunicipio, UpdateMunicipio, DeleteMunicipio, GetMunicipioById, getMunicipalitiesByDepartment }