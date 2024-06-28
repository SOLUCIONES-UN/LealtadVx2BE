const cron = require('node-cron');
const { Op } = require('sequelize');
const { Campania } = require('../models/campanias');
const { sendEmails } = require('./sendEmail');

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

const tareaVerificarCampanias = cron.schedule('00 00 * * *', async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    console.log('Inicio de la tarea programada para verificar campañas.');

    const campanias = await Campania.findAll({
        where: {
            fechaFin: { [Op.between]: [new Date(hoy.getTime()), new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000)] },
            estado: [1, 2, 3]
        },
        attributes: ['id', 'nombre', 'fechaFin', 'emails']
    });

    console.log(`Encontradas ${campanias.length} campañas a vencer en los próximos 5 días.`);
    for (let campania of campanias) {
        console.log(`Procesando campaña: ${campania.nombre}`);
        if (validateEmails(campania.emails)) {
            try {
                const info = await sendEmails(
                    campania.emails,
                    `Aviso de finalización de campaña: ${campania.nombre}`,
                    `<p>La Campaña <strong>${campania.nombre}</strong> vencerá en ${Math.ceil((new Date(campania.fechaFin) - hoy) / (1000 * 60 * 60 * 24))} días.</p>`,
                    []
                );
                console.log(`Correo enviado: ${info.messageId}`);
            } catch (error) {
                console.error('Error al enviar correo:', error);
            }
        } else {
            console.log('Formato de correos inválido o no proporcionado.');
        }
    }
});
module.exports = { tareaVerificarCampanias };