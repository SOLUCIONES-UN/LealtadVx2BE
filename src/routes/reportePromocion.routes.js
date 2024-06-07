const {Router} = require('express');
const { postDatosCupon } = require('../controllers/reportPromocion.js');
const authUser = require('../middlewares/auth.js');
const router = Router();




const path = 'reportePromocion';

router.post(`/${path}`, postDatosCupon);



module.exports = router