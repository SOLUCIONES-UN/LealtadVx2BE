const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');


const validateCreate = [
    check('username')
        .exists()
        .not()
        .isEmpty(),
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    check('password')
        .exists()
        .not()
        .isEmpty(),
    check('telefono')
        .exists(),
    check('emailNotificacion')
        .exists()
        .not()
        .isEmpty(),
    check('idRol')
        .exists()
        .not()
        .isEmpty()
        .isNumeric(),
        
        (req, res, next) => {
            validateResult(req, res, next);
        }
    ]

module.exports = { validateCreate }