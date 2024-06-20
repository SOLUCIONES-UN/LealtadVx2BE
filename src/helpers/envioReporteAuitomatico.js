const cron = require('node-cron');
const { sendEmail } = require('./sendEmail.js');
const { Campania } = require('../models/campanias');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');
const { Promocion } = require('../models/promocion.js');

const { generarReportereReferidos, generarReporteClientesParticipando,generarReportereGeneralReferidos, generarReporteOferCraft, generarReportePromociones,reporteClientesContraCampanasAcumulativas } = require('./generarReportes.js');


// 0 * * * *'

// '*/15 * * * * *'
// '0 0 * * *'

const taskSendEmail = cron.schedule( '0 0 * * *', async () => {
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
