const { Router } = require('express');
const router = Router();

const {
    getParticipacionesFechasGeneral
} = require('../controllers/reporteGeneral.controller.js');
const authUser = require('../middlewares/auth.js');


const path = 'reporteGeneralReferido';

router.get(`/${path}/:fecha1/:fecha2`, getParticipacionesFechasGeneral);


module.exports = router;