const { Router } = require('express');
const router = Router();

const { generaCampanasUsuarios } = require('../controllers/emuladorUsuarioController.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaNumber';

router.get(`/${path}/:telefono`, generaCampanasUsuarios);
// router.get(`/${path}/mistransacciones/:customerId/:idProyecto`, obtenerMistransacciones);
// router.get(`/${path}/transaccionesValidas/:customerId/:idProyecto`, obtenerTransaccionesValidas);
// router.get(`/${path}/limiteparticipacion/:usuario/campania/:idCampania`, validarLimiteParticipacionesPorUsuario);

// router.get(`/${path}/numerosrestringidos/campania/:idCampania/telno/:numero/restringeNumero/:restringe`, campaniaNumerosRestringidos);


module.exports = router;