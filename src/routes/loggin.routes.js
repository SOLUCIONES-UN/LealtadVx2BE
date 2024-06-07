const {Router} =require('express');
const router = Router();
const { loggin, getTokenStatus, getNewSession } = require('../controllers/loginController');

const path = 'loggin';

router.post(`/${path}`,loggin);
router.get(`/${path}/getToken`,getTokenStatus)
router.get(`/${path}/getSession`,getNewSession)

module.exports = router;