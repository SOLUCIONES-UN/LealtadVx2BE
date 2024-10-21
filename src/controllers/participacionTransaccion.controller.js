const {
    actualizaJuego,
    referidosOpciones,
    referidosValidaCodigo,
    validaParticipacionTransaccion,
    obtieneCampanasActivas,
    validaCupon,
    obtieneCodigoReferidos,
    validaParticipacionTerceros,

    
} = require('../helpers/participacion.js');

const participacionTransaccion_get = async (req, res) => {
    const { codigoBilletera, numeroTransaccion } = req.params;
    
    const validaParticipacion = await validaParticipacionTransaccion(codigoBilletera, numeroTransaccion);
    if (validaParticipacion.status){
        res.status(200).json(validaParticipacion);
    }else {
        res.status(400).json({ message: validaParticipacion.message });
    }
};

const participacionCampanias_get = async (req, res) => {
    const { codigoReferencia } = req.params;
    const camapansActivas = await obtieneCampanasActivas(codigoReferencia);
    res.status(200).json({ 
        textoSinInfo: "Estamos trabajando para traerte más promociones.", 
        promociones: camapansActivas.data,
    });
};


const validateCupon_get = async (req, res) => {
    const { idRevision, cupon } = req.params;
    const validaCuponPromo = await validaCupon(idRevision, cupon);
    
    console.log('Contenido completo de validaCuponPromo:', validaCuponPromo);

    if (validaCuponPromo.status) {
        console.log("Imagen en caso de éxito:", validaCuponPromo.data.imagen);
        res.status(200).json({
            status: validaCuponPromo.status,
            message: validaCuponPromo.message,
            premio: validaCuponPromo.data.premio,
            imagen: validaCuponPromo.data.imagen,
            codigo: validaCuponPromo.data.codigo
        });
    } else {
        console.log("Imagen en caso de fallo:", validaCuponPromo.data.imagen);
        res.status(400).json({
            status: validaCuponPromo.status,
            message: validaCuponPromo.message,
            premio: validaCuponPromo.data.premio,
            imagen: validaCuponPromo.data.imagen,
            codigo: validaCuponPromo.data.codigo
        });
    }
};

const juegoAbierto_get = async (req, res) => {
    const { urlJuego, monto } = req.params;
    const actualizaParticipacion = await actualizaJuego(urlJuego, monto);
    if (actualizaParticipacion.status) {
        res.status(200).json({ status: true, message: ``, data: [] });
    }else{
        res.status(400).json({ status: false, message: `${actualizaParticipacion.message}`, data: [] });
    }
}

const programaReferidos_get = async(req, res) => {
    const { R1 } = req.params;
    const resultData = await referidosOpciones(R1);
    if (resultData.status) {
        res.status(200).json(resultData);
    }else{
        res.status(400).json(resultData);
    }
}

const programaReferidos_post = async(req, res) => {
    const { idtipo, idConfi, usuario } = req.body;
    const obtieneCodigo = await obtieneCodigoReferidos(idConfi, usuario, idtipo);
    if (obtieneCodigo.status){
        res.status(200).json({ status: true, message: `${obtieneCodigo.message}`, data: obtieneCodigo.data });
    }else{
        res.status(400).json({ status: false, message: `${obtieneCodigo.message}`, data: [] });
    }
}

const programaReferidos_put = async(req, res) => {
    const { codigo, usuario } = req.body;
    const validaCodigo = await referidosValidaCodigo(usuario, codigo);
    if (validaCodigo.status){
        res.status(200).json({ estado: 1, tituloMensaje: `¡Felicidades!`, cuerpoMensaje: `${validaCodigo.message}` });
    }else{
        res.status(400).json({ estado: 0, tituloMensaje: `Ups!!!`, cuerpoMensaje: `${validaCodigo.message}` });
    }
}

const programaTerceros_post = async(req, res) => {
    const { codigoTercero, codigoUnico, idTrx, monto, numBilletera, cupo, fecha, adicionales } = req.body;
    const validarParticipacionTerceros = await validaParticipacionTerceros(codigoTercero, codigoUnico, idTrx, monto, numBilletera, cupo, fecha, adicionales);
    if (validarParticipacionTerceros.status){
        res.status(200).json({ status: true, message: `${validarParticipacionTerceros.message}`, data: validarParticipacionTerceros.data });
    }else{
        res.status(400).json({ status: false, message: `${validarParticipacionTerceros.message}`, data: validarParticipacionTerceros.data });
    }
}

module.exports = {
    participacionTransaccion_get,
    participacionCampanias_get,
    validateCupon_get,
    juegoAbierto_get,
    programaReferidos_get,
    programaReferidos_post,
    programaReferidos_put,
    programaTerceros_post,
}