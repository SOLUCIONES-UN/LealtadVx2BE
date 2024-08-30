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
    // const { codigoBilletera, numeroTransaccion } = req.params;
    const codigoBilletera = 13840;
    const numeroTransaccion = 528759;
    const validaParticipacion = await validaParticipacionTransaccion(codigoBilletera, numeroTransaccion);
    if (validaParticipacion.status){
        res.status(200).json(validaParticipacion);
    }else {
        res.status(400).json({ message: validaParticipacion.message });
    }
};

const participacionCampanias_get = async (req, res) => {
    // const { codigoReferencia } = req.params;
    const codigoReferencia = "696w18a14ab1dcd3bw011806f07d85gf1f5";
    const camapansActivas = await obtieneCampanasActivas(codigoReferencia);
    res.status(200).json({ 
        textoSinInfo: "Estamos trabajando para traerte más promociones.", 
        promociones: camapansActivas.data,
    });
};

const validateCupon_get = async (req, res) => {
    // const { idRevision, cupon } = req.params;
    const idRevision = "13840";
    const cupon = "PPPIELJNF";
    const validaCuponPromo = await validaCupon(idRevision, cupon);
    if (validaCuponPromo.status){
        res.status(200).json({ status: validaCuponPromo.status, message: validaCuponPromo.data.mesajeExito, premio: validaCuponPromo.data.premio, imagen: validaCuponPromo.data.imagen, codigo: validaCuponPromo.data.codigo });
    }else {
        res.status(400).json({ status: validaCuponPromo.status, message: validaCuponPromo.message, premio: '', imagen: validaCuponPromo.data.imagen, codigo: validaCuponPromo.data.codigo });
    }
};

const juegoAbierto_get = async (req, res) => {
    // const { urlJuego } = req.params;
    const urlJuego = "240611179351lKy5MixbFtqvPXoLc";
    const actualizaParticipacion = await actualizaJuego(urlJuego);
    if (actualizaParticipacion.status) {
        res.status(200).json({ status: true, message: ``, data: [] });
    }else{
        res.status(400).json({ status: false, message: `${actualizaParticipacion.message}`, data: [] });
    }
}

const programaReferidos_get = async(req, res) => {
    // const { R1 } = req.params;
    const R1 = '696w18a14ab1dcd3bw011806f07d85gf1f5';
    const resultData = await referidosOpciones(R1);
    if (resultData.status) {
        res.status(200).json(resultData);
    }else{
        res.status(400).json(resultData);
    }
}

const programaReferidos_post = async(req, res) => {
    // const { idtipo, idConfi, usuario } = req.params;
    const idtipo = 1;
    const idConfi = 5;
    const usuario = '696w18a14ab1dcd3bw011806f07d85gf1f5';
    const obtieneCodigo = await obtieneCodigoReferidos(idConfi, usuario, idtipo);
    if (obtieneCodigo.status){
        res.status(200).json({ status: true, message: `${obtieneCodigo.message}`, data: obtieneCodigo.data });
    }else{
        res.status(400).json({ status: true, message: `${obtieneCodigo.message}`, data: [] });
    }
}

const programaReferidos_put = async(req, res) => {
    // const { codigo, usuario } = req.params;
    const codigo = '2408TQRDJU';
    const usuario = '696w18a14ab1dcd3bw011806f07d85gf1f5';
    const validaCodigo = await referidosValidaCodigo(usuario, codigo);
    if (validaCodigo.status){
        res.status(200).json({ estado: 1, tituloMensaje: `¡Felicidades!`, cuerpoMensaje: `${validaCodigo.message}` });
    }else{
        res.status(400).json({ estado: 0, tituloMensaje: `Ups!!!`, cuerpoMensaje: `${validaCodigo.message}` });
    }
}

const programaTerceros_post = async(req, res) => {
    // const { codigoTercero, codigoUnico, idTrx, monto, numBilletera, cupo } = req.params;
    const codigoTercero = 'APPSIP';
    const codigoUnico = '582917062024010316';
    const idTrx = '582917062024010316';
    const monto = '1.0';
    const numBilletera = '50241499776';
    const cupo = '';
    const fecha ='2024-07-04 08:39';
    const adicionales = { descTransaccion: 'Campanatest' }
    const validarParticipacionTerceros = await validaParticipacionTerceros(codigoTercero, codigoUnico, idTrx, monto, numBilletera, cupo, fecha, adicionales);
    if (validarParticipacionTerceros.status){
        res.status(200).json({ status: true, message: `${validarParticipacionTerceros.message}`, data: validarParticipacionTerceros.data });
    }else{
        res.status(400).json({ status: true, message: `${validarParticipacionTerceros.message}`, data: validarParticipacionTerceros.data });
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