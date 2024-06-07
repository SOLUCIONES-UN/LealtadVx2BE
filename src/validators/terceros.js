const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');


const validateCreate = [
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    // check('nemonico')
    //     .exists()
    //     .not()
    //     .isEmpty(),
    check('token')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]


module.exports = { validateCreate }