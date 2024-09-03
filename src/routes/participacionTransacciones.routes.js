const { Router } = require('express');
const router = Router();

const {
    participacionTransaccion_get,
    participacionCampanias_get,
    validateCupon_get,
    juegoAbierto_get,
    programaReferidos_get,
    programaReferidos_post,
    programaReferidos_put,
    programaTerceros_post,
} = require('../controllers/participacionTransaccion.controller.js');
// const {validateCreate} = require('../validators/transaccion.js')
const authUser = require('../middlewares/auth.js');

const path = 'participacionTransacciones';

// router.post(`/${path}`, authUser, campanasUsuariosEmulador_get);
router.get(`/${path}`, participacionTransaccion_get); // LISTO
router.get(`/${path}/campanasUsuarios`, participacionCampanias_get); // LISTO
router.get(`/${path}/juegoAbierto`, juegoAbierto_get); // LISTO
router.get(`/${path}/programaReferidosGet`, programaReferidos_get); // LISTO
router.get(`/${path}/programaReferidosPost`, programaReferidos_post); // LISTO
router.get(`/${path}/programaReferidosPut`, programaReferidos_put);
router.get(`/${path}/validateCupon`, validateCupon_get); // LISTO
router.get(`/${path}/programaTerceros`, programaTerceros_post); // LISTO


module.exports = router;