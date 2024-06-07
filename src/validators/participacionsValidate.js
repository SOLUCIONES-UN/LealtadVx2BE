const { check } = require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');

const validateGetParticipaciones = [

    check('Authorization')
        .exists()
        .withMessage('Token de autorización no proporcionado'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateGetParticipaciones };
