const { Router } = require('express');
const router = Router();
const {canjearCodigo} = require('../controllers/participacionReferidos.controller');

//declarampos nuestra constante para almacenar el path`
const path = 'Canjear';

//rutas del proyecto
router.get(`/${path}`, canjearCodigo);
// router.get(`/${path}/TestearSimple`, TestearTransaccion);

module.exports = router;