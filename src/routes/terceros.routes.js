const {Router} = require('express');
const router = Router();
const {GetTerceros, AddTercero, UpdateTercero, DeleteTercero, GetTerceroById} = require('../controllers/tercero.controller')
const {validateCreate} = require('../validators/terceros')
const authUser = require('../middlewares/auth.js');

const path = 'Tercero';

//rutas del proyecto
router.get(`/${path}`,authUser,GetTerceros);
router.post(`/${path}`,authUser,AddTercero);
router.put(`/${path}/:id`,validateCreate,authUser,UpdateTercero);
router.delete(`/${path}/:id`,authUser,DeleteTercero);
router.get(`/${path}/:id`,authUser,GetTerceroById);

module.exports = router;