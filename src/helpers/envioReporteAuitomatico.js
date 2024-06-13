const cron = require('node-cron');
const { sendEmail } = require('./sendEmail.js');
const { Campania } = require('../models/campanias');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');
const { Promocion } = require('../models/promocion.js');

const { generarReportereReferidos, generarReporteClientesParticipando,generarReportereGeneralReferidos, generarReporteOferCraft, generarReportePromociones,reporteClientesContraCampanasAcumulativas } = require('./generarReportes.js');
// const { generarReporteOferCraft } = require('../controllers/reporteOfercraft.controller.js')







// '*/15 * * * * *'

// '0 * * * *'

// const taskSendEmail = cron.schedule('*/15 * * * * *', async () => {
//     console.log('Ejecutando una tarea cada minuto');

//     try {
//         const configs = await Configuraciones.findAll({
//             include: [
//                 { model: Campania, attributes: ['id', 'nombre', 'descripcion', 'fechaInicio'] },
//                 { model: Promocion, attributes: ['id', 'nombre', 'descripcion', 'fechaInicio'] },
//                 { model: ConfigReport, attributes: ['id', 'frecuencia', 'diaSemana', 'diaMes', 'tiporeporte', 'emails'] }
//             ],
//             where: { estado: 1 }
//         });

//         configs.forEach(async (config) => {
//             const campania = config.campanium;
//             const configreporte = config.configreporte;
//             const  promocion  = config.promocion;

//             if (campania) {
//                 console.log('ID de la configuración:', config.id);
//                 console.log('ID del reporte de promocion:', promocion .id);
//                 console.log('ID de la campaña:', campania.id);
//                 console.log('Nombre de la campaña:', campania.nombre);
//                 console.log('Descripción de la campaña:', campania.descripcion);
//                 console.log('fechaInicio de la campaña:', campania.fechaInicio);

//                 const fechaInicio = new Date(campania.fechaInicio);
//                 let fechaFin = new Date();

//                 if (configreporte.frecuencia === 'dia') {
//                     fechaFin = new Date();
//                 } else if (configreporte.frecuencia === 'semana') {
//                     fechaFin.setDate(fechaFin.getDate() + 6);
//                 } else if (configreporte.frecuencia === 'mes') {
//                     fechaFin.setMonth(fechaFin.getMonth() + 1);
//                     fechaFin.setDate(0);
//                 }

//                 const fecha1 = fechaInicio;
//                 const fecha2 = fechaFin;
//                 const correos = configreporte.emails;
//                 const reportes = [];
//                 const idCampanas = campania.id;
//                 // const campanas = campania.nombre;

//                 if (configreporte.frecuencia === 'dia') {
//                     console.log("La frecuencia de la campaña es 'dia'. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'OfferCraft') {
//                         console.log("Generando reporte de OfferCraft...");
//                         reportes.push({
//                             filename: 'ReporteOferCraft.xlsx',
//                             content: await generarReporteOferCraft(idCampanas, fecha1, fecha2)
//                         });
//                     } else if (configreporte.tiporeporte === 'Referidos') {
//                         console.log("Generando reporte de Referidos...");
//                         reportes.push({
//                             filename: 'ReporteReferidos.xlsx',
//                             content: await generarReportereReferidos(campanas, fecha1, fecha2)
//                         });
//                     }

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }

//                 if (configreporte.frecuencia === 'semana' && isToday(configreporte.diaSemana)) {
//                     console.log("La frecuencia de la campaña es 'semana' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'OfferCraft') {
//                         console.log("Generando reporte de OfferCraft...");
//                         reportes.push({
//                             filename: 'ReporteOferCraft.xlsx',
//                             content: await generarReporteOferCraft(idCampanas, fecha1, fecha2)
//                         });
//                     } else if (configreporte.tiporeporte === 'Referidos') {
//                         console.log("Generando reporte de Referidos...");
//                         reportes.push({
//                             filename: 'ReporteReferidos.xlsx',
//                             content: await generarReportereReferidos(campanas, fecha1, fecha2)
//                         });
//                     } 

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }

//                 if (configreporte.frecuencia === 'mes' && isTodayOfMonth(configreporte.diaMes)) {
//                     console.log("La frecuencia de la campaña es 'mes' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'OfferCraft') {
//                         console.log("Generando reporte de OfferCraft...");
//                         reportes.push({
//                             filename: 'ReporteOferCraft.xlsx',
//                             content: await generarReporteOferCraft(idCampanas, fecha1, fecha2)
//                         });
//                     } else if (configreporte.tiporeporte === 'Referidos') {
//                         console.log("Generando reporte de Referidos...");
//                         reportes.push({
//                             filename: 'ReporteReferidos.xlsx',
//                             content: await generarReportereReferidos(campanas, fecha1, fecha2)
//                         });
//                     } 

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }
//             } else {
//                 console.log("No hay campaña asociada a esta configuración");
//             }

//             // Mueve el bloque que usa configreporte dentro del contexto correcto
//             if (configreporte) {
//                 console.log('ID del reporte de configuración:', configreporte.id);
//                 console.log('Frecuencia del reporte de configuración:', configreporte.frecuencia);
//                 console.log('Día de la semana del reporte de configuración:', configreporte.diaSemana);
//                 console.log('Día del mes del reporte de configuración:', configreporte.diaMes);
//                 console.log('Tipo de reporte del reporte de configuración:', configreporte.tiporeporte);
//                 console.log('Email de reporte del reporte de configuración:', configreporte.emails);
//                 console.log('---------------------------');

//                 if (configreporte.frecuencia === 'dia') {
//                     fechaFin = new Date();
//                 } else if (configreporte.frecuencia === 'semana') {
//                     fechaFin.setDate(fechaFin.getDate() + 6);
//                 } else if (configreporte.frecuencia === 'mes') {
//                     fechaFin.setMonth(fechaFin.getMonth() + 1);
//                     fechaFin.setDate(0);
//                 }

               
//                 const correos = configreporte.emails;
//                 const reportes = [];

//                 // Solo mantenemos el reporte de acumulativas
//                 if (configreporte.frecuencia === 'dia' || 
//                     (campania && configreporte.frecuencia === 'semana' && isToday(configreporte.diaSemana)) || 
//                     (campania && configreporte.frecuencia === 'mes' && isTodayOfMonth(configreporte.diaMes))) {
                    
//                     if (configreporte.tiporeporte === 'Acumulativas') {
//                         console.log("Generando reporte de Acumulativas...");
//                         reportes.push({
//                             filename: 'ReporteAcumulativas.xlsx',
//                             content: await reporteClientesContraCampanasAcumulativas()
//                         });
//                     }

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }
//             } else {
//                 console.log("No se encontró configreporte para la configuración con ID:", config.id);
//             }
            





//             if (!campania && configreporte.tiporeporte === 'Acumulativas') {
//                 console.log("Generando reporte de Acumulativas sin campaña...");
//                 const reportes = [{
//                     filename: 'ReporteAcumulativas.xlsx',
//                     content: await reporteClientesContraCampanasAcumulativas()
//                 }];
//                 let correos = configreporte.emails;
//                 console.log("Enviando correo electrónico...");
//                 sendEmail(correos, 'Reporte Acumulativas', 'Reporte de acumulativas', reportes);
//             }




//             if (promocion) {
//                 console.log('ID de la configuración:', config.id);
//                 console.log('ID de la promocion:', promocion.id);
//                 console.log('Descripción de la promocion:', promocion.descripcion);
//                 console.log('fechaInicio de la promocion:', promocion.fechaInicio);

//                 const fechaInicio = new Date(promocion.fechaInicio);
//                 let fechaFin = new Date();

//                 if (configreporte.frecuencia === 'dia') {
//                     fechaFin = new Date();
//                 } else if (configreporte.frecuencia === 'semana') {
//                     fechaFin.setDate(fechaFin.getDate() + 6);
//                 } else if (configreporte.frecuencia === 'mes') {
//                     fechaFin.setMonth(fechaFin.getMonth() + 1);
//                     fechaFin.setDate(0);
//                 }

//                 // const fecha1 = fechaInicio;
//                 const fechaFinal = fechaFin;
//                 const correos = configreporte.emails;
//                 const reportes = [];
//                 const idpromocions = promocion.id;

//                 if (configreporte.frecuencia === 'dia') {
//                     console.log("La frecuencia de la campaña es 'dia'. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'Promociones') {
//                         console.log("Generando reporte de Promociones...");
//                         reportes.push({
//                             filename: 'ReportePromociones.xlsx',
//                             content: await generarReportePromociones(idpromocions, fechaInicio, fechaFinal)
//                         });
//                     }
//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }

//                 if (configreporte.frecuencia === 'semana' && isToday(configreporte.diaSemana)) {
//                     console.log("La frecuencia de la campaña es 'semana' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'Promociones') {
//                         console.log("Generando reporte de Promociones...");
//                         reportes.push({
//                             filename: 'ReportePromociones.xlsx',
//                             content: await generarReportePromociones(idpromocions, fechaInicio, fechaFinal)
//                         });
//                     }

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }

//                 if (configreporte.frecuencia === 'mes' && isTodayOfMonth(configreporte.diaMes)) {
//                     console.log("La frecuencia de la campaña es 'mes' y hoy es el día especificado en la configuración. Enviando correo electrónico...");

//                     if (configreporte.tiporeporte === 'Promociones') {
//                         console.log("Generando reporte de Promociones...");
//                         reportes.push({
//                             filename: 'ReportePromociones.xlsx',
//                             content: await generarReportePromociones(idpromocions, fechaInicio, fechaFinal)
//                         });
//                     }

//                     if (reportes.length > 0) {
//                         console.log("Enviando correo electrónico...");
//                         sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes);
//                     }
//                 }
//             } else {
//                 console.log("No hay campaña asociada a esta configuración");
//             }




//         });
//     } catch (error) {
//         console.error('Error al obtener las configuraciones:', error);
//     }
// });

// function isTodayOfMonth(dayOfMonth) {
//     const today = new Date().getDate();
//     return dayOfMonth === today;
// }

// function isToday(dayOfWeek) {
//     const today = new Date().getDay();
//     const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
//     return dayOfWeek.toLowerCase() === days[today];
// }

// module.exports = { taskSendEmail };



// 0 * * * *'

// '*/15 * * * * *'

const taskSendEmail = cron.schedule( '*/15 * * * * *', async () => {
    console.log('Ejecutando una tarea cada minuto');

    try {
        const configs = await Configuraciones.findAll({
            include: [
                { model: Campania, attributes: ['id', 'nombre', 'descripcion', 'fechaInicio'] },
                { model: Promocion, attributes: ['id', 'nombre', 'descripcion', 'fechaInicio'] },
                { model: ConfigReport, attributes: ['id', 'frecuencia', 'diaSemana', 'diaMes', 'tiporeporte', 'emails'] }
            ],
            where: { estado: 1 }
        });

        configs.forEach(async (config) => {
            const campania = config.campanium;
            const configreporte = config.configreporte;
            const promocion = config.promocion;

            if (!configreporte) {
                console.log("No se encontró configreporte para la configuración con ID:", config.id);
                return;
            }

            console.log('ID del reporte de configuración:', configreporte.id);
            console.log('Frecuencia del reporte de configuración:', configreporte.frecuencia);
            console.log('Día de la semana del reporte de configuración:', configreporte.diaSemana);
            console.log('Día del mes del reporte de configuración:', configreporte.diaMes);
            console.log('Tipo de reporte del reporte de configuración:', configreporte.tiporeporte);
            console.log('Email de reporte del reporte de configuración:', configreporte.emails);
            // console.log('fecha inicio promocion:', promocion.fechaInicio);

            console.log('---------------------------');

            const fechaInicio = campania ? new Date(campania.fechaInicio) : (promocion ? new Date(promocion.fechaInicio) : new Date());
            const fechaFin = new Date();

            if (configreporte.frecuencia === 'dia' ||
                (campania && configreporte.frecuencia === 'semana' && isToday(configreporte.diaSemana)) ||
                (campania && configreporte.frecuencia === 'mes' && isTodayOfMonth(configreporte.diaMes))) {

                const correos = configreporte.emails;
                const reportes = [];

                console.log('esta es la fecha final',fechaFin)
                if (configreporte.tiporeporte === 'Acumulativas') {
                    console.log("Generando reporte de Acumulativas...");
                    reportes.push({
                        filename: 'ReporteAcumulativas.xlsx',
                        content: await reporteClientesContraCampanasAcumulativas()
                    });
                } else if (configreporte.tiporeporte === 'OfferCraft') {
                    console.log("Generando reporte de OfferCraft...");
                    reportes.push({
                        filename: 'ReporteOferCraft.xlsx',
                        content: await generarReporteOferCraft(campania ? campania.id : null, fechaInicio, fechaFin)
                    });
                }
                
                else if (configreporte.tiporeporte === 'Referidos') {
                    console.log("Generando reporte de Referidos...");
                    reportes.push({
                        filename: 'ReporteReferidos.xlsx',
                        content: await generarReportereReferidos(campania ? campania.nombre : null, campania ? campania.fechaInicio : null, fechaFin)
                    });
                }

                else if (configreporte.tiporeporte === 'General') {
                    console.log("Generando reporte de General...");
                    reportes.push({
                        filename: 'ReporteGeneralReferidos.xlsx',
                        content: await generarReportereGeneralReferidos(campania ? campania.fechaInicio : null, fechaFin)
                    });
                } else if (configreporte.tiporeporte === 'Promocion') {
                    console.log("Generando reporte de Promociones...");
                    reportes.push({
                        filename: 'ReportePromociones.xlsx',
                        content: await generarReportePromociones(promocion ? promocion.id : null, fechaInicio, fechaFin)
                    });
                }

                if (reportes.length > 0) {
                    console.log("Enviando correo electrónico...");
                    sendEmail(correos, 'Reporte de campaña', 'Reporte de la campaña', reportes,configreporte.tiporeporte);
                }
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
