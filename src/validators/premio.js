const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');


const validateCreate = [
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    check('descripcion')
        .exists()
        .not()
        .isEmpty(),
    check('link')
        .exists(),
    check('claveSecreta')
        .exists(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]


module.exports = { validateCreate }
