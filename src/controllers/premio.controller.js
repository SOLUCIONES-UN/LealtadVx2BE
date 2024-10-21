const { Premio } = require('../models/premio');
const { Transaccion } = require('../models/transaccion');


const GetPremios = async (req, res) => {
    try {
        const trx = await Premio.findAll({
            where: {
                estado: 1
            },
            include: [
                {
                    model: Transaccion,
                    as: 'transaccion',
                    attributes: ['descripcion'],
                    required: false,
                }
            ]
        });

        const premiosConDescripcion = trx.map(premio => {
            const premioData = premio.toJSON();
            if (!premioData.descripcion && premioData.transaccion) {
              
                premioData.descripcion = `Premio relacionado a ${premioData.transaccion.descripcion}`;
            }
            delete premioData.transaccion;
            return premioData;
        });

        res.json({ premio: premiosConDescripcion });
    } catch (error) {
        console.error(error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener los premios.' });
    }
};


const AddPremio = async (req, res) => {
    console.log("si llega el metodo crear ");
    console.log(req.body);
    try {
        const {
            descripcion,
            link,
            claveSecreta,
            tipoTransaccion,
            idTransaccion,
            usuario
        } = req.body;

        if (!descripcion && tipoTransaccion === "2") {
            return res.status(400).json({ code: 'error', message: 'La descripción del premio es requerida' });
        }

        if (!claveSecreta && tipoTransaccion === "2") {
            return res.status(400).json({ code: 'error', message: 'La clave secreta del premio es requerida' });
        }

        if (tipoTransaccion === "2") {
            const premioExistenteDescripcion = await Premio.findOne({ where: { descripcion } });
            if (premioExistenteDescripcion) {
                return res.status(400).json({ code: 'error', message: 'El premio ya existe con esta descripción' });
            }
            const premioExistenteClaveSecreta = await Premio.findOne({ where: { claveSecreta } });
            if (premioExistenteClaveSecreta) {
                return res.status(400).json({ code: 'error', message: 'El premio ya existe con esta clave secreta' });
            }
        }

        if (tipoTransaccion === "1") {
            await Premio.create({
                tipo: tipoTransaccion,
                idTransaccion: idTransaccion,
                usuario: usuario
            })
            res.json({ code: 'ok', message: 'Premio creado con éxito' });
        } else if (tipoTransaccion === "2") {
            await Premio.create({
                tipo: tipoTransaccion,
                descripcion: descripcion,
                link: link,
                claveSecreta: claveSecreta,
                usuario: usuario
            })
            res.json({ code: 'ok', message: 'Premio creado con éxito' });
        }

    } catch (error) {
        console.log(error)
        res.status(403).send({ errors: 'Ha sucedido un error al intentar agregar el premio.' });
        console.log("ERROR GENERADO ES " + error)
    }
}


const UpdatePremio = async (req, res) => {
    const { descripcion, link, claveSecreta, tipoTransaccion, usuario, idTransaccion } = req.body;


    try {

        const { id } = req.params

        if (tipoTransaccion === "1") {
            const { idTransaccion } = req.body;
            await Premio.update({
                tipo: tipoTransaccion,
                idTransaccion: idTransaccion,
                // tipo: null,
                descripcion: null,
                link: null,
                claveSecreta: null,
                usuario: usuario
            }, {
                where: {
                    id: id
                }
            })

            res.json({ code: 'ok', message: 'Premio actualizado con exito' });

        } else if (tipoTransaccion === "2") {


            await Premio.update({
                tipo: tipoTransaccion,
                idTransaccion: null,
                descripcion: descripcion,
                link: link,
                claveSecreta: claveSecreta,
                usuario: usuario
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


const DeletePremio = async (req, res) => {

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