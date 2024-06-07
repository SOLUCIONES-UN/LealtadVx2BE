const { Premio } = require('../models/premio')


//controllador paa obtener la lista de transacciones
const GetPremios = async(req, res) => {
    try {
        const trx = await Premio.findAll({
            where: {
                estado: 1
            }
        })
        res.json({ premio: trx })
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar el premio.' });
    }

}


//controllador para agregar nuevos Premios
const AddPremio = async(req, res) => {

    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");
    console.log("si llega el metodo crear ");


    console.log(req.body);
    try {


        //const { descripcion, nombre,link, claveSecreta, tipoTransaccion, idTransaccion } = req.body;

        const { tipoTransaccion, usuario } = req.body;

        if (tipoTransaccion === "1") {
            const { tipoTransaccion, idTransaccion } = req.body;
            await Premio.create({
                tipo: tipoTransaccion,
                idTransaccion,
                usuario

            })

            res.json({ code: 'ok', message: 'Premio creado con exito' });

        } else if (tipoTransaccion === "2") {
            const { descripcion, link, claveSecreta } = req.body;

            await Premio.create({
                tipo: tipoTransaccion,
                descripcion,
                link,
                claveSecreta,
                usuario
            })

            res.json({ code: 'ok', message: 'Premio creado con exito' });
        }




    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar agregar el premio.' });

        console.log("ERROR GENERADO ES " + error)
        console.log("ERROR GENERADO ES " + error)
        console.log("ERROR GENERADO ES " + error)
        console.log("ERROR GENERADO ES " + error)
        console.log("ERROR GENERADO ES " + error)
        console.log("ERROR GENERADO ES " + error)
    }

}


//controllador para actualizar los premios
const UpdatePremio = async(req, res) => {

    try {
        const { tipoTransaccion, usuario } = req.body;
        const { id } = req.params

        if (tipoTransaccion === "1") {
            const { idTransaccion } = req.body;
            await Premio.update({
                tipo: tipoTransaccion,
                idTransaccion,
                usuario
            }, {
                where: {
                    id: id
                }
            })

            res.json({ code: 'ok', message: 'Premio actualizado con exito' });

        } else if (tipoTransaccion === "2") {

            const { descripcion, link, claveSecreta } = req.body;
            await Premio.update({
                descripcion,
                link,
                claveSecreta,
                usuario
            }, {
                where: {
                    id: id
                }
            })
            res.json({ code: 'ok', message: 'Premio actualizado con exito' });
        }

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar actualizar el premio.' });
    }

}


//controllador para actualizar transacciones
const DeletePremio = async(req, res) => {

    try {
        const { id } = req.params
        await Premio.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Premio inhabilitado con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el premio.' });
    }

}


const GetPremioById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Premio.findByPk(id);
        res.json(project)
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar el premio.' });
    }

}


module.exports = { GetPremios, AddPremio, UpdatePremio, DeletePremio, GetPremioById }