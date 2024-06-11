const {Router} = require('express');
const router = Router();
const {AddColumna,UpdateColumna,DeleteColumna,GetColumnaById,GetColumnas, GetTablaByProyectos, GetColumnasByTablas} = require('../controllers/columna.controller');
const {validateCreate} = require('../validators/columna')
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'Columna';
const path_tabla = 'tabla';

//rutas del proyecto
router.get(`/${path}`,authUser,GetColumnas);
router.post(`/${path}`,authUser,AddColumna);
router.put(`/${path}/:id`,validateCreate,authUser,UpdateColumna);
router.delete(`/${path}/:id`,authUser,DeleteColumna);
router.get(`/${path}/:id`,authUser,GetColumnaById);
router.get(`/${path_tabla}/:idProyectos`,GetTablaByProyectos);
router.get(`/${path}/bytablas/:idTablas`,authUser,GetColumnasByTablas);

module.exports = router;