const { Router } = require('express');
const router = Router();
const { AddCampaniaInterna, GetCampaniaInternaActivas, ActivarCampaniaInterna, PausarCampaniaInterna, DeleteCampaniaInterna, GetCampaniaInternaById, GetTelnoCampanias } = require('../controllers/campaniasInternas.controller.js')
const { validateCreate } = require('../validators/usuario')

const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');

const path = 'CampaniasInterna';

router.put(`/${path}/pausar/:id`,  PausarCampaniaInterna);
router.put(`/${path}/activar/:id`,  ActivarCampaniaInterna);
router.post(`/${path}`, AddCampaniaInterna);
router.get(`/${path}`, GetCampaniaInternaActivas);
router.get(`/${path}/campaniaInternaById/:id`, GetCampaniaInternaById);
router.delete(`/${path}/:id`, DeleteCampaniaInterna);
router.get(`/${path}/telnoById/:id`, GetTelnoCampanias)

module.exports = router

