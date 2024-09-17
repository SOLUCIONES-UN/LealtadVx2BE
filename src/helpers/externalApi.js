const axios = require('axios');
const { request } = require('express');

const baseUrl = 'http://localhost:3000/';

const sendOffercraft = async (telno, titulo, descripcion) => {
    // TODO: CONTINUAR CON LAS PRUEBAS AL SERVICIO DE PRONET
    // axios.post(`${baseUrl}api/v1/marketing/sendindividual_promotions`, {
    //     'R1' => telno,
    //     'R2' => titulo,
    //     'R3' => descripcion,
    //     'R4' => '',
    //     'R5' => ''
    // },{
    //     Headers:{
    //         'x-api-key': `7T1S9KEIKYQBCO30SHJSW`,
    //         // 'Authorization': `Basic ${btoa('PRONET:ADU381NUYAHPPL9281SD')}`,
    //     },
    //     Authorization:{
    //         username: 'PRONET',
    //         password: 'ADU381NUYAHPPL9281SD',
    //     }
    // })
    // .then((response)=>{
    //     console.log(response);
    // })
    // .catch((error)=>{
    //     console.log(error)
    // });
    return false
}

const sendBilletera = async (telno, descripcion, valor, url) => {
    // TODO: CONTINUAR CON LAS PRUEBAS AL SERVICIO DE PRONET
    // $textoAleatorio = (string)date("d") . (string)date("m") . (string)date("Y") . (string)date("H") . (string)date("i") . (string)date("s");
    // axios.post(`${baseUrl}api/v1/transaction/load_money_offercraft`, {
    //     'mobile' => telno,
    //     'typeTranx' => descripcion,
    //     'amount' => valor,
    //     'urlGame' => url,
    //     'empresa' => 'AKISI'
    // },{
    //     Headers:{
    //         'x-api-key': `7T1S9KEIKYQBCO30SHJSW`,
    //         // 'Authorization': `Basic ${btoa('PRONET:ADU381NUYAHPPL9281SD')}`,
    //     },
    //     Authorization:{
    //         username: 'PRONET',
    //         password: 'ADU381NUYAHPPL9281SD',
    //     }
    // })
    // .then((response)=>{
    //     console.log(response);
    // })
    // .catch((error)=>{
    //     console.log(error)
    // });
    return false
}

const getImgBase64 = async (imgFile) => {
    try {
        const imgBaseFile = await axios.get(`https://www.akisi.com/assets/miniatura.png`).then(response => Buffer.from(response.data, 'binary').toString('base64'));
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