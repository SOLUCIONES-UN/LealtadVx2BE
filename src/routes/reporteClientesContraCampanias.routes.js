const { Router } = require('express');
const router = Router();

const {
    
    // fechaminimavalida,
    // fechamaximavalida,
    // usuarioParticipantes,
    // usuarioParticipantes_get
    // transaccionesDelUsuarioPendientes
    // informacionGeneralUsuario 
    reporteClientesContraCampanas,
    // campanaPremiosInfoCliente
    
    
} = require('../controllers/reporteCampaniasAcumuladas.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaReporteAcumulado';

router.get(`/${path}`, reporteClientesContraCampanas);
// router.get(`/${path}/:idTransaccion`, campanaPremiosInfoCliente);
// router.get(`/${path}/:usuarioId`, informacionGeneralUsuario );
// router.get(`/${path}/:idUsuario/:fecha1/:fecha2`, transaccionesDelUsuarioPendientes);
// router.get(`/${path}/fechaminimavalida`, fechaminimavalida);
// router.get(`/${path}/fechamaximavalida`, fechamaximavalida);
// router.get(`/${path}/:fechaI/:fechaF`, usuarioParticipantes_get);

module.exports = router;