const { Router } = require('express');
const router = Router();
const { AddCampaniaInterna, GetCampaniaInternaActivas, GetTelnoCustomerbilletera, getCampaniasInternasUltimos7Dias, GetcampaniaInternaCount, ArchivarCampaniaInterna, enviarPremiosCampania, actualizarNumero, GetPremiosLink, checkNombre, ActivarCampaniaInterna, PausarCampaniaInterna, DeleteCampaniaInterna, GetCampaniaInternaById, GetTelnoCampanias, Addnumbers } = require('../controllers/campaniasInternas.controller.js');
const { GetcampanasActivas} = require('../controllers/campania.controller.js')
const { validateCreate } = require('../validators/usuario')

const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');

const path = 'CampaniasInterna';

router.put(`/${path}/pausar/:id`,  PausarCampaniaInterna);
router.put(`/${path}/activar/:id`,  ActivarCampaniaInterna);
router.put(`/${path}/archivar/:id`, ArchivarCampaniaInterna);
router.post(`/${path}`, AddCampaniaInterna);
router.post(`/${path}/newPhone`, Addnumbers);
router.post(`/${path}/checknombre`, checkNombre)
router.get(`/${path}/allCampaniaInternas`, GetCampaniaInternaActivas);
router.get(`/${path}/allCampania`,GetcampanasActivas);
router.get(`/${path}/internassemana`, getCampaniasInternasUltimos7Dias);
router.get(`/${path}/campaniaInternaById/:id`, GetCampaniaInternaById);
router.delete(`/${path}/:id`, DeleteCampaniaInterna);
router.get(`/${path}/allphone`, GetTelnoCampanias);
router.get(`/${path}/premiosLink`, GetPremiosLink);
router.delete(`/${path}/:numero/:campaignId`, actualizarNumero);
router.get(`/${path}/compararTelefonos/:idCampaniaInterna`, GetTelnoCustomerbilletera);
router.post(`/${path}/enviarPremio`, enviarPremiosCampania);

module.exports = router


