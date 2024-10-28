const axios = require('axios');
const { request } = require('express');

const baseUrl = 'http://localhost:3000/';

const sendOffercraft = async (telno, titulo, descripcion) => {
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}api/v1/marketing/sendindividual_promotions`,
        headers: {
          'x-api-key': '7T1S9KEIKYQBCO30SHJSW',
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        data : JSON.stringify({
            "R1": telno,
            "R2": titulo,
            "R3": descripcion,
            "R4": "",
            "R5": ""
        }),
    };
    try {
        const response = await axios.request(config);
        return { status: true, data: response.data, message: `` };
    } catch (err) { 
        return { status: false, data: err.response.data, message: `Error: Enviando Notificacion` };
    }
}

const sendBilletera = async (telno, descripcion, valor, url) => {
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}api/v1/transaction/load_money_offercraft`,
        headers: { 
            'x-api-key': '7T1S9KEIKYQBCO30SHJSW', 
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json', 
        },
        data : JSON.stringify({
            "mobile": telno,
            "typeTranx": descripcion,
            "amount": valor,
            "urlGame": url,
            "empresa": "AKISI"
        }),
    };
    try {
        const response = await axios.request(config);
        return { status: true, data: response.data, message: `` };
    } catch (err) { 
        return { status: false, data: err.response.data, message: `Error: Solicitando Envio A Billetera` };
    }
}

const getImgBase64 = async (imgFile) => {
    try {
        const imgBaseFile = await axios.get(`${imgFile}`).then(response => Buffer.from(response.data, 'binary').toString('base64'));
        return `data:image/png;base64,${imgBaseFile}`;
    } catch (error) {
        return '';
    }
}

module.exports = { 
    sendOffercraft,
    sendBilletera,
    getImgBase64,
}