const { Router } = require('express');
const router = Router();

const {
    tareaVerificarCampanias,

} = require('../helpers/correosAutomaticos.js');
const authUser = require('../middlewares/auth.js');
 

const path = 'correoAutomatico';

router.get(`/${path}/correo`, async (req, res) => {
    try {
        await tareaVerificarCampanias();
        res.status(200).send('Proceso de verificación de campañas iniciado.');
    } catch (error) {
        res.status(500).send('Error al iniciar la verificación de campañas: ' + error.message);
    }
});


module.exports = router;