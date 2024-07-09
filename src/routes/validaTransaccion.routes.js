const { Router } = require('express');
const router = Router();
const { getransaccion, getFailTransaccions } = require('../controllers/validaTransaccion.controller.js')
const { validateCreate } = require('../validators/usuario')
const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');


//declarampos nuestra constante para almacenar el path`
const path = 'Validate';


//rutas del proyecto
router.get(`/${path}`, getransaccion);
router.get(`/${path}/fail`, getFailTransaccions);




module.exports = router