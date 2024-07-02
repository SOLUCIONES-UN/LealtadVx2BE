const {Router} = require('express');
const router = Router();
const {GetConfigReferidos, UpdateConfigReferidos, DeleteConfigReferidos,AddConfigReferidos,GetConfigReferidosById } = require('../controllers/configReferidos.controller');
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'ConfigReferidos';

//rutas del proyecto
router.get(`/${path}`, GetConfigReferidos);
router.post(`/${path}`, AddConfigReferidos);
router.put(`/${path}/:id`, UpdateConfigReferidos);
router.delete(`/${path}/:id`, DeleteConfigReferidos);
router.get(`/${path}/:id`, GetConfigReferidosById);

//exportacion de rutas
module.exports = router;