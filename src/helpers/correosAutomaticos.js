const cron = require('node-cron');
const { Op } = require('sequelize');
const { Campania } = require('../models/campanias');
const {sendEmails} = require('./sendEmail');

function validateEmails(emails) {
    if (!emails) {
        console.log("No hay correos proporcionados.");
        return false;
    }
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailArray = emails.split(',');
    const invalidEmails = emailArray.filter(email => !emailPattern.test(email.trim().toLowerCase()));
    if (invalidEmails.length > 0) {
        return false;
    }
    return  true;
}

const tareaVerificarCampanias = cron.schedule('0 0 * * *', async () => {

    const hoy = new Date();

    const inicioVentana = new Date(hoy.getTime());
    const finVentana = new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000);

    const campanias = await Campania.findAll({
        where: {
            fechaFin: { [Op.between]: [inicioVentana, finVentana] },
            estado: [1, 2, 3]
        },
        attributes: ['id', 'nombre', 'fechaFin', 'emails']
    });

    for (let campania of campanias) {
        const fechaFin = new Date(campania.fechaFin);
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

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
            }
        } else {
        }
    }
});
module.exports = { tareaVerificarCampanias };
