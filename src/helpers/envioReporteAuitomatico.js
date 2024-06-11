const cron = require('node-cron');
const {sendEmail} = require('./sendEmail.js');
const {Campania} = require('../models/campanias');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');

const {generarReportereReferidos, generarReporteClientesParticipando,generarReporteOferCraft,generarReportePromociones} = require('./generarReportes.js');
// const { generarReporteOferCraft } = require('../controllers/reporteOfercraft.controller.js')







// '*/15 * * * * *'

// '0 * * * *'

const taskSendEmail = cron.schedule('00 00 * * * *', async () => {
    console.log('Ejecutando una tarea cada minuto');

    try {
        const configs = await Configuraciones.findAll({
            include: [
                { model: Campania, attributes: ['id', 'nombre', 'descripcion', 'fechaInicio'] },
                { model: ConfigReport, attributes: ['id', 'frecuencia', 'diaSemana', 'diaMes', 'tiporeporte', 'emails'] }
            ],
            where: { estado: 1 }
        });

        configs.forEach(async (config) => {
            const campania = config.campanium;

            if (campania) {
                console.log('ID de la configuración:', config.id);
                                console.log('ID de la campaña:', campania.id);
                                console.log('Nombre de la campaña:', campania.nombre);
                                console.log('Descripción de la campaña:', campania.descripcion);
                                console.log('fechaInicio de la campaña:', campania.fechaInicio);
                                console.log('ID del reporte de configuración:', config.configreporte.id);
                                console.log('Frecuencia del reporte de configuración:', config.configreporte.frecuencia);
                                console.log('Día de la semana del reporte de configuración:', config.configreporte.diaSemana);
                                console.log('Día del mes del reporte de configuración:', config.configreporte.diaMes);
                                console.log('Tipo de reporte del reporte de configuración:', config.configreporte.tiporeporte);
                                console.log('Email de reporte del reporte de configuración:', config.configreporte.emails);
                                console.log('---------------------------');
                
              
                const fechaInicio = new Date(campania.fechaInicio);
                let fechaFin = new Date();
               

                if (config.configreporte.frecuencia === 'dia') {
                    fechaFin = new Date();
                }
                else if (config.configreporte.frecuencia === 'semana') {
                    
                    fechaFin.setDate(fechaFin.getDate() + 6);
                }
                else if (config.configreporte.frecuencia === 'mes') {
                   
                    fechaFin.setMonth(fechaFin.getMonth() + 1);
                    fechaFin.setDate(0);
                }

                fecha1 = fechaInicio,
                fecha2 = fechaFin,

                console.log('Fecha de inicio:', fecha1);
                console.log('Fecha de fin:', fecha2);

                let correos = config.configreporte.emails;
                const reportes = [];
                const idCampanas = campania.id;

                const campanas = campania.nombre;

                

                if (config.configreporte.frecuencia === 'dia') {
                    console.log("La frecuencia de la campaña es 'dia'. Enviando correo electrónico...");

                    if (config.configreporte.tiporeporte === 'OfferCraft') {
                        console.log("Generando reporte de OfferCraft...");
                        reportes.push({
                            filename: 'ReporteOferCraft.xlsx',
                            content: await generarReporteOferCraft(idCampanas,fecha1,fecha2)
                        });

                    } else if (config.configreporte.tiporeporte === 'Referidos') {
                        console.log("Generando reporte de Referidos...");
                        reportes.push({
                            filename: 'ReporteReferidos.xlsx',
                            content: await generarReportereReferidos(campanas,fecha1, fecha2)
                        });
                    } else if (config.configreporte.tiporeporte === 'Pomociones') {
                        console.log("Generando reporte de Pomociones...");
                        reportes.push({
                            filename: 'ReportePromociones.xlsx',
                            content: await generarReportePromociones()
                        });
                    }

                    if (reportes.length > 0) {
                        console.log("Enviando correo electrónico...");
                        sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
                    }
                }

                if (config.configreporte.frecuencia === 'semana' && isToday(config.configreporte.diaSemana)) {
                    console.log("La frecuencia de la campaña es 'semana' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

                    if (config.configreporte.tiporeporte === 'OfferCraft') {
                        console.log("Generando reporte de OfferCraft...");
                        reportes.push({
                            filename: 'ReporteOferCraft.xlsx',
                            content: await generarReporteOferCraft(idCampania)
                        });
                    } else if (config.configreporte.tiporeporte === 'Referidos') {
                        console.log("Generando reporte de Referidos...");
                        reportes.push({
                            filename: 'ReporteReferidos.xlsx',
                            content: await generarReportereReferidos()
                        });
                    } else if (config.configreporte.tiporeporte === 'Pomociones') {
                        console.log("Generando reporte de Pomociones...");
                        reportes.push({
                            filename: 'ReportePromociones.xlsx',
                            content: await generarReportePromociones()
                        });
                    }

                    if (reportes.length > 0) {
                        console.log("Enviando correo electrónico...");
                        sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
                    }
                }

                if (config.configreporte.frecuencia === 'mes' && isTodayOfMonth(config.configreporte.diaMes)) {
                    console.log("La frecuencia de la campaña es 'mes' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

                    if (config.configreporte.tiporeporte === 'OfferCraft') {
                        console.log("Generando reporte de OfferCraft...");
                        reportes.push({
                            filename: 'ReporteOferCraft.xlsx',
                            content: await generarReporteOferCraft(idCampania)
                        });
                    } else if (config.configreporte.tiporeporte === 'Referidos') {
                        console.log("Generando reporte de Referidos...");
                        reportes.push({
                            filename: 'ReporteReferidos.xlsx',
                            content: await generarReportereReferidos()
                        });
                    } else if (config.configreporte.tiporeporte === 'Pomociones') {
                        console.log("Generando reporte de Pomociones...");
                        reportes.push({
                            filename: 'ReportePromociones.xlsx',
                            content: await generarReportePromociones()
                        });
                    }

                    if (reportes.length > 0) {
                        console.log("Enviando correo electrónico...");
                        sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
                    }
                }
            } else {
                console.log("No hay campaña asociada a esta configuración");
            }
        });

    } catch (error) {
        console.error('Error al obtener las configuraciones:', error);
    }
});

function isTodayOfMonth(dayOfMonth) {
    const today = new Date().getDate();
    return dayOfMonth === today;
}

function isToday(dayOfWeek) {
    const today = new Date().getDay();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dayOfWeek.toLowerCase() === days[today];
}

module.exports = { taskSendEmail };