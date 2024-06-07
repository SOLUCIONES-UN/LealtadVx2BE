const { Router } = require('express');
const router = Router();

const {
    
    reporteClientesContraCampanas,
    
    
} = require('../controllers/reporteCampaniasAcumuladas.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaReporteAcumulado';

router.get(`/${path}`, reporteClientesContraCampanas);

module.exports = router;