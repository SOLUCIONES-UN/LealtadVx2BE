const { Router } = require('express');
const router = Router();
const{
    getParametrosCampania, 
    getPremiosCampania, 
    getPresupuestoCampania, 
    getPrarametrobyId,
    getPremiobyId,
    getPresupuestobyId,
    UpdateParametro,
    UpdatePremio,
    UpdatePresupuesto,
    UpdateEtapa,
    getParticipantes,
    getBloqueados,
    addParametro,
    addPremio,
    addPresupuesto
} = require('../controllers/detallesCampania.controller')

const pathParam = 'parametros';
const pathPremio = 'premios';
const pathPresu = 'presupuesto';
const pathEtapa = 'etapa';
const pathParticipante = 'participantes';
const pathBloqueados = 'Bloqueados';

//rutas del proyecto
router.get(`/${pathParam}/:idEtapa`, getParametrosCampania);
router.get(`/${pathPremio}/:idEtapa`, getPremiosCampania);
router.get(`/${pathPresu}/:idEtapa`, getPresupuestoCampania);
router.get(`/${pathParam}/edith/:id`, getPrarametrobyId);
router.get(`/${pathPremio}/edith/:id`, getPremiobyId);
router.get(`/${pathPresu}/edith/:id`, getPresupuestobyId);
router.get(`/${pathParticipante}/:idCampania`, getParticipantes);
router.get(`/${pathBloqueados}/:idCampania`, getBloqueados);
router.put(`/${pathParam}/update/:id`, UpdateParametro);
router.put(`/${pathPremio}/update/:id`, UpdatePremio);
router.put(`/${pathPresu}/update/:id`, UpdatePresupuesto);
router.put(`/${pathEtapa}/update/:id`, UpdateEtapa);
router.post(`/${pathParam}`, addParametro);
router.post(`/${pathPremio}`, addPremio);
router.post(`/${pathPresu}`, addPresupuesto);


module.exports = router;