const {Router} = require('express');
const router = Router();
const{GetDepartamentos, GetDepartamentosByProyectoId, AddDepartamentos, UpdateDepartamento, DeleteDepartamento, GetDepartamentobyId} = require('../controllers/departamento.controller');
const {validateCreate} = require('../validators/departamento')
const authUser = require('../middlewares/auth.js');

//almacenamos el path
const path = 'Departamento';

//rutas para metodos de departamento
router.get(`/${path}`,authUser, GetDepartamentos);
router.post(`/${path}`,authUser,AddDepartamentos);
router.put(`/${path}/:id`,validateCreate,authUser,UpdateDepartamento);
router.delete(`/${path}/:id`,authUser,DeleteDepartamento);
router.get(`/${path}/:id`,authUser,GetDepartamentobyId);
router.get(`/${path}byproyecto/:idProyecto`, authUser, GetDepartamentosByProyectoId);
module.exports = router;