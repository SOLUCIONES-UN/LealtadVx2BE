const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');


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