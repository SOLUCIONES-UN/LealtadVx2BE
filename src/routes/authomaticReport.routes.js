const { Router } = require('express');
const router = Router();
const { AddConfiguration, GetConfiguraciones, UpdateReport, GetReportById, DeleteReport,StateReport } = require('../controllers/authomaticReport.js');
const { validateCreate } = require('../validators/columna')
const authUser = require('../middlewares/auth.js');

//declarampos nuestra constante para almacenar el path`
const path = 'authomatic';

//rutas del proyecto
// router.get(`/${path}`, GetConfiguraciones);
router.get(`/${path}/:tiporeporte`, GetConfiguraciones);
router.post(`/${path}`, AddConfiguration);
router.put(`/${path}/update/:id`, UpdateReport);
// router.get(`/${path}/:id`, GetReportById);
router.get(`/${path}/config/:id`, GetReportById);
router.delete(`/${path}/:id`, authUser, DeleteReport);
router.put(`/${path}/state/:id/:estate`, authUser, StateReport);




module.exports = router;