const { Router } = require('express');
const router = Router();
const { getransaccion,getFailTransaccions, aceptarTransaccionSospechosa, rechazarTransaccion,  getFailTransaccionsByCampania, getCustomerInfoFromPronet } = require('../controllers/validaTransaccion.controller.js')
const { updateConfig, GetConfig, AddCofig,updateCofigValidate,GetCampaniasConfig,DeleteConfig,GetCampaniasValidate, GetConfigById, GetCampaniasConfigValidate } = require('../controllers/configValidate.controller.js')
const { validateCreate } = require('../validators/usuario')
const env = require('../bin/env');
const authUser = require('../middlewares/auth.js');

const path = 'Validate';

router.get(`/${path}`, getransaccion);
router.get(`/${path}/fail`, getFailTransaccions);
router.get(`/${path}/campaniafail/:campaniaId`, getFailTransaccionsByCampania);
router.put(`/${path}/aceptar/:id`, aceptarTransaccionSospechosa);
router.put(`/${path}/rechazar/:id`, rechazarTransaccion);
router.post(`/${path}`, AddCofig);
router.get(`/${path}/config`, GetConfig);
router.get(`/${path}/configById/:id`, GetConfigById);
router.get(`/${path}/configValidate`, GetCampaniasConfig);
router.get(`/${path}/configCampanias`, GetCampaniasValidate);
router.get(`/${path}/filterCampanias/:validacion`, GetCampaniasConfigValidate);
router.put(`/${path}/config/:id`, updateConfig);
router.put(`/${path}/configValidate/:id`, updateCofigValidate);
router.delete(`/${path}/configValidate/:idConfiguration`, DeleteConfig);


module.exports = router