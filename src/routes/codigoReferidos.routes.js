const { Router } = require('express');
const router = Router();
const { getCodigoReferido, actualizarCodigoReferido, getCodigoReferidoByPhone } = require('../controllers/codigosReferidos.controller');

// const {getCodigoReferido, actualizarCodigoReferido, getCodigoReferidoByPhone} = require('../controllers/codigosReferidos.controller')


//declarampos nuestra constante para almacenar el path`
const path = 'codigoReferidos';

//rutas del proyecto
router.patch(`/${path}`,getCodigoReferido);
router.post(`/${path}/actualizarCodigoReferido`,actualizarCodigoReferido);
router.post(`/${path}/getCodigoReferidoByPhone`,getCodigoReferidoByPhone);

module.exports = router;