const { Op, Sequelize } = require('sequelize');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');
const { Campania } = require('../models/campanias');
const { Promocion } = require('../models/promocion');



const GetConfiguraciones = async(req, res) => {
    const { tiporeporte } = req.params;

    try {
        const configReport = await ConfigReport.findAll({
            where: {
                tiporeporte,
                estado: {
                    [Op.or]: [1, 2]
                }
            },
            include: [{
                model: Configuraciones,
                include: [
                    { model: Campania },
                    { model: Promocion }
                ]
            }]
        });

        res.json(configReport);
    } catch (error) {
        console.error('Error al obtener las configuraciones:', error);
        res.status(500).json({ error: 'Error al obtener las configuraciones.' });
    }
};

const AddConfiguration = async(req, res) => {
    try {
        const { emails, tiporeporte, frecuencia, campanias, promocions, diasemana, diames } = req.body;


        const nuevaConfiguracion = await ConfigReport.create({
            diaSemana: diasemana,
            diaMes: diames,
            frecuencia: frecuencia,
            tiporeporte: tiporeporte,
            emails: emails
        });

        const configReportId = nuevaConfiguracion.id;


        if (campanias.length === 0 && promocions.length > 0) {
            for (let promocion of promocions) {
                await Configuraciones.create({
                    idConfigReport: configReportId,
                    idCampania: null,
                    idPromocion: promocion
                });
            }
        } else if (campanias.length > 0 && promocions.length === 0) {
            for (let campania of campanias) {
                await Configuraciones.create({
                    idConfigReport: configReportId,
                    idCampania: campania,
                    idPromocion: null
                });
            }
        } else if (campanias.length === 0 && promocions.length === 0) {
            await Configuraciones.create({
                idConfigReport: configReportId,
                idCampania: null,
                idPromocion: null
            });
        } else {
            for (let campania of campanias) {
                for (let promocion of promocions) {
                    await Configuraciones.create({
                        idConfigReport: configReportId,
                        idCampania: campania,
                        idPromocion: promocion
                    });
                }
            }
        }

        res.json({ code: 'ok', message: 'Configuración creada con éxito.', nuevaConfiguracion });
    } catch (error) {
        console.error("Error al intentar ingresar la configuración:", error);
        res.status(403).json({ error: 'Ha ocurrido un error al intentar ingresar la configuración.' });
    }
}



const UpdateReport = async(req, res) => {
    try {
        const { diasemana, diames, campanias, promocions, frecuencia, tiporeporte, emails } = req.body;
        const { id } = req.params;

        await ConfigReport.update({
            diaSemana: diasemana,
            diaMes: diames,
            frecuencia: frecuencia,
            tiporeporte: tiporeporte,
            emails: emails
        }, {
            where: { id: id }
        });

        const configuracion = await Configuraciones.findOne({ where: { idConfigReport: id } });
        if (configuracion) {
            if (campanias.length > 0 && promocions.length > 0) {
                for (let campania of campanias) {
                    for (let promocion of promocions) {
                        await configuracion.update({ idCampania: campania, idPromocion: promocion });
                    }
                }
            } else if (campanias.length > 0) {
                for (let campania of campanias) {
                    await configuracion.update({ idCampania: campania, idPromocion: null });
                }
            } else if (promocions.length > 0) {
                for (let promocion of promocions) {
                    await configuracion.update({ idCampania: null, idPromocion: promocion });
                }
            } else {
                await configuracion.update({ idCampania: null, idPromocion: null });
            }
        }

        res.json({ code: 'ok', message: 'Reporte actualizado con éxito.' });
    } catch (error) {
        console.error("Error al intentar actualizar el reporte:", error);
        res.status(403).json({ errors: 'Ha ocurrido un error al intentar actualizar el reporte.' });
    }
}


const GetReportById = async(req, res) => {
    const { id } = req.params;

    try {
        const configuraciones = await Configuraciones.findAll({
            where: { idConfigReport: id },
            include: [ConfigReport, Campania, Promocion]
        });

        res.json(configuraciones);
    } catch (error) {
        console.error('Error al obtener las configuraciones:', error);
        res.status(500).json({ error: 'Error al obtener las configuraciones.' });
    }
};




const DeleteReport = async(req, res) => {
    try {
        const { id } = req.params;

        await ConfigReport.update({ estado: 0 }, {
            where: { id: id }
        });

        await Configuraciones.update({ estado: 0 }, {
            where: { idConfigReport: id }
        });

        res.json({ code: 'ok', message: 'Reporte Eliminado con éxito.' });
    } catch (error) {
        console.error("Error al intentar actualizar el reporte:", error);
        res.status(403).json({ errors: 'Ha ocurrido un error al intentar actualizar el reporte.' });
    }
}

const StateReport = async(req, res) => {
    try {
        const { id, estate } = req.params;

        let newEstado = 0;
        if (estate === '1' || estate === '2') {
            newEstado = estate;
        } else {
            return res.status(400).json({ errors: 'El valor de estate no es válido.' });
        }

        await ConfigReport.update({ estado: newEstado }, {
            where: { id: id }
        });

        await Configuraciones.update({ estado: newEstado }, {
            where: { idConfigReport: id }
        });

        res.json({ code: 'ok', message: 'Estado del reporte actualizado con éxito.' });
    } catch (error) {
        console.error("Error al intentar actualizar el estado del reporte:", error);
        res.status(500).json({ errors: 'Ha ocurrido un error al intentar actualizar el estado del reporte.' });
    }
}


module.exports = {
    AddConfiguration,
    GetConfiguraciones,
    UpdateReport,
    GetReportById,
    DeleteReport,
    StateReport
}