const { Op } = require("sequelize");
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



const GetCampaniasConfig = async (req, res) => {
    try {
        const config = await CampaniaValidation.findAll({
            where: {
                estado: 1,
            },
            include: [{
                model: Campania,
                attributes: ['nombre'], 
            }],
        });

        res.json(config);
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un error al intentar realizar la configuración con campaña.",
        });
    }
};





const DeleteConfig = async(req, res) => {
    try {
        const { id } = req.params;
        await CampaniaValidation.update({
            estado: 0,
        }, {
            where: {
                idCampania: id,
            },
        });

        res.json({ code: "ok", message: "configuracion inhabilitada con exito" });
    } catch (error) {
        res.status(403);
        res.send({
            errors: "Ha sucedido un  error al intentar inhabilitar la configuracion.",
        });
    }
};




const GetCampaniasValidate = async (req, res) => {
    try {
        const campaniasEnValidation = await CampaniaValidation.findAll({
            attributes: ['idCampania'],
            where: {
                estado: 1,
            },
        });

        const campaniasEnValidationIds = campaniasEnValidation.map(campania => campania.idCampania);

        const campanias = await Campania.findAll({
            where: {
                estado: 1,
                id: {
                    [Op.notIn]: campaniasEnValidationIds,
                },
            },
        });

        res.json(campanias);
    } catch (error) {
        res.status(403).send({
            errors: "Ha sucedido un error al intentar realizar la configuración con campaña.",
        });
    }
};






module.exports = { GetConfig,AddCofig,updateConfig,updateCofigValidate,GetCampaniasConfig,DeleteConfig,GetCampaniasValidate };