const { Router } = require('express');
const router = Router();
const { GetProjects, AddProject, GetProjectByID, UpdateProject, DeleteProject,Getproyectoscount } = require('../controllers/proyectos.controller.js')
const { validateCreate } = require('../validators/proyectos.validator.js')
const authUser = require('../middlewares/auth.js');

const path = 'projects';

router.get(`/${path}`, authUser, GetProjects);
router.get(`/${path}/count`,Getproyectoscount);
router.get(`/${path}/:id`, authUser, GetProjectByID);
router.post(`/${path}`, validateCreate, authUser, AddProject);
router.put(`/${path}/:id`, validateCreate, authUser, UpdateProject);
router.delete(`/${path}/:id`, authUser, DeleteProject);

module.exports = router