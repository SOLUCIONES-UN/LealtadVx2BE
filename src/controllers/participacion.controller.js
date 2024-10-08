const {Participacion} = require("../models/Participacion");
const { TransaccionPremio } = require("../models/transaccionPremio");



const getParticipaciones = async (req, res) => {
    try {
        const participaciones = await Participacion.findAll({
            attributes: ['customerId', 'customerName', 'Idtxt', 'descripcionTrx', 'tipo', 'idTransaccion', 'idCampania', 'etapa', 'valor', 'fecha']
        });
        
        res.json(participaciones);
    } catch (error) {
      
        res.status(500).json({ error: 'Ha ocurrido un error al obtener las participaciones.' });
    }
};

const addParticipacion = async (req, res) => {
    const {
        customerId,
        customerName,
        Idtxt,
        descripcionTrx,
        tipo,
        idTransaccion,
        idCampania,
        etapa,
        valor

    } = req.body

    try {
        await Participacion.create({
            customerId,
            customerName,
            fecha : new Date(),
            idtxt : Idtxt,
            descripcionTrx,
            tipo,
            idTransaccion,
            idCampania,
            etapa,
            valor
        })

        res.json({ code: 'ok', message: 'Participacion agregada con exito'});

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de Participacion.' });
    }
};

const getcountCustomerName = async (req,res) =>{
    try {
        const countParticipacions = await Participacion.count();
        res.json({ totalParticipacions: countParticipacions });
        
    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al obtener las participaciones.' });
    }
};

const getSumarValor = async (req,res) => {
    try {
        const sumaValor = await Participacion.sum('valor');

        console.log('\n\n\n\n\n total ' + sumaValor);
        res.json({ total: sumaValor});
        console.log("La suma del valor es:", sumaValor);
    } catch (error) {
        console.error("\n\n\n\nError al calcular la suma de valor:", error);
    }
}
 
module.exports = {
    addParticipacion,
    getParticipaciones,
    getcountCustomerName,
    getSumarValor,
    
}