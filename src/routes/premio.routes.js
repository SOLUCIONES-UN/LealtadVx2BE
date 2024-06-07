const {Router} = require('express');
const router = Router();
const {GetPremios, AddPremio, UpdatePremio, DeletePremio, GetPremioById} = require('../controllers/premio.controller')
const {validateCreate} = require('../validators/premio')
const authUser = require('../middlewares/auth.js');


//declarampos nuestra constante para almacenar el path`
const path = 'Premio';

//rutas del proyecto
router.get(`/${path}`,authUser, GetPremios);
router.get(`/${path}/:id`,authUser,GetPremioById);
router.post(`/${path}`,authUser,AddPremio);
router.put(`/${path}/:id`,authUser,UpdatePremio);
router.delete(`/${path}/:id`,authUser,DeletePremio);


module.exports = router