
const express = require('express');
const router = express.Router();
const graficaCampanias = require('../controllers/graficaCampania.controller');
const { ObtenerParticipacionesByFecha} = graficaCampanias;
// Importa la función de controller
router.post('/ReporteParticipantes/ObtenerParticipacionesByFecha', ObtenerParticipacionesByFecha);
// router.get('/ReporteParticipantes/aniosValidos',ObtenerAnio);
// router.post('/ReporteParticipantes/mesesValidos',ObtenerMes);
module.exports = router;