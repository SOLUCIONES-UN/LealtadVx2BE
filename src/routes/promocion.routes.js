const {Router} = require('express');
const router = Router();
const {GetPromocion,AddPromocion, GetPromocionById, UpdatePromocion, PausarPromocion, ActivarPromocion,TestearCodigo, DeletePromocion,checkNemonico, checkNombre} = require('../controllers/promocion.controller')
const authUser = require('../middlewares/auth.js');
const { Promocion } = require('../models/promocion.js');

const path = 'Promocion';

router.get(`/${path}`, GetPromocion);
router.get(`/${path}/:id`, GetPromocionById);
router.post(`/${path}`, AddPromocion);
router.put(`/${path}/:id`, UpdatePromocion);
router.put(`/${path}/Pau/:id`,PausarPromocion);
router.post('/api/check-nemonico', checkNemonico);
router.post(`/${path}/checkNombre`, checkNombre);
router.put(`/${path}/Act/:id`, ActivarPromocion);
router.delete(`/${path}/:id`, DeletePromocion);


module.exports = router