const { Op, Sequelize } = require('sequelize');
const { referidosIngresos } = require('../models/ReferidosIngresos');

const GetReferidos = async (req, res)=>{
  
        try {
            const trx = await referidosIngresos.findAll();
            res.json(trx)
            console.log("\n\n\n res",trx);
        } catch (error) {
            console.log("este es:".error)
            res.status(403)
            res.send({ errors: 'Ha sucedido un  error al intentar obtener la lista de referidos.' });
        }
}

const GetReferidoscount = async (req, res) => {
    try {
        const referidosCount = await referidosIngresos.count();
        res.json({ cantidad: referidosCount });
    } catch (error) {
        console.log("Este es el error:", error);
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar obtener la lista de referidos.' });
    }
};

module.exports = {GetReferidos,GetReferidoscount} 