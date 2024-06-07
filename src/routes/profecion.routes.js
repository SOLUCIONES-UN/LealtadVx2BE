const {Router} = require('express');
const router = Router();

const {GetProfecion,AddProfecion,GetProfecionById,DeleteProfecion,UpdateProfecion} = require('../controllers/profecionController.js');
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'Profecion';

//rutas del proyecto
router.get(`/${path}`,authUser,GetProfecion);
router.post(`/${path}`,AddProfecion);
router.put(`/${path}/:id`,UpdateProfecion);
router.delete(`/${path}/:id`,DeleteProfecion);
router.get(`/${path}/:id`,GetProfecionById);

//exportacion de rutas
module.exports = router;

