const {  ConfigReferido } = require('../models/configReferidos');

const GetConfigReferidos = async (req, res) => {
    try {
        const trx = await ConfigReferido.findAll();
        res.json(trx)
    } catch (error) {
        console.log("este es:".error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de referidos.' });
    }
}
    
        const AddConfigReferidos = async (req,res)=>{
            try{
                const { descripcion } = req.body;
                await ConfigReferido.create({
                    descripcion
                })
                res.json({ code: 'ok', message: 'ConfigReferido creada con exito' });

            }catch(error){
                res.status(403)
                es.send({ errors: 'Ha sucedido un  error al intentar realizar la ConfigReferido.' });
            }


}



const UpdateConfigReferidos = async (req, res) => {
    try {
        const { descripcion, duracion} = req.body;
        const { id } = req.params
        const estado = req.body.estado === 1 ? 1 : 0;
        

        await ConfigReferido.update({
            descripcion,
            estado,
            duracion
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Referido actualizado con exito' });
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar actualizar al referido.' });
    }
}

const DeleteConfigReferidos = async (req, res) => {
    try {
        const { id } = req.params
        const {estado} = req.body;
        console.log("actuaizando estado:"+estado)
        await ConfigReferido.update({
            estado: estado
        }, {
            where: {
                id: id
            }
        });
    res.json({ code: 'ok', message: `Referido ${estado == 1 ? "habilitado" : "deshabilitado"} con exito` });
    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar deshabilitar al Referido.' });
    }
   }  
const GetConfigReferidosById = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.params;
      
        const project = await ConfigReferido.findByPk(id, estado);
        res.json(project)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la ConfigReferido.' });
    }
    
}

module.exports = {GetConfigReferidos, UpdateConfigReferidos, DeleteConfigReferidos, AddConfigReferidos,GetConfigReferidosById}