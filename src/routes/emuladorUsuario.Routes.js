const { Router } = require('express');
const router = Router();

const {

    campanasUsuariosEmulador_get,
    obtenerMistransacciones,
    obtenerTransaccionesValidas,
    
} = require('../controllers/emuladorUsuarioController.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaNumber';

router.get(`/${path}/:telefono`, campanasUsuariosEmulador_get);
router.get(`/${path}/mistransacciones/:customerId/:idProyecto`, obtenerMistransacciones);
router.get(`/${path}/transaccionesValidas/:customerId/:idProyecto`, obtenerTransaccionesValidas);



module.exports = router;