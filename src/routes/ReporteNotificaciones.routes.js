const {Router} = require('express');
const router = Router();

const {getReporteNoficacionesOffer} = require('../controllers/ReporteNotificaciones.controller');

const path = 'ReporteNotificaciones';
router.post(`/${path}/Notificacion`,getReporteNoficacionesOffer);


module.exports = router;