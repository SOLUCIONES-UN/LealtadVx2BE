const { Router } = require('express');
const router = Router();
const { testTransaccion } = require('../controllers/trxCampania.controller')


//declarampos nuestra constante para almacenar el path`
const path = 'trxCampanias';


//rutas del proyecto
router.post(`/${path}/Testear`, testTransaccion);

module.exports = router