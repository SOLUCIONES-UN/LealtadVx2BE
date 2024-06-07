const {Router} = require('express');
const router = Router();

const {getUsuariosParticipantesFechasCampanasSel } = require('../controllers/ReporteParticipanteCampania.controller');

//declarampos nuestra constante para almacenar el path`
const path = 'ReporteParticipanteCampania';
//rutas del proyecto
router.post(`/${path}/participantes`,getUsuariosParticipantesFechasCampanasSel);

// router.post(`/${path}/customer`,getCustomerById);
// router.get(`/${path}/participaciones`,getParticipacionesFechas);

//exportacion de rutas
module.exports = router;