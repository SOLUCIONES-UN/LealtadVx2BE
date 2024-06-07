const { Columna } = require('../models/columna')
const { Transaccion } = require('../models/transaccion')
const { Participacion } = require('../models/Participacion');
const { Op } = require('sequelize');



//controllador paa obtener la lista de transacciones
const GetTransaccions = async(req, res) => {
    try {
        const trx = await Transaccion.findAll({
            where: {
                estado: 1
            }
        })
        res.json({ Transaccion: trx })
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la Transaccion.' });
    }

}


//controllador para agregar nuevas transacciones
const AddTransaccion = async(req, res) => {

    try {
        const { descripcion, columna, puntos } = req.body;
        await Transaccion.create({
            descripcion,
            idColumna: columna,
            puntos
        })
        res.json({ code: 'ok', message: 'Transaccion creada con exito' });

    } catch (error) {
        console.log(
            "error", error
        )
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la Transaccion.' });
    }

}


//controllador para actualizar transacciones
const UpdateTransaccion = async(req, res) => {

    try {
        const { nombre, descripcion, botton, columna, puntos } = req.body;
        const { id } = req.params
        await Transaccion.update({
            nombre,
            descripcion,
            idBotton: botton,
            idColumna: columna,
            puntos
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Transaccion actualizada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la Transaccion.' });
    }

}


//controllador para actualizar transacciones
const DeleteTransaccion = async(req, res) => {

    try {
        const { id } = req.params
        await Transaccion.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Transaccion inhabilitada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la Transaccion.' });
    }

}


const GetTransaccionById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Transaccion.findByPk(
            id, { include: Columna }
        );
        res.json(project)
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la Transaccion.' });
    }

}






const GetTransaccionscount = async(req, res) => {
    try {
        // Obtener la fecha actual y la fecha hace 7 días
        const currentDate = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        // Contar las participaciones que tienen transacciones en los últimos 7 días
        const trxCount = await Participacion.count({
            include: [{
                model: Transaccion,
                required: true // Esto asegura que solo se cuentan las participaciones que tienen transacciones
            }],
            where: {
                fecha: {
                    [Op.between]: [sevenDaysAgo, currentDate]
                }
            }
        });

        res.json({ cantidad: trxCount });
    } catch (error) {
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar realizar la Transaccion.' });
    }
};


module.exports = { GetTransaccions, AddTransaccion, UpdateTransaccion, DeleteTransaccion, GetTransaccionById, GetTransaccionscount }