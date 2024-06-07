const { codigoReferidos } = require('../models/codigoReferidos');
const { participacionReferidos } = require('../models/participacionReferidos');

const datosPersonales = {
    fechaRegistro: new Date(2023, 02, 03),
}

const canjearCodigo = async (req, res) => {

    const {idcodigo, referido, idParticipacion} = req.body;
    const fechaActual = new Date();
    try {

        //Buscar que el codigo exista
        const customer = await codigoReferidos.findOne({
            where: {
                id: idcodigo,
                estado: 1
            },
            attributes:['customerId', 'codigo']
        })

        

        //Buscar que no he canjeado un codigo antes
        const canjeable = await participacionReferidos.findOne({
            where: {
                referido: referido,
                estado: 1
            },
            attributes:['referido']
        })

        //validamos que nuestro codigo exisa y que no hayamos canjeado algun codigo
        if(customer != null && canjeable == null){
            
            //buscamos que el codigo del referido 
            const codigos = await codigoReferidos.findOne({
                where: {
                    customerId: referido,
                    estado: 1
                },
                attributes:['codigo']
            })
            //validar que el codigo del referido no sea el que intenta canjear
            if(customer.codigo == codigos.codigo){
                res.status(400)
                res.send({ code: '01', errors: 'Debes ingresar un codigo valido.' });


            //Validar que el usuario tenga un maximo de 3 dias creados
            }else if((fechaActual.getDate() - datosPersonales.fechaRegistro.getDate() ) <= 3){
                console.log(datosPersonales.fechaRegistro.getDate() - fechaActual.getDate())
                res.status(406)
                res.send({ code: '02', errors: 'El usuario debe tener 3 dias de haberse registrado.' });
            } else {//canjeamos el codigo
                
                await participacionReferidos.create({
                    fecha: new Date(),
                    idCodigo : idcodigo,
                    referido,
                    idConfigutacion: idParticipacion,
                    refiriente: customer.customerId
    
                })

                res.json({ code: "ok", message: "Codigo canjeado con exito." });
            }

        } else {
            res.status(404)
            res.send({ errors: 'El codigo es incorrecto o no puedes canjear mas codigos.' });
        }

   
    } catch (error) {
        console.error(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de Categoria.' });
    }
}

module.exports = {
    canjearCodigo
}