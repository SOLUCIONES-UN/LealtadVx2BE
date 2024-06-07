const { Router } = require('express');
const router = Router();
const { addPermiso, getPermisos, getNoAsignados, getAsignados, deletePermisos } = require('../controllers/permisoUsuario.controller')
const { } = require('../validators/permisoUsuario');
const authUser = require('../middlewares/auth.js');

const path = 'permisosUsuario';

//rutas para metodos de departamento
router.get(`/${path}/:username`, authUser, getPermisos);
router.patch(`/${path}/noAsignados`, authUser, getNoAsignados);
router.patch(`/${path}/asignados`, getAsignados);
router.post(`/${path}`, addPermiso);
//router.put(`/${path}/:id`,validateCreate,UpdateDepartamento);
router.delete(`/${path}`, deletePermisos);
//router.get(`/${path}/:id`,GetDepartamentobyId);

module.exports = router;