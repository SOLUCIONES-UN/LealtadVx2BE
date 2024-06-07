const {Router} = require('express');
const router = Router();
const {AddPagina,GetPaginas,GetPaginaById,DeletePagina,UpdatePagina} = require('../controllers/pagina.controller');
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'Pagina';

//rutas del proyecto
router.get(`/${path}`,authUser,GetPaginas);
router.post(`/${path}`,authUser,AddPagina);
router.put(`/${path}/:id`,authUser,UpdatePagina);
router.delete(`/${path}/:id`,authUser,DeletePagina);
router.get(`/${path}/:id`,authUser,GetPaginaById);

//exportacion de rutas
module.exports = router;