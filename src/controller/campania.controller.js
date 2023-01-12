const { Campania } = require('../models/campanias');
const { Etapa } = require('../models/etapas');
const { Parametro } = require('../models/parametro');
const { PremioCampania } = require('../models/premioCampania');
const { Presupuesto } = require('../models/presupuesto');


//accion para insertar una nueva trnasaccion
const AddCampania = async (req, res) => {

    const {
        fechaCreacion,
        fechaInicio,
        fechaFin,
        nombre,
        descripcion,
        edadInicial,
        edadFinal,
        sexo,
        tipoUsuario,
        tituloNotificacion,
        descripcionNotificacion,
        imgPush,
        imgAkisi,
        estado,
        etapas
    } = req.body;


    try {
        const newCampains = await Campania.create({
            fechaCreacion,
            fechaInicio,
            fechaFin,
            nombre,
            descripcion,
            edadInicial,
            edadFinal,
            sexo,
            tipoUsuario,
            tituloNotificacion,
            descripcionNotificacion,
            imgPush,
            imgAkisi,
            estado
        });
        const { id } = newCampains.dataValues;


        etapas.forEach(element => {
            element.idCampana = id;
            AddEtapas(element);
        });


    } catch (error) {
        console.error(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de Categoria.' });
    }






}


const AddEtapas = async (etapa) => {
    const { nombre, descripcion, orden, idCampana, parametros, premios, presupuestos } = etapa;

    const newEtatpa = await Etapa.create({
        nombre,
        descripcion,
        orden,
        idCampana,
        estado: 1
    });

    const { id } = newEtatpa.dataValues;

    await AddPremios(premios, id)
    await AddParametros(parametros, id)
    await AddPresupuesto(presupuestos, id)
}


const AddParametros = async (parametros, idEtapa) => {
    parametros.map((element, index) => {
        parametros[index].idEtapa = idEtapa
    });
    await Parametro.bulkCreate(parametros);
}

const AddPremios = async (premios, idEtapa) => {
    premios.map((element, index) => {
        premios[index].idEtapa = idEtapa
    });
    await PremioCampania.bulkCreate(premios);
}


const AddPresupuesto = async (presupuestos, idEtapa) => {
    presupuestos.map((element, index) => {
        presupuestos[index].idEtapa = idEtapa
    });
    await Presupuesto.bulkCreate(premios);
}
