const{check} =require('express-validator');
const { validateResult } = require('../helpers/validationHelpers');

const validateCreate = [
    check('idPagina')
        .exists()
        .not()
        .isEmpty(),
    check('idRol')
        .exists()
        .not()
        .isEmpty(),

    check('fechaAsignacion')
        .exists()
        .not()
        .isEmpty(),
    check('username')
        .exists()
        .not()
        .isEmpty(),
    (req,res, next) => {
        validateResult(req,res, next)
    }
]

module.exports = {validateCreate}
    

