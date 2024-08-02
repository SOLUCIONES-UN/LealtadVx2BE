const { Router } = require('express');
const router = Router();
const { AddCampaniaInterna, GetCampaniaInternaActivas, GetCampaniaInternaById, ActivarCampaniaInterna, PausarCampaniaInterna, DeleteCampaniaInterna } = require('../controllers/campaniasInternas.controller.js')
const { validateCreate } = require('../validators/usuario')

const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');

const path = 'CampaniasInterna';

router.put(`/${path}/pausar/:id`,  PausarCampaniaInterna);
router.put(`/${path}/activar/:id`,  ActivarCampaniaInterna);
router.post(`/${path}`, AddCampaniaInterna);
router.get(`/${path}`, GetCampaniaInternaActivas);
router.get(`/${path}/cambpaniaInternaById/:id`, GetCampaniaInternaById);
router.delete(`/${path}/:id`, DeleteCampaniaInterna);

module.exports = router

