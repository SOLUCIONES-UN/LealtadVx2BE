const {Router} = require('express');
const router = Router();
const { getCustomers } = require('../controllers/customercontroller.js');

//declarampos nuestra constante para almacenar el path`
const path = 'customer';


//rutas del proyecto
router.get(`/${path}`,getCustomers);

module.exports = router;