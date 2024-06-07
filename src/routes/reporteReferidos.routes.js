const {Router} = require('express');
const router = Router();

const {getCustomerById, getParticipaciones } = require('../controllers/reporteReferidos.controller');

//declarampos nuestra constante para almacenar el path`
const path = 'reporteReferidos';
//rutas del proyecto
router.post(`/${path}/referidos`,getParticipaciones);

// router.post(`/${path}/customer`,getCustomerById);
// router.get(`/${path}/participaciones`,getParticipacionesFechas);

//exportacion de rutas
module.exports = router;
