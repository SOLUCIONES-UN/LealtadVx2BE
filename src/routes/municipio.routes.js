const { Router } = require('express');
const router = Router();
const { GetMunicipios, AddMunicipio, UpdateMunicipio, DeleteMunicipio, GetMunicipioById, getMunicipalitiesByDepartment } = require('../controllers/municipio.controller')
const { validateCreate } = require('../validators/municipio')
const authUser = require('../middlewares/auth.js');


//declarampos nuestra constante para almacenar el path`
const path = 'Municipio';


//rutas del proyecto
router.get(`/${path}`, authUser, GetMunicipios);
router.get(`/${path}/:id`, authUser, GetMunicipioById);
router.get(`/${path}/by/:id`, authUser, getMunicipalitiesByDepartment);
router.post(`/${path}`, validateCreate, authUser, AddMunicipio);
router.put(`/${path}/:id`, validateCreate, authUser, UpdateMunicipio);
router.delete(`/${path}/:id`, authUser, DeleteMunicipio);


module.exports = router