const cron = require('node-cron');
const { Op } = require('sequelize');
const { Campania } = require('../models/campanias');
const { Participacion } = require('../models/Participacion');
const { sendEmails,sendEmailspart } = require('./sendEmail');
const { CampaniaInterna } = require('../models/campaniasinterno');

function validateEmails(emails) {
    if (!emails) {
        return false;
    }
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailArray = emails.split(',').map(email => email.trim().toLowerCase());
    const invalidEmails = emailArray.filter(email => !emailPattern.test(email));

    if (invalidEmails.length > 0) {
        return false;
    }
    return true;
}

const tareaVerificarCampanias = cron.schedule('00 00 * * *', async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const campanias = await Campania.findAll({
        where: {
            fechaFin: { [Op.between]: [new Date(hoy.getTime()), new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000)] },
            estado: [1, 2, 3]
        },
        attributes: ['id', 'nombre', 'fechaFin', 'emails']
    });

    console.log(`Encontradas ${campanias.length} campañas a vencer en los próximos 5 días.`);
    for (let campania of campanias) {
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

const CampaniaInternaVencer = cron.schedule('00 00 * * *', async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const campanias = await CampaniaInterna.findAll({
        where: {
            fechaFin: { [Op.between]: [new Date(hoy.getTime()), new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000)] },
            estado: [1, 2, 3]
        },
        attributes: ['id', 'nombre', 'fechaFin', 'emails']
    });

    console.log(`Encontradas ${campanias.length} campañas a vencer en los próximos 5 días.`);
    for (let campania of campanias) {
        if (validateEmails(campania.emails)) {
            try {
                const info = await sendEmails(
                    campania.emails,
                    `Aviso de finalización de la campaña interna : ${campania.nombre}`,
                    `<p>La Campaña Interna <strong>${campania.nombre}</strong> vencerá en ${Math.ceil((new Date(campania.fechaFin) - hoy) / (1000 * 60 * 60 * 24))} días.</p>`,
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


const participacionesVencer = cron.schedule('00 00 * * *', async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    console.log('Inicio de la tarea programada para verificar participaciones.');

    const campanias = await Campania.findAll({
        where: {
            fechaFin: { [Op.between]: [new Date(hoy.getTime()), new Date(hoy.getTime() + 5 * 24 * 60 * 60 * 1000)] },
            estado: [1, 2, 3]
        },
        attributes: ['id', 'nombre', 'fechaFin', 'maximoParticipaciones', 'emailspar']
    });

    console.log(`Encontradas ${campanias.length} participaciones a vencer en los próximos 5 días.`);
    for (let campania of campanias) {
        const participacionesCount = await Participacion.count({
            where: {
                idCampania: campania.id
            }
        });

        if (campania.maximoParticipaciones - participacionesCount <= 5) {
            console.log(`La campaña ${campania.nombre} está a punto de alcanzar el máximo de participaciones.`);
            if (validateEmails(campania.emailspar)) {
                try {
                    const info = await sendEmails(
                        campania.emailspar,
                        `Aviso de participación: ${campania.nombre}`,
                        `<p>La Campaña <strong>${campania.nombre}</strong> está a punto de alcanzar el máximo de participaciones. Quedan ${campania.maximoParticipaciones - participacionesCount} participaciones disponibles.</p>`,
                        []
                    );
                    console.log(`Correo enviado: ${info.messageId}`);
                } catch (error) {
                    console.error('Error al enviar correo:', error);
                }
            } else {
                console.log('Formato de correos inválido o no proporcionado.');
            }
        } else {
            console.log(`La campaña ${campania.nombre} aún tiene suficiente espacio para más participaciones.`);
        }
    }
});




module.exports = { tareaVerificarCampanias, participacionesVencer, CampaniaInternaVencer };