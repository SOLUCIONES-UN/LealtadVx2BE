const { Op } = require("sequelize");
const { asignarCategoria } = require("../models/asignarCategoria");
const { Transaccion } = require("../models/transaccion");

const addCategoria = async (req, res) => {

    let { data } = req.body;
    console.log(data)

    try {

        data.forEach((element, index) => {
            data[index].fecha = new Date()
        });

        await asignarCategoria.bulkCreate(data);

        res.json({ code: 'ok', message: 'Transaccion asignada exitosamente.' });

    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la asignacion.' });
    }
}

const getNoAsignados = async (req, res) => {

    try {

        const { idCategoria } = req.body;

        const transaccionesAct = await asignarCategoria.findAll({

            include: {
                model: Transaccion,
            },
            where: {
                idCategoria: idCategoria
            }
        })

        console.log(transaccionesAct)

        let transaccionesAsignadas = [];

        transaccionesAct.forEach(element => {
            transaccionesAsignadas.push(element.idTransaccion)
        });

        const trx = await Transaccion.findAll({
            where: {
                estado: 1,
                id: {
                    [Op.notIn]: transaccionesAsignadas
                }
            }
        })

        res.json(trx);

    } catch (error) {

        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de transacciones.' });
    }
}

const getAsignados = async (req, res) => {

    try {

        const { idCategoria } = req.body;

        const transaccionesAct = await asignarCategoria.findAll({
            include: {
                model: Transaccion
            },
            where: {
                idCategoria: idCategoria
            }
        })

        res.json(transaccionesAct)
    } catch (error) {
        console.error(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de páginas.' });
    }
}

const deleteTransacciones = async (req, res) => {

    try {

        const { id } = req.body;

        await asignarCategoria.destroy({
            where: {
                id: {
                    [Op.in]: id
                }
            }
        })

        res.json({ code: 'ok', message: 'Asignacion elimninado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar eliminar la asignacion.' });
    }
}

module.exports = {
    addCategoria,
    getNoAsignados,
    getAsignados,
    deleteTransacciones
}