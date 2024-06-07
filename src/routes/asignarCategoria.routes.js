const {Router} =require('express');
const router = Router();
const {
    addCategoria,
    getNoAsignados,
    getAsignados,
    deleteTransacciones
} = require('../controllers/asignarCategoria.controller');
const authUser = require('../middlewares/auth.js');

const path = 'asignarCategoria';

//rutas para metodos de asignacion de transacciones a una categoria
//router.get(`/${path}`, getPermisos);
router.patch(`/${path}/noAsignados`,authUser,  getNoAsignados);
router.patch(`/${path}/asignados`,authUser,  getAsignados);
router.post(`/${path}`,authUser, addCategoria);
router.delete(`/${path}`,authUser, deleteTransacciones);

module.exports = router;