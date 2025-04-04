const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/database/database');
const { sendEmail } = require('./src/helpers/sendEmail.js');
const { taskSendEmail } = require('./src/helpers/envioReporteAuitomatico.js');

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE,PATCH');
    next();
});

// app.use(cors({
//     origin: 'http://localhost:4200', // Cambia esto al origen de tu frontend
//     methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
//     allowedHeaders: 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
//     credentials: true
// }));

// // Middleware para manejar solicitudes preflight OPTIONS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Cambia esto al origen de tu frontend
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
//     if (req.method === 'OPTIONS') {
//         res.sendStatus(204); // Responde con un estado 204 No Content
//     } else {
//         next();
//     }
// });

app.set('port', process.env.PORT || 3000);
app.use(express.json({ limit: '2048kb' }));

app.use(require('./src/routes/transaccion.routes'));
app.use(require('./src/routes/columna.routes'));
app.use(require('./src/routes/categoria.routes'));
app.use(require('./src/routes/promocion.routes'));
app.use(require('./src/routes/departamento.routes'));
app.use(require('./src/routes/municipio.routes'));
app.use(require('./src/routes/proyectos.routes.js'));
app.use(require('./src/routes/rol.routes'));
app.use(require('./src/routes/terceros.routes'));
app.use(require('./src/routes/premio.routes'));
app.use(require('./src/routes/usuario.routes'));
app.use(require('./src/routes/campania.routes'));
app.use(require('./src/routes/detalleCampania.routes'));
app.use(require('./src/routes/menu.routes'));
app.use(require('./src/routes/pagina.routes'));
app.use(require('./src/routes/profecion.routes'));
app.use(require('./src/routes/enviaPremio.routes'));
app.use(require('./src/routes/permisoUsuario.routes'))
app.use(require('./src/routes/emuladorUsuario.Routes.js'))
app.use(require('./src/routes/cangepromocion.routes'))
app.use(require('./src/routes/asignarCategoria.routes'));
app.use(require('./src/routes/participacionReferidos.routes'));
app.use(require('./src/routes/participacion.routes'));
app.use(require('./src/routes/premiacion.routes'));
app.use(require('./src/routes/reportePromocion.routes'));
app.use(require('./src/routes/reporteReferidos.routes.js'));
app.use(require('./src/routes/reporteGeneralReferidos.routes.js'));
app.use(require('./src/routes/loggin.routes'));
app.use(require('./src/routes/trxCampanias.routes'))
app.use(require('./src/routes/excelReports.routes.js'));
app.use(require('./src/routes/configReferidos.routes.js'));
app.use(require('./src/routes/tabladb.routes.js'));
app.use(require('./src/routes/codigoReferidos.routes.js'));
app.use(require('./src/routes/graficaCampanias.routes.js'))
app.use(require('./src/routes/reporteOfercraft.routes.js'))
app.use(require('./src/routes/participacionesActivas.routes.js'))
app.use(require('./src/routes/ReferidosIngresos.routes.js'))
app.use(require('./src/routes/ReporteParticipantesCampania.routes.js'));
app.use(require('./src/routes/authomaticReport.routes.js'));
app.use(require('./src/routes/reporteClientesContraCampanias.routes.js'));
app.use(require('./src/routes/correosAutomaticos.routes.js'));
app.use(require('./src/routes/participantes.routes.js'));
app.use(require('./src/routes/validaTransaccion.routes.js'));
app.use(require('./src/routes/ReporteNotificaciones.routes.js'));
app.use(require('./src/routes/campaniasInternasNumeros.routes.js'));
app.use(require('./src/routes/participacionTransacciones.routes.js'))

app.listen(app.get('port'), () => {
    console.log('Server Running on Port: ' + app.get('port'));

    //taskSendEmail.start();
    // taskSendEmail.start();
    // taskSendEmail.start();
    // sendEmail("juliaelenagaal@gmail.com", "Prueba", "Prueba de envio de correo", "reporte-notificaciones-offercraft.xlsx", "./reporte-notificaciones-offercraft.xlsx");
    // sendEmail("estiven6647@gmail.com", "Prueba", "Prueba de envio de correo", "reporte-notificaciones-offercraft.xlsx", "./reporte-notificaciones-offercraft.xlsx");

});
