const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');

//Validacion de recepcion de datos recibidos desde el formulario
const validateCreate = [
    check('descripcion')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]
module.exports = { validateCreate }