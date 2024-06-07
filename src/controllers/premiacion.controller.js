const { Premiacion } = require("../models/premiacion");

const addPremiacion = async (req, res) => {

    const {
        customerId,
        idPremio,
        url,
        valor,
        jugado
    } = req.body;

    try {

        await Premiacion.create({

            customerId,
            idPremio,
            url,
            fecha : new Date(),
            valor,
            jugado

        })

        res.json({ code: 'ok', message: 'Premiacion agregada con exito'});
        
    } catch (error) {
        console.error("e" + error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de premiacion.' });
    }
}

module.exports = {addPremiacion};