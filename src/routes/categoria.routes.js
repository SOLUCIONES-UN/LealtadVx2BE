const {Router} = require('express');
const router = Router();
const {AddCategoria,GetCategorias,GetCategoriaById,DeleteCategoria,UpdateCategoria} = require('../controllers/categoria.controller');
const {validateCreate} = require('../validators/categoria')
const authUser = require('../middlewares/AuthMiddleware');

//declarampos nuestra constante para almacenar el path`
const path = 'Categoria';


//rutas del proyecto
router.get(`/${path}`,authUser,GetCategorias);
router.post(`/${path}`,AddCategoria);
router.put(`/${path}/:id`,validateCreate,UpdateCategoria);
router.delete(`/${path}/:id`,DeleteCategoria);
router.get(`/${path}/:id`,GetCategoriaById);

module.exports = router;