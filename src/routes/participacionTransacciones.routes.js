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
const {revisaBilleteraPorReferencia} = require('../helpers/participacion.js');
// const {validateCreate} = require('../validators/participacionTransaccion.js')
const authUser = require('../middlewares/auth.js');

const path = 'participacionTransacciones';

router.get(`/${path}`, participacionTransaccion_get);
router.get(`/${path}/campanasUsuarios/:codigoReferencia`, participacionCampanias_get);
router.get(`/${path}/juegoAbierto`, juegoAbierto_get);
router.get(`/${path}/programaReferidosGet/:R1`, programaReferidos_get);
router.post(`/${path}/programaReferidosPost`, programaReferidos_post);
router.put(`/${path}/programaReferidosPut`, programaReferidos_put);
router.get(`/${path}/validateCupon/:idRevision/:cupon`, validateCupon_get);
router.post(`/${path}/programaTerceros`, programaTerceros_post);

router.get(`/${path}/revisaBilletera/:codigoReferencia`, async (req, res) => {
    try {
        const codigoReferencia = req.params.codigoReferencia;
        const result = await revisaBilleteraPorReferencia(codigoReferencia);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error al consultar la billetera' });
    }
});


module.exports = router;