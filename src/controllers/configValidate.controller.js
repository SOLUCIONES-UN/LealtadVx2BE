const { Participacion } = require('../models/Participacion');
const { FailTransaccion } = require('../models/failTransaccion');
const { Configurevalidation } = require('../models/configurevalidation');
const { CampaniaValidation } = require('../models/campaniaValidation');
const { Campania } = require('../models/campanias');



const AddCofig = async (req, res) => {
    try {
        const { validacion, cantTransaccion, time, campania } = req.body;

        const nuevaConfiguracion = await Configurevalidation.create({
            validacion: validacion,
            cantTransaccion_time: cantTransaccion,
            time_minutes: time,
        });

        const configId = nuevaConfiguracion.id;

        if (campania) {
            await CampaniaValidation.create({
                idConfiguration: configId,
                idCampania: campania,
            });
        }

        res.json({ code: "ok", message: "Configuración creada con éxito", nuevaConfiguracion });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            errors: "Ha sucedido un error al intentar crear la configuración.",
        });
    }
};




const updateConfig = async (req, res) => {
    try {
        const { id } = req.params; 
        const { validacion, cantTransaccion, time, campania } = req.body;

        const configuracionExistente = await Configurevalidation.findByPk(id);
        if (!configuracionExistente) {
            return res.status(404).send({
                errors: "Configuración no encontrada.",
            });
        }

        configuracionExistente.validacion = validacion;
        configuracionExistente.cantTransaccion_time = cantTransaccion;
        configuracionExistente.time_minutes = time;
        await configuracionExistente.save();
        console.log(`Configuración con ID ${id} actualizada`);

        const campaniaExistente = await CampaniaValidation.findOne({
            where: { idConfiguration: id }
        });

        if (campaniaExistente) {
            campaniaExistente.idCampania = campania;
            await campaniaExistente.save();
            console.log(`CampaniaValidation con idConfiguration ${id} actualizada`);
        } else {
            await CampaniaValidation.create({
                idConfiguration: id,
                idCampania: campania,
            });
            console.log(`CampaniaValidation creada con idConfiguration ${id}`);
        }

        res.json({ code: "ok", message: "Configuración actualizada con éxito", configuracionExistente });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            errors: "Ha sucedido un error al intentar actualizar la configuración.",
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







module.exports = { GetConfig,AddCofig,updateConfig };