const { Op } = require("sequelize");
const { CangePromocion } = require("../models/cangePromocion");
const { DetallePromocion } = require("../models/detallePromocion");
const { PremioPromocion } = require("../models/premioPromocion");
const { Promocion } = require("../models/promocion");

//metodo para validar
const Participar = async (req, res) => {
  try {
    const { cupon, numero } = req.body;
    let validacion = await validarParticipacion(cupon);

    const { data, result } = validacion;

    if (result) {
      let descripcion = "CANJE DE CODIGO " + data.nemonico;

      const participado = addParticipacion(
        descripcion,
        numero,
        data.id,
        data.promocion
      );

      if (!participado) {
        let newData = { ...data };
        newData.code = "07";
        newData.message =
          "Error Interno al Participar, Comuniquese con un administrador.";
        validacion.data = newData;
      }
    }
    res.json(validacion);
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors: "Ha sucedido un  error al Realizar la Promocion.",
    });
  }
};

//Metodo para testear los codigos
const Testear = async (req, res) => {
  try {
    const { cupon } = req.body;
    let validacion = await validarParticipacion(cupon);

    res.json(validacion);
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors: "Ha sucedido un  error al Testear la Promocion.",
    });
  }
};

const addParticipacion = async (descripcion, numero, id, promocion) => {
  try {
    const premios = await PremioPromocion.findAll({
      where: {
        idPromocion: promocion,
      },
    });





    await CangePromocion.create({
      descripcion,
      fecha: new Date(),
      numeroTelefono: numero,
      idDetallePromocion: id,
    });

    await DetallePromocion.update(
      {
        estado: 2,
      },
      {
        where: {
          id: id,
        },
      }
    );

    //update DetalleParticipacion set estado = 2 where id= 1

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const validarParticipacion = async (cupon) => {
  const cantidadCupones = await getCantidadNumeroCupones(cupon);

  let result = true;
  let data = {};

  if (cantidadCupones === 0) {
    result = false;
    data.code = "03";
    data.message = "El cupon no existe";

    return { result, data };
  }

  const validaFecha = await ValidarFechaCupon(cupon);

  if (!validaFecha) {
    result = false;
    data.code = "04";
    data.message = "Esta promocion ya se encuentra expirada";
    return { result, data };
  }

  const datosCupon = await getDatosCupon(cupon);
  const { promocion } = datosCupon;

  console.log(promocion.estado);
  if (datosCupon.estado === 2) {
    result = false;
    data.code = "05";
    data.message = "Este cupon ya se encuentra cangeado";
    return { result, data };
  }

  if (promocion.estado === 0) {
    result = false;
    data.code = "06";
    data.message = "Este Cupon no se encuentra disponible";
    return { result, data };
  }

  //cosas que devolvera si o si
  data.id = datosCupon.id;
  data.PremioXcampania = promocion.PremioXcampania;
  data.nemonico = promocion.nemonico;
  data.descripcion = promocion.descripcion;
  data.promocion = promocion.id;

  if (datosCupon.esPremio === 0) {
    result = false;
    data.code = "02";
    data.message = promocion.mesajeFail;
    data.img = promocion.imgFail;
    return { result, data };
  }

  data.code = "01";
  data.message = promocion.mesajeExito;
  data.img = promocion.imgSuccess;

  //code 03  cupon no existe
  //code 04  promocion vencida o eliminada
  //code 05  Cupon ya Cangeado
  //code 06  Cupon eliminado
  //code 01 cupon valido
  //code 02 cupon no valido

  return { result, data };
};

//obtener numero de cupones
const getCantidadNumeroCupones = async (cupon) => {
  const cantidadCupones = await DetallePromocion.count({
    where: {
      cupon: cupon,
    },
  });

  return cantidadCupones;
};

// Funcion para validar que el cupon esté entre el rango de la fecha
const ValidarFechaCupon = async (cupon) => {
  const cuponDentroActivo = await Promocion.count({
    include: {
      model: DetallePromocion,
      where: {
        cupon: cupon,
      },
    },
    where: {
      estado: 1,
      fechaInicio: {
        [Op.lte]: new Date(),
      },
      fechaFin: {
        [Op.gte]: new Date(),
      },
    },
  });

  return cuponDentroActivo > 0;
};

// Devolver los datos del cupon ganador
const getDatosCupon = async (cupon) => {
  const datosCupon = await DetallePromocion.findOne({
    include: {
      model: Promocion,
    },
    where: {
      cupon: cupon,
    },
  });

  return datosCupon;
};


module.exports = { Participar, Testear };
