const { Router } = require('express');
const router = Router();

const {
    getParticipacionesActivas,
    getclientes
} = require('../controllers/participacionesActivas.controller.js');
const authUser = require('../middlewares/auth.js');


const path = 'ParticipacionesActivas';

router.post(`/${path}`, getParticipacionesActivas);
router.get(`/${path}/clientes`, getclientes);



module.exports = router;