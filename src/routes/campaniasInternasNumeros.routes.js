const { Router } = require('express');
const router = Router();
const { AddCampaniaInterna, GetCampaniaInternaActivas, GetTelnoCustomerbilletera, enviarPremiosCampania, actualizarNumero, GetPremiosLink, ActivarCampaniaInterna, PausarCampaniaInterna, DeleteCampaniaInterna, GetCampaniaInternaById, GetTelnoCampanias, Addnumbers } = require('../controllers/campaniasInternas.controller.js')
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
router.get(`/${path}/allphone`, GetTelnoCampanias);
router.get(`/${path}/premiosLink`, GetPremiosLink);
router.put(`/${path}/updateNumber/:id`, actualizarNumero);
router.get(`/${path}/compararTelefonos/:idCampaniaInterna`, GetTelnoCustomerbilletera);
router.post(`/${path}/enviarPremio`, enviarPremiosCampania);


module.exports = router


