const { Etapa } = require("../models/etapa");
const { Parametro } = require("../models/parametro");
const { PremioCampania } = require("../models/premioCampania");
const { Presupuesto } = require("../models/presupuesto");


const getParametrosCampania = async (req, res) => {

    try{

        console.log("hola")
        const {idEtapa} = req.params;

        const parametros = await Parametro.findAll({
        where: {
            estado: 1, 
            idEtapa: idEtapa
        }
    });

    res.json(parametros)

    } catch(error) {
        res.status(403);
        res.send({errors: 'Ha sucedido un  error al intentar realizar la consulta de las categorias.'})
    }
}

const getPremiosCampania = async (req, res) => {

    try{
        const {idEtapa} = req.params;

        const premios = await PremioCampania.findAll({
        where: { 
            estado: 1,
            idEtapa: idEtapa
        }
    });

    res.json(premios)

    } catch(error) {
        res.status(403);
        res.send({errors: 'Ha sucedido un  error al intentar realizar la consulta de las categorias.'})
    }
}

const getPresupuestoCampania = async (req, res) => {

    try{
        const {idEtapa} = req.params;

        const presupuesto = await Presupuesto.findAll({
        where: { 
            estado: 1,
            idEtapa: idEtapa
        }
    });

    res.json(presupuesto)

    } catch(error) {
        res.status(403);
        res.send({errors: 'Ha sucedido un  error al intentar realizar la consulta de las categorias.'})
    }
}

const getPrarametrobyId = async (req, res) => {

    try {

        const {id} =req.params;

        const parametro = await Parametro.findByPk(id);
        res.json(parametro);

    } catch (error) {
        res.status(403);
        res.send({errors: 'ha sucedido un error al intentar obtener el parametro.'})
    }

}

const getPremiobyId = async (req, res) => {

    try {

        const {id} =req.params;

        const premio = await PremioCampania.findByPk(id);
        res.json(premio);

    } catch (error) {
        res.status(403);
        res.send({errors: 'ha sucedido un error al intentar obtener el premio.'})
    }

}

const getPresupuestobyId = async (req, res) => {

    try {

        const {id} =req.params;

        const presupuesto = await Presupuesto.findByPk(id);
        res.json(presupuesto);

    } catch (error) {
        res.status(403);
        res.send({errors: 'ha sucedido un error al intentar obtener el parametro.'})
    }

}

const UpdateParametro = async (req, res) => {

    try{

        const {
            limiteParticipacion, 
            idTransaccion, 
            tipoTransaccion, 
            ValorMinimo, 
            ValorMaximo,
            valorAnterior
        } = req.body;

        const {id} = req.params;

        await Parametro.update({
            limiteParticipacion, 
            idTransaccion, 
            tipoTransaccion, 
            ValorMinimo, 
            ValorMaximo,
            valorAnterior
        }, {

            where : {
                id:id
            }
        });

        res.json({code: 'ok', message: 'Parametro Actualizado con exito.'});

    } catch (error) {

        res.status(403);
        res.send({errors: 'Ha ocurrido un error al intentar actualizar el parametro.'});
    }
}

const UpdatePremio = async (req, res) => {

    try{

        const {
            valor,
            idPremio
        } = req.body;

        const {id} = req.params;

        await PremioCampania.update({
            valor,
            idPremio
        }, {

            where : {
                id:id
            }
        });

        res.json({code: 'ok', message: 'Premio Actualizado con exito.'});

    } catch (error) {

        res.status(403);
        res.send({errors: 'Ha ocurrido un error al intentar actualizar el premio.'});
    }
}

const UpdatePresupuesto = async (req, res) => {

    try{

        const {
            idDepartamento, 
            idMunicipio,
            limiteGanadores,
            valor
        } = req.body;

        const {id} = req.params;

        await Presupuesto.update({
            idDepartamento, 
            idMunicipio,
            limiteGanadores,
            valor
        }, {

            where : {
                id:id
            }
        });

        res.json({code: 'ok', message: 'Presupuesto Actualizado con exito.'});

    } catch (error) {

        res.status(403);
        res.send({errors: 'Ha ocurrido un error al intentar actualizar el presupuesto.'});
    }
}

const UpdateEtapa = async (req, res) => {

    try{

        const {
            nombre,
            descripcion,
            orden,
            tipoParticipacion
        } = req.body;

        const {id} = req.params;

        await Etapa.update({
            nombre,
            descripcion,
            orden,
            tipoParticipacion
        }, {

            where : {
                id:id
            }
        });

        res.json({code: 'ok', message: 'Etapa Actualizada con exito.'});

    } catch (error) {

        res.status(403);
        res.send({errors: 'Ha ocurrido un error al intentar actualizar la etapa.'});
    }
}



module.exports = {
    getParametrosCampania, 
    getPremiosCampania, 
    getPresupuestoCampania,
    getPrarametrobyId,
    getPremiobyId,
    getPresupuestobyId,
    UpdateParametro,
    UpdatePremio,
    UpdatePresupuesto,
    UpdateEtapa
}