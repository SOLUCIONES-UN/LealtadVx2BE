

const cron = require('node-cron');
const { Op } = require('sequelize');
const { Campania } = require('../models/campanias');
// const env = require("../bin/env");
const {sendEmails} = require('./sendEmail');

// Función para validar emails
function validateEmails(emails) {
    if (!emails) {
        console.log("No hay correos proporcionados.");
        return false;
    }
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailArray = emails.split(',');
    const invalidEmails = emailArray.filter(email => !emailPattern.test(email.trim().toLowerCase()));
    if (invalidEmails.length > 0) {
        console.log("Correos inválidos detectados:", invalidEmails.join(", "));
        return false;
    }
    return true;
}


// Tarea programada para revisar y notificar sobre campañas cada 3 minutos
const tareaVerificarCampanias = cron.schedule('00 00 * * * *', async () => {
    console.log('Ejecutando tarea cada 3 minutos para verificar campañas cercanas a vencer');
    const hoy = new Date();
    const finVentana = new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000);

    console.log('Fecha actual:', hoy.toISOString());
    console.log('Fin de ventana de 5 días:', finVentana.toISOString());

    const campanias = await Campania.findAll({
        where: {
            fechaFin: { [Op.between]: [hoy, finVentana] },
            estado: 1
        },
        attributes: ['id', 'nombre', 'fechaFin', 'emails']
    });

    console.log(`Encontradas ${campanias.length} campañas a vencer en los próximos 5 días.`);
    for (let campania of campanias) {
        const fechaFin = new Date(campania.fechaFin);
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

        console.log(`Procesando campaña: ${campania.nombre}`);
        console.log(`Días restantes para ${campania.nombre}: ${diasRestantes} días`);

        if (validateEmails(campania.emails)) {
           
            try {
                const info = await sendEmails(
                    campania.emails, 
                    `Aviso de finalización de campaña: ${campania.nombre}`,
                    `<p>La Campaña <strong>${campania.nombre}</strong> vencerá en ${diasRestantes} días.</p>`,
                    [] 
                );
                console.log(`Correo enviado: ${info.messageId}`);
            } catch (error) {
                console.error('Error al enviar correo:', error);
            }
        } else {
            console.log('Los correos deben separarse por coma ","');
        }
    }
});

module.exports = { tareaVerificarCampanias };
