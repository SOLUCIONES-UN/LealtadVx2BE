const nodemailer = require("nodemailer");
const env = require("../bin/env");
const { report } = require("../routes/campania.routes");

//metodo usado para enviar los reportes de las campñas a los correos configurados
const sendEmail = async (to, subject, text, files) => {
    try {
        //configuración de los correos
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        });

        // files.map( report => {
        //   console.log( "nombre del archivo ", report.filename);
        //   console.log("archivo",report.content);
        // })

        //configuración del mensaje
        const mailOptions = {
            from: env.EMAIL_USER,
            to: to,
            subject: "Reporte de campañas",
            //text: text,
            html: `
            <h1>Reporte campañas</h1>
            <p>Hemos generado el siguiente reporte de la campaña: </p> 
            `,
            attachments: files,
            // [
            //   files.map( report => ({
            //     filename: report.filename,
            //     path: report.content
            //   }))
            // ],
        };

        //envio del correo
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
