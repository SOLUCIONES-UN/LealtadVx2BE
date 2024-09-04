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
// const {validateCreate} = require('../validators/participacionTransaccion.js')
const authUser = require('../middlewares/auth.js');

const path = 'participacionTransacciones';

router.get(`/${path}`, participacionTransaccion_get);
router.get(`/${path}/campanasUsuarios`, participacionCampanias_get);
router.get(`/${path}/juegoAbierto`, juegoAbierto_get);
router.get(`/${path}/programaReferidosGet`, programaReferidos_get);
router.post(`/${path}/programaReferidosPost`, programaReferidos_post);
router.put(`/${path}/programaReferidosPut`, programaReferidos_put);
router.get(`/${path}/validateCupon`, validateCupon_get);
router.post(`/${path}/programaTerceros`, programaTerceros_post);

module.exports = router;