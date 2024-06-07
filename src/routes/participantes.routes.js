const {Router} = require('express');
const router = Router();
const {GetTransaccions, getParticipantes,} = require('../controllers/participantes.controller.js')
const {validateCreate} = require('../validators/transaccion')
const authUser = require('../middlewares/auth.js');


//declarampos nuestra constante para almacenar el path`
const path = 'Participante';
//rutas del proyecto
router.get(`/${path}`, getParticipantes);
// router.get(`/${path}/count`,authUser, GetTransaccionscount);
// router.get(`/${path}/:id`,authUser, GetTransaccionById);
// router.post(`/${path}`,validateCreate,authUser, AddTransaccion);
// router.put(`/${path}/:id`,validateCreate,authUser, UpdateTransaccion);
// router.delete(`/${path}/:id`,authUser, DeleteTransaccion);





module.exports = router