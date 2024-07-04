const { Op } = require("sequelize");
const { CangePromocion } = require("../models/cangePromocion");
const { DetallePromocion } = require("../models/detallePromocion");
const { PremioPromocion } = require("../models/premioPromocion");
const { Promocion } = require("../models/promocion");


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

    const updated = await DetallePromocion.update(
      {
        estado: 2,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updated[0] === 0) {
      throw new Error("No se pudo actualizar el estado del cupon.");
    }

    // await DetallePromocion.update(
    //   {
    //     estado: 2,
    //   },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );


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

  const fechaActual = new Date();
  const fechaFin = new Date(promocion.fechaFin);

  if (fechaActual > fechaFin && datosCupon.estado !== 2) {
    await DetallePromocion.update(
      { estado: 3 },
      { where: { cupon: cupon }}
    );
    datosCupon.estado = 3;
  }

  if (datosCupon.estado === 3 ) {
    result = false;
    data.code = "08";
    data.message = "Este cupon ya esta vencido";
    return { result, data };
  }

  if (!await ValidarFechaCupon(cupon)) {
    result = false;
    data.code = "04";
    data.message = "Esta promocion ya se encuentra expirada";
    return { result, data };
  }

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


  return { result, data };
};

const getCantidadNumeroCupones = async (cupon) => {
  const cantidadCupones = await DetallePromocion.count({
    where: {
      cupon: cupon,
    },
  });

  return cantidadCupones;
};

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
