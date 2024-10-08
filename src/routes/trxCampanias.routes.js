const { Router } = require('express');
const router = Router();
const { testTransaccion } = require('../controllers/trxCampania.controller')

const path = 'trxCampanias';

router.post(`/${path}/Testear`, testTransaccion);

module.exports = router