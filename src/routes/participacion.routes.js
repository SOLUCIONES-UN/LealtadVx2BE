const express = require('express');
const router = express.Router();
const participacionController = require('../controllers/participacion.controller');

// Rutas del proyecto
router.post('/Participacion', participacionController.addParticipacion);
router.get('/Participacion', participacionController.getParticipaciones);
router.get('/Participacion/count', participacionController.getcountCustomerName);
router.get('/Participacion/sumarvalor', participacionController.getSumarValor);




module.exports = router;
