const { Router } = require('express');
const router = Router();

const {
    participacionTransaccion_post,
    participacionCampanias_get,
    validateCupon_get,
    juegoAbierto_get,
    programaReferidos_get,
    programaReferidos_post,
    programaReferidos_put,
    programaTerceros_post,
    cronJobParticipacionBilletera_get,
    cronJobParticipacionOffercraft_get,

} = require('../controllers/participacionTransaccion.controller.js');
// const {validateCreate} = require('../validators/participacionTransaccion.js')
const authUser = require('../middlewares/auth.js');

const path = 'participacionTransacciones';

// Valida una transaccion para participacion en campañas
// v1 => LenguajeTransaccion/testeoApi
router.post(`/${path}/campanaParticipacion`, participacionTransaccion_post);
// Obtiene las campañas activas
// v1 => CampanasUsuarios/campanasUsuarios
router.get(`/${path}/campanasUsuarios/:codigoReferencia`, participacionCampanias_get);
// Marca el estado de jugado de las participaciones por urlPremio
// v1 => CampanasUsuarios/juegoAbierto
router.get(`/${path}/juegoAbierto`, juegoAbierto_get);
// Obtiene las opciones para poder referir
// v1 => ApiProgramaReferidos/programaReferidos
router.get(`/${path}/programaReferidosGet/:R1`, programaReferidos_get);
// Obtiene un codigo para que los referidos lo ingresen
// v1 => ApiProgramaReferidos/programaReferidos
router.post(`/${path}/programaReferidosPost`, programaReferidos_post);
// Valida un codigo ingresado por el usuario referido y solicita el premio por transaccion
// v1 => ApiProgramaReferidos/programaReferidos
router.put(`/${path}/programaReferidosPut`, programaReferidos_put);
// Valida un cupon canjeado
// v1 => TransaccionesPromocion/validateCupon
router.get(`/${path}/validateCupon/:idRevision/:cupon`, validateCupon_get);
// Valida una Transaccion del sistama de terceros APPSIP..
// v1 => TransaccionesTerceros/programaTerceros
router.post(`/${path}/programaTerceros`, programaTerceros_post);
// Funcion para buscar las operaciones pendientes de premio por billetera
router.get(`/${path}/cronJobParticipacionBilletera`, cronJobParticipacionBilletera_get);
// Funcion para buscar las operaciones pendientes de envio offercraft
router.get(`/${path}/cronJobParticipacionOffercraft`, cronJobParticipacionOffercraft_get);

module.exports = router;