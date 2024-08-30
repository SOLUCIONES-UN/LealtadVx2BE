const axios = require('axios');
const { request } = require('express');

const baseUrl = 'http://localhost:3000/';

const sendOffercraft = async () => {
    // axios.post(`${baseUrl}api/v1/marketing/sendindividual_promotions`, {
    //     'R1' => $infCliente[0]->telno,
    //     'R2' => $tituloNotificacion,
    //     'R3' => $descripcionNotificacion,
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
    // });
    axios.get(`https://jsonplaceholder.typicode.com/users/`)
    .then((response)=>{
        console.log(response);
    })
    .catch((error)=>{
        console.log(error)
    });
    return false
}

const sendBilletera = async () => {
    // $textoAleatorio = (string)date("d") . (string)date("m") . (string)date("Y") . (string)date("H") . (string)date("i") . (string)date("s");
    // axios.post(`${baseUrl}api/v1/transaction/load_money_offercraft`, {
    //     'mobile' => $informacionUsuario[0]->telno,
    //     'typeTranx' => $valorpremiosPermitidos->descripcion,
    //     'amount' => $valorpremiosPermitidos->valor,
    //     'urlGame' => $textoAleatorio,
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