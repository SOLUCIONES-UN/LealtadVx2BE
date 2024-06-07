const { CangePromocion } = require("../models/cangePromocion");
const { DetallePromocion } = require("../models/detallePromocion");
const { Op, sequelize, } = require("sequelize");
const { Premio } = require("../models/premio");
const { PremioPromocion } = require("../models/premioPromocion");
const { TransaccionPremio } = require("../models/transaccionPremio");
const { Transaccion } = require("../models/transaccion");
const { Participacion } = require("../models/Participacion");
const { Premiacion } = require("../models/premiacion");
const { asignarCategoria } = require("../models/asignarCategoria");
const { Campania } = require("../models/campanias");
const { PremioCampania } = require("../models/premioCampania");
const { Etapa } = require("../models/etapa");


const postDatosCupon = async (promocion,fecha1,fecha2) => {
  try {
    // const { promocion, fechaInicial, fechaFinal } = req.body;

    // const fechafin = new Date(fechaFinal);
    // const fechaIni = new Date(fechaInicial);


    const fechaInicioFormatted = fecha1.toISOString().split('T')[0];
    const fechaFinFormatted = fecha2.toISOString().split('T')[0];
    

    console.log("estoy buscando inicial", fechaInicioFormatted);
    console.log("fecha final", fechaFinFormatted)
    
    const trxAll = await CangePromocion.findAll({
      include: {
        model: DetallePromocion,
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
                  // include: {
                  //   model: Participacion,
                  //   // include: {
                  //   //   model: Transaccion
                  //   // }
                  // }
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
        fecha: {
          [Op.gte]: fechaInicioFormatted,
        },
        fecha: {
          [Op.lte]: fechaFinFormatted,
        },
      },
    });
    // res.json(trxAll)
    return trxAll;

  
  } catch (error) {
    console.error('Error al obtener participaciones en la base de datos "genesis":', error);
    throw new Error('Error al obtener participaciones');
}
};


module.exports = { postDatosCupon };