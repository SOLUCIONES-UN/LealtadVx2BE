const { Router } = require('express');
const router = Router();

const { GetTablaDB, AddTablaDB, UpdateTablaDB, DeleteTablaDB, GetTablaDbById } = require('../controllers/tabladb.controller.js')
const authUser = require('../middlewares/auth.js');

//declaracion y almacenamiento del path
const path = 'tabladb';

//rutas de proyecto
router.get(`/${path}/tablas`, GetTablaDB);
router.post(`/${path}`, AddTablaDB);
router.put(`/${path}/:id`, UpdateTablaDB);
router.delete(`/${path}/:id`, DeleteTablaDB);
router.get(`/${path}/:id`, GetTablaDbById);

//export routas
module.exports = router;