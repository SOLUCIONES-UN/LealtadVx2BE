const { Router } = require('express');
const router = Router();

const {
    // GetEnviaPremio,
    // AddEnvio,
    // UpdateEnvio,
    // DeleteEnvio,
    // generaCampanasUsuarios,
    campanasUsuariosEmulador_get,
    // tienePremiosPenditesCampanas,
    // campaniaNumerosRestringidos,
    // transaccionesValidasCampania,
    // transaccionesValidasCampanasFusion,
    // transaccionesValidasCampanasFusionL,
    // cantidadParametros,
    // validarLimiteParticipacionesPorUsuario,
    // validarParticipacionesRestantes,
    // TransaccionesDelUsuarioPendientesXcampana,
    // CampanasBotonesAppMostrar,
    // campanasRevisionGeneralIdCampana,
    // campaniaNumerosRestringidos,
    // campanasActualesActivasTercero,
    // campanasRevisionGeneral,
    // regionesValidasCampania,
    // GetNumeroById,
    
} = require('../controllers/emuladorUsuarioController.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'ConsultaNumber';


// router.get(`/${path}`, authUser, GetEnviaPremio); 
// router.post(`/${path}`, AddEnvio);
// router.put(`/${path}/:id`, UpdateEnvio); 
// router.delete(`/${path}/:id`, DeleteEnvio); 
// router.get(`/${path}/:referens`, generaCampanasUsuarios);
router.get(`/${path}/:telefono`, campanasUsuariosEmulador_get);
// router.get(`/${path}/campania/:idCampania/usuario/:idUsuarioParticipante`, tienePremiosPenditesCampanas);
// router.get(`/${path}/:idCampania`, CampanasBotonesAppMostrar);
// router.get(`/${path}/:id`, campanasRevisionGeneralIdCampana);
// router.get(`/${path}/:idUsuarioParticipante/:idCampania`, validarLimiteParticipacionesPorUsuario);
// router.get(`/${path}/:idCampania/numero/:numero/restringe/:restringe`, campaniaNumerosRestringidos);
// router.get(`/${path}/:idCampania/:idDepto/:idMuni`, validarParticipacionesRestantes);
// router.get(`/${path}/campania/:idCampania`, transaccionesValidasCampania);
// router.get(`/${path}/cantidad/:idCampania`, cantidadParametros);
// router.get(`/${path}/:idCampania`, transaccionesValidasCampanasFusion);
// router.get(`/${path}/:idCampania`, transaccionesValidasCampanasFusionL);
// router.get(`/${path}/:idParticipacion/:idUsuarioParticipante/:fecha1/:fecha2/:idCampania`, TransaccionesDelUsuarioPendientesXcampana);
// router.get(`/${path}/:campania1`, campanasActualesActivasTercero);
// router.get(`/${path}/:idCampania`, regionesValidasCampania);
// router.get(`/${path}/:campania`, campanasRevisionGeneral);
// router.get(`/${path}/:telefono`, GetNumeroById);
// router.get(`/${path}/veritel/:telno`, GetNumeroById); 


module.exports = router;