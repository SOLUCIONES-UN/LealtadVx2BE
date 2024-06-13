const { CangePromocion } = require("../models/cangePromocion");
const { DetallePromocion } = require("../models/detallePromocion");
const { Op, sequelize } = require("sequelize");
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




const postDatosCupon = async (idpromocions, fechaInicio, fechaFinal ) => {
    try {
    //   const { idpromocions, fechaInicio, fechaFinal } = data;
  
      console.log("Fecha Inicio:", fechaInicio);
      console.log("Fecha Final:", fechaFinal);
      
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
            idPromocion: idpromocions,
          },
        },
        where: {
          fecha: {
            [Op.gte]: fechaInicio,
            [Op.lte]: fechaFinal,
          },
        }
      });
      return trxAll;
    
    } catch (error) {
      console.log(error);
      throw new Error('Hubo un problema al cargar la data.');
    }
  };
  
  module.exports = { postDatosCupon };


