const {Router} = require('express');
const router = Router();
const {GetConfigReferidos, UpdateConfigReferidos, DeleteConfigReferidos,AddConfigReferidos,GetConfigReferidosById } = require('../controllers/configReferidos.controller');
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'ConfigReferidos';

//rutas del proyecto
router.get(`/${path}`,authUser, GetConfigReferidos);
router.post(`/${path}`,authUser, AddConfigReferidos);
router.put(`/${path}/:id`,authUser, UpdateConfigReferidos);
router.delete(`/${path}/:id`,authUser, DeleteConfigReferidos);
router.get(`/${path}/:id`,authUser, GetConfigReferidosById);

//exportacion de rutas
module.exports = router;