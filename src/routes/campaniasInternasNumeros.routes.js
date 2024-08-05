const { Router } = require('express');
const router = Router();
const { AddCampaniaInterna, GetCampaniaInternaActivas, actualizarNumero, GetPremiosLink, ActivarCampaniaInterna, PausarCampaniaInterna, DeleteCampaniaInterna, GetCampaniaInternaById, GetTelnoCampanias, Addnumbers } = require('../controllers/campaniasInternas.controller.js')
const { validateCreate } = require('../validators/usuario')

const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');

const path = 'CampaniasInterna';

router.put(`/${path}/pausar/:id`,  PausarCampaniaInterna);
router.put(`/${path}/activar/:id`,  ActivarCampaniaInterna);
router.post(`/${path}`, AddCampaniaInterna);
router.post(`/${path}/newPhone`, Addnumbers);
router.get(`/${path}`, GetCampaniaInternaActivas);
router.get(`/${path}/campaniaInternaById/:id`, GetCampaniaInternaById);
router.delete(`/${path}/:id`, DeleteCampaniaInterna);
router.get(`/${path}/telnoById/:id`, GetTelnoCampanias);
router.get(`/${path}/premiosLink`, GetPremiosLink);
router.put(`/${path}/updateNumber/:id`, actualizarNumero);

module.exports = router

