const {Router} = require('express');
const router = Router();
const {GetRoles, AddRol, UpdateRol, DeleteRol, GetRolById} = require('../controllers/rol.controller')
const {validateCreate} = require('../validators/rol')
const authUser = require('../middlewares/auth.js');


//declarampos nuestra constante para almacenar el path`
const path = 'Rol';


//rutas del proyecto
router.get(`/${path}`,authUser, GetRoles);
router.get(`/${path}/:id`,authUser,GetRolById);
router.post(`/${path}`,validateCreate,authUser,AddRol);
router.put(`/${path}/:id`,validateCreate,authUser,UpdateRol);
router.delete(`/${path}/:id`,authUser,DeleteRol);


module.exports = router