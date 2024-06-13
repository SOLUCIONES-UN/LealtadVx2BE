const nodemailer = require("nodemailer");
const env = require("../bin/env");
const { report } = require("../routes/campania.routes");

//metodo usado para enviar los reportes de las campñas a los correos configurados
const sendEmail = async (to, subject, text, files, reportType) => {
    try {
        // Configuración de los correos
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        });

        // Configuración del mensaje
        let reportName = '';
        let reportContent = '';

        // Determina el nombre y el contenido del reporte dependiendo del tipo
        if (reportType === 'Promocion') {
            reportName = 'Reporte de Promoción';
            reportContent = 'Hemos generado el siguiente reporte de la promoción:';
        } else if (reportType === 'OfferCraft') {
            reportName = 'Reporte de OfferCraft';
            reportContent = 'Hemos generado el siguiente reporte de OfferCraft:';
        }else if (reportType === 'Acumulativas') {
            reportName = 'Reporte de campanias Acumulativas';
            reportContent = 'Hemos generado el siguiente reporte de Campañas Acumulativas:';
        } else if (reportType === 'General') {
            reportName = 'Reporte  General de Referidos';
            reportContent = 'Hemos generado el siguiente reporte General de Referidos:';
        } else if (reportType === 'Referidos') {
            reportName = 'Reporte   Referidos';
            reportContent = 'Hemos generado el siguiente reporte General de Referidos:';
        }  else {
            // Por defecto, si no se especifica un tipo de reporte válido, se utiliza el asunto y el contenido genéricos
            reportName = 'Reporte de campañas';
            reportContent = 'Hemos generado el siguiente reporte de la campaña:';
        }
        

        const mailOptions = {
            from: env.EMAIL_USER,
            to: to,
            subject: reportName,
            html: `
            <h1>${reportName}</h1>
            <p>${reportContent}</p> 
            `,
            attachments: files,
        };

        // Envío del correo
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(error);
    }
};

async function sendEmails(to, subject, html, attachments = []) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
        attachments: attachments.map(file => ({
            filename: file.filename,
            path: file.path
        }))
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail, sendEmails };
