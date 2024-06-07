const { Router } = require('express');
const router = Router();
// const {GetReferidos} = require('../controller/referidosIngresos.controller');
const { GetReferidos,GetReferidoscount } = require('../controllers/ReferidosIngresos.controller');


const path = 'referidosIngresos';

router.get(`/${path}`,GetReferidos);
router.get(`/${path}/count`,GetReferidoscount);





module.exports = router;