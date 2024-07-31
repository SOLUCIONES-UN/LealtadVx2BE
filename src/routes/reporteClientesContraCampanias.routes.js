const { Router } = require('express');
const router = Router();

const {
    
    reporteClientesContraCampanas,
    validarLimiteParticipacionesPorUsuario
    
    
} = require('../controllers/reporteCampaniasAcumuladas.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaReporteAcumulado';

router.get(`/${path}`, reporteClientesContraCampanas);

router.get(`/${path}/participacionusuario/:`, validarLimiteParticipacionesPorUsuario);

module.exports = router;