const { Router } = require('express');
const router = Router();
const { getransaccion,getFailTransaccions, aceptarTransaccionSospechosa, rechazarTransaccion,  getFailTransaccionsByCampania, getCustomerInfoFromPronet } = require('../controllers/validaTransaccion.controller.js')
const { updateConfig, GetConfig, AddCofig,updateCofigValidate,GetCampaniasConfig,DeleteConfig,GetCampaniasValidate,GetCampaniasConfigValidate } = require('../controllers/configValidate.controller.js')
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
router.get(`/${path}/configValidate`, GetCampaniasConfig);
router.get(`/${path}/configCampanias`, GetCampaniasValidate);
router.get(`/${path}/filterCampanias/:validacion`, GetCampaniasConfigValidate);
router.put(`/${path}/config/:id`, updateConfig);
router.put(`/${path}/configValidate/:id`, updateCofigValidate);
router.delete(`/${path}/configValidate/:id`,DeleteConfig);


router.get(`/${path}/customers/:customerId`, async(req, res) => {
    const { customerId } = req.params;
    try {
        const telno = await getCustomerInfoFromPronet(customerId);
        if (telno) {
            return res.json({ telno });
        } else {
            return res.status(404).json({ error: 'CustomerId no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener datos de Pronet para customerId ${customerId}:`, error);
        return res.status(500).json({ error: 'Error al obtener datos del cliente' });
    }
});

module.exports = router