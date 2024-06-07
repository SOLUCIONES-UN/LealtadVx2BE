const {Router} = require('express');
const router = Router();
const {addPremiacion} =  require('../controllers/premiacion.controller');

const path = 'Premiacion';

router.post(`/${path}`,addPremiacion);

module.exports = router;

