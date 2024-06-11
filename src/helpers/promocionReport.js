const { CangePromocion } = require("../models/cangePromocion");
const { DetallePromocion } = require("../models/detallePromocion");
const { Op, sequelize, } = require("sequelize");
const { Premio } = require("../models/premio");
const { PremioPromocion } = require("../models/premioPromocion");
const { Configuraciones } = require("../models/configuraciones");
const { Transaccion } = require("../models/transaccion");
const { Participacion } = require("../models/Participacion");
const { Premiacion } = require("../models/premiacion");
const { Promocion } = require("../models/promocion");
const { Campania } = require("../models/campanias");
const { PremioCampania } = require("../models/premioCampania");
const { Etapa } = require("../models/etapa");



const postDatosCupon = async(req, res) => {
    try {
        const { promocion, fechaInicio, fechaFinal } = req.body;


        const trxAll = await CangePromocion.findAll({
            include: {
                model: DetallePromocion,
                include: {
                    model: Promocion,
                    include: {
                        model: PremioPromocion,
                        include: {
                            model: Premio,
                            include: {
                                model: PremioCampania,
                                include: {
                                    model: Etapa,
                                    include: {
                                        model: Campania,

                                    }
                                }
                            },
                        },
                    },
                },
                where: {
                    idPromocion: promocion,
                },
            },
            where: {
                [Op.and]: [
                    { fecha: {
                            [Op.gte]: fechaInicio } },
                    { fecha: {
                            [Op.lte]: fechaFinal } }
                ]
            }
        });
        res.json(trxAll)


    } catch (error) {
        console.log(error)
        res.status(403)
        res.send({ errors: 'Hubo un problema al cargar la data.' })
    }
};


module.exports = { postDatosCupon };