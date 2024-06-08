const { Router } = require('express');
const router = Router();

const {

    campanasUsuariosEmulador_get,
    obtenerMistransacciones,
    obtenerTransaccionesValidas,
    
} = require('../controllers/emuladorUsuarioController.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaNumber';

router.get(`/${path}/:telefono`,authUser, campanasUsuariosEmulador_get);
router.get(`/${path}/mistransacciones/:customerId/:idProyecto`,authUser, obtenerMistransacciones);
router.get(`/${path}/transaccionesValidas/:customerId/:idProyecto`,authUser, obtenerTransaccionesValidas);



module.exports = router;