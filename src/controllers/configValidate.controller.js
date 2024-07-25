const { Participacion } = require('../models/Participacion');
const { FailTransaccion } = require('../models/failTransaccion');
const { Configurevalidation } = require('../models/configurevalidation');
const { CampaniaValidation } = require('../models/campaniaValidation');
const { Campania } = require('../models/campanias');


const AddCofig = async (req, res) => {
    try {
        const { idConfiguration, idCampania} = req.body;

         await CampaniaValidation.create({
            idConfiguration,
            idCampania,
           
        });

       


        res.json({ code: "ok", message: "Configuración creada con éxito"});
    } catch (error) {
        console.error(error);
        res.status(500).send({
            errors: "Ha sucedido un error al intentar crear la configuración.",
        });
    }
};



const updateCofigValidate = async (req, res) => {
    try {
        const { idConfiguration, idCampania} = req.body;

        
        const { id } = req.params;
         await CampaniaValidation.update({
            idConfiguration,
            idCampania,
           
        }, {
            where: {
                id: id,
            },
        });
        res.json({ code: "ok", message: "Configuración actualizada con éxito"});
    } catch (error) {
        console.error(error);
        res.status(500).send({
            errors: "Ha sucedido un error al intentar crear la configuración.",
        });
    }
};





const updateConfig = async(req, res) => {
    try {
        const { validacion, cantTransaccion_time, time_minutes } = req.body;

        const { id } = req.params;
        await Configurevalidation.update({
            validacion,
            cantTransaccion_time,
            time_minutes
        }, {
            where: {
                id: id,
            },
        });

        res.json({ code: "ok", message: "Configuración actualizada con éxito" });
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un error al intentar actualizar la configuración..",
        });
    }
};






const GetConfig = async(req, res) => {
    try {
        const config = await Configurevalidation.findAll({

            where: {
                estado: 1,
            },
        });
        res.json(config);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar realizar la configuracion.",
        });
    }
};







module.exports = { GetConfig,AddCofig,updateConfig,updateCofigValidate };