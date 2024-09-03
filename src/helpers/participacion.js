const { pronet, sequelize } = require('../database/database');
const { Sequelize } = require('sequelize');
const { RAW } = require('sequelize/lib/query-types');
const Op = Sequelize.Op;

const { Campania } = require('../models/campanias');
const { Etapa } = require('../models/etapa');
const { Parametro } = require('../models/parametro');
const { Participantes } = require('../models/participantes');
const { PremioCampania } = require('../models/premioCampania');
const { Presupuesto } = require('../models/presupuesto');
const { Bloqueados} = require('../models/bloqueados');
const { Participacion } = require('../models/Participacion');
const { Acumulados } = require('../models/acumulados');
const { Premio } = require('../models/premio');
const { codigoReferido } = require('../models/codigoReferidos');
const { referidosIngresos } = require('../models/ReferidosIngresos');
const { TransaccionesTerceros} = require('../models/transaccionesTerceros');
const { BitacoraParticipacion, BitacoraPromocion, BitacoraJuegoAbierto, BitacoraReferido } = require('../models/bitacora');

const { sendOffercraft, sendBilletera, getImgBase64 } = require('../helpers/externalApi');

const getTransacciones = async (codigoReferencia, cantidadRegistros) => {
    try {
        const data = await pronet.query(
            `CALL pronet.get_customer_transactions_app_transaccion_campanas(:customer_reference, :registros);`, 
            {
                replacements: { customer_reference: codigoReferencia, registros: cantidadRegistros },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        let regData = [];
        for(const key in data[0]){
            const transaction = await sequelize.query(`SELECT * FROM transaccions WHERE '${data[0][key].transaction_description}' LIKE CONCAT('%', descripcion, '%');`, { type: Sequelize.QueryTypes.SELECT });
            if(transaction.length>0){
                data[0][key].transaction_code = transaction[0].id;
            }else{
                data[0][key].transaction_code = 0;
            }
            regData.push(data[0][key]);
        }
        return { status: true, data: regData, message: `` }
    } catch (err) { 
        return { status: false, data: [], message: `Error: Consultando Transacciones` }
    }
}

const revisaTransaccion = async (codigoReferencia, numeroTransaccion) => {
    const ultimasTransacciones = await getTransacciones(codigoReferencia, 20);
    if(!ultimasTransacciones.status) {
        return { status: false, data: [], message: `${ultimasTransacciones.message}` }
    }
    if(ultimasTransacciones.data.length==0){
        return { status: false, data: [], message: `Error: No Existen Transacciones` }
    }
    const ultimaTransaccion = ultimasTransacciones.data.filter((item)=>{ return (item.transaction_id==numeroTransaccion) });
    if(ultimaTransaccion.length==0) {
        return { status: false, data: [], message: `Error: No Fue Posible Encontrar Informacion de la Transaccion` }
    }
    return { status: true, data: ultimaTransaccion[0], message: `` }
}

const revisaBilletera = async (codigoReferencia) => {
    try {
        const data = await pronet.query(
            `SELECT tc.customer_id, tc.customer_reference, 
            DATE_FORMAT(tc.created_date, '%Y-%m-%d') fechaCreacion, 
            timestampdiff(YEAR,bdate,now()) edad, 
            CASE WHEN tui.gender = 'MALE' THEN 1 WHEN tui.gender = 'FEMALE' THEN 2 END genero, 
            tc.telno, tc.department, tc.municipality, tc.is_finish_registration, tc.has_life_validate, tc.has_complete_profile, tc.has_validate_dpi, tc.has_commerce, CURDATE() AS hoy, DATEDIFF(CURDATE(), tc.created_date) AS diasdecracion 
            FROM pronet.tblUserInformation tui INNER JOIN pronet.tbl_customer tc ON tc.fk_userid = tui.userid WHERE tc.customer_id = :customer_id`, 
            {
                replacements: { customer_id: codigoReferencia },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if(data.length==0){
            return { status: false, data: [], message: `Error: No Existe Billetera` }
        }
        if(data[0].has_life_validate=='0' || data[0].has_validate_dpi==0){
            return { status: false, data: [], message: `Error: El Perfil De Billetera No Esta Completo` }
        }
        return { status: true, data: data[0], message: `` }
    } catch (err) {
        return { status: false, data: 0, message: `Error: Consultando Billetera` }
    }
}

const revisaBilleteraPorReferencia = async (codigoReferencia) => {
    try {
        const data = await pronet.query(
            `SELECT tc.customer_id, tc.customer_reference, 
            DATE_FORMAT(tc.created_date, '%Y-%m-%d') 
            fechaCreacion,timestampdiff(YEAR,bdate,now()) edad, 
            CASE WHEN tui.gender = 'MALE' THEN 1 WHEN tui.gender = 'FEMALE' THEN 2 END genero, 
            tc.telno, tc.department, tc.municipality, tc.is_finish_registration, tc.has_life_validate, tc.has_complete_profile, tc.has_validate_dpi, tc.has_commerce, CURDATE() AS hoy 
            FROM pronet.tblUserInformation tui INNER JOIN pronet.tbl_customer tc ON tc.fk_userid = tui.userid WHERE tc.customer_reference = :customer_reference`, 
            {
                replacements: { customer_reference: codigoReferencia },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if(data.length==0){
            return { status: true, data: [], message: `Error: No Existe Billetera` }
        }
        if(data[0].has_life_validate=='0' || data[0].has_validate_dpi==0){
            return { status: true, data: [], message: `Error: El Perfil De Billetera No Esta Completo` }
        }
        return { status: true, data: data[0], message: `` }
    } catch (err) {
        return { status: false, data: 0, message: `Error: Consultando Billetera` }
    }
}

const getAllCapaniasDisponibles= async () => {
    try {
        const campanias = await Campania.findAll({
        where: {
            id: [93],
            estado: 1
            // XXXXXX CONDICIONES: ESTADO => 1, FECHA-INCIO>=Now(), FECHA-FINAL<=HOY
        },
        include: [
            { model: Bloqueados, attributes: ['numero'] },
            { model: Participantes, attributes: ['numero'] },
            { model: Etapa,
                include: [
                    { model: Presupuesto },
                    { model: Parametro , attributes: { exclude: ['idCampania'] } },
                    { model: PremioCampania, attributes: { exclude: ['idEtapa'] }, include: [ { model: Premio } ] }
                ],
            },
        ],
        });
        return { status: true, data: campanias, message: `` }
    } catch (error) {
        return { status: false, data: [], message: `Error: Consultando Campañas Disponibles` }
    }
}

const participacionesCampania = async (idCampania) => {
    const campanias = await sequelize.query(`SELECT COUNT(*) AS cantidad FROM campania WHERE id=${idCampania};`, { type: Sequelize.QueryTypes.SELECT });
    if (campanias.length==0){
        return 0;
    }
    return campanias[0].cantidad;
    
}

const obtieneCampanasActivas = async (codigoReferencia) => {
    let campanaParticipar = [];
    try {
        const infoBilletera = await revisaBilleteraPorReferencia(codigoReferencia);
        if(infoBilletera.status) {
            const camapanasDisponibles = await getAllCapaniasDisponibles();
            for (let i = 0; i < camapanasDisponibles.data.length; i++) {
                const puedeParticipar = await puedeParticiparEnCampaia(infoBilletera.data, camapanasDisponibles.data[i]);
                if (puedeParticipar.status) {
                    const tienePendientes = await obtienePremiosPendintes(infoBilletera.data, camapanasDisponibles.data[i]);
                    const misParticipaciones = camapanasDisponibles.data[i].etapas[0].tipoParticipacion==0 ? [] : await obtieneAcumulacion(camapanasDisponibles.data[i].id, infoBilletera.data.customer_id);
                    campanaParticipar.push({
                        idCampana: camapanasDisponibles.data[i].id,
                        nombreCampana: camapanasDisponibles.data[i].nombre,
                        descripcion: camapanasDisponibles.data[i].descripcion,
                        tipoParticipacion: camapanasDisponibles.data[i].etapas[0].tipoParticipacion,
                        notificacion: tienePendientes!='' ? 1 : 0,
                        urlNotificacion: tienePendientes,
                        tituloNotificacion: camapanasDisponibles.data[i].tituloNotificacion,
                        descripcionNotificacion: camapanasDisponibles.data[i].descripcionNotificacion,
                        infoAdd: [],
                        mistransacciones: misParticipaciones.length,
                        transacciones: parseInt(camapanasDisponibles.data[i].etapas[0].minimoTransaccion),
                        imagenIcono: await getImgBase64(camapanasDisponibles.data[i].imgPush),
                        imagenIcono: await getImgBase64(camapanasDisponibles.data[i].imgAkisi),
                        botones: await obtieneBotonTransaccion(camapanasDisponibles.data[i].etapas[0].parametros[0].idTransaccion),    
                    });
                }
            }
        }
        return { status: true, data: campanaParticipar, message: `` }
    } catch (error) {
        return { status: false, data: [], message: `Error interno del servidor. [${error}]` }
    }
}

const validaParticipacionTransaccion = async (codigoBilletera, numeroTransaccion) => {
    // Crear la bitacora de recepcion de transaccion
    const newBitacora = await creaBitacora(codigoBilletera, numeroTransaccion, 1);
    if(!newBitacora.status) {
        return { status: false, data: [], message: `${newBitacora.message}` }
    }
    let dataBitacora = [];

    try {
        // Obtener la informacion de la transaccion realizada
        const infoTransaccion = await revisaTransaccion(codigoBilletera, numeroTransaccion);
        if(!infoTransaccion.status) {
            dataBitacora.push(`{campana: 0, info: ${infoTransaccion.message}}`)
            actualizaBitacora(newBitacora.status ? newBitacora.data.id : 0, dataBitacora.toString(), 1);
            return { status: false, data: [], message: `${infoTransaccion.message}` }
        }
        // Obtener la informacion de la Billetera
        const infoBilletera = await revisaBilletera(codigoBilletera);
        if(!infoBilletera.status) {
            dataBitacora.push(`{campana: 0, info: ${infoBilletera.message}}`)
            actualizaBitacora(newBitacora.status ? newBitacora.data.id : 0, dataBitacora.toString(), 1);
            return { status: false, data: [], message: `${infoBilletera.message}` }
        }
        const fechaHoy = new Date(infoBilletera.data.hoy).getTime();
        const camapanasDisponibles = await getAllCapaniasDisponibles();
        for (let i = 0; i < camapanasDisponibles.data.length; i++) {
            const puedeParticipar = await puedeParticiparEnCampaia(infoBilletera.data, camapanasDisponibles.data[i]);
            if (!puedeParticipar.status) {
                dataBitacora.push(`{campana: ${camapanasDisponibles.data[i].id}, estado: false, info: '${puedeParticipar.message}'}`)
                continue;
            }
            const puedeTransaccionar = await puedeTransaccionarEnCampaia(infoBilletera.data, camapanasDisponibles.data[i], infoTransaccion.data);
            if (!puedeParticipar.status) {
                dataBitacora.push(`{campana: ${camapanasDisponibles.data[i].id}, estado: false, info: '${puedeTransaccionar.message}'}`)
                continue;
            }
            // Registrar Participacion y Revisar Si Tiene Premio Por Participacion Disponible
            const respuestaParticipacion = await participacionPorTransaccion(infoBilletera.data, infoTransaccion.data, camapanasDisponibles.data[i].etapas[0]);
            if(!respuestaParticipacion.status){
                dataBitacora.push(`{campana: ${camapanasDisponibles.data[i].id}, estado: false, info: '${respuestaParticipacion.message}'}`);
            } else {
                dataBitacora.push(`{campana: ${camapanasDisponibles.data[i].id}, estado: true, info: '${respuestaParticipacion.message}'}`);
            }
        }
        actualizaBitacora(newBitacora.status ? newBitacora.data.id : 0, dataBitacora.length==0 ? `No tenemos Campañas Activas` : dataBitacora.toString(), 1);
        respData = { dataBitacora, numBitacora: newBitacora.data.id };
        return { status: true, data: respData, message: dataBitacora.length==0 ? `No tenemos Campañas Activas` : `` }
    } catch (error) {
        dataBitacora.push(`{campana: 0, estado: false, info: 'ERROR: '${error}}`)
        actualizaBitacora(newBitacora.status ? newBitacora.data.id : 0, dataBitacora.toString(), 1);
        return { status: false, data: [], message: `Error interno del servidor. [${error}]` }
    }

}

const registrarParticipacion = async (dataInsert) => {
    try {
        const regData = await Participacion.create(dataInsert);
        return { status: true, data: regData, message: `Registro De Participacion Agregada Con Exito` };
    } catch (error) {
        console.log(error);
        return { status: false, data: dataInsert, message: `Error: Intentando Agregar El Registro De Participacion.` };
    }
}

const registrarAcumulacion = async (dataInsert) => { 
    try {
        const regData = await Acumulados.create(dataInsert);
        return { status: true, data: regData, message: `Registro De Acumulacion Agregada Con Exito` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Acumulacion.` };
    }
}

const actualizarAcumulacion = async (dataUpdate) =>{
    try {
        const regData = await Acumulados.update(dataUpdate);
        return { status: true, data: regData, message: `Registro De Acumulacion Actualizada Con Exito` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Intentando Actualizar El Registro De Acumulacion.` };
    }
}

const obtieneAcumulacion = async (idCampania, idParticipante) => {
    return await Acumulados.findAll({
        where: {
            customerId: idCampania,
            idCampania: idParticipante,
            idParticipacion: 0,
        },
        order: [
            ['fecha', 'ASC'],
        ],
    });
}

const participacionPorTransaccion = async (infoBilletera, infoTransaccion, infoCampania) => { 
    if(!infoCampania){
        return { status: false, data: [], message: `Error: [No hay informacion de Campaña]` }
    }
    // INICIA EL PROCEDIMIENTO PARA LAS CAMPAÑAS QUE UTILIZAN ACUMULACION DE PARTICIPACIONES
    let dataAcumulado = [];
    let idAcumulado = 0;
    if(infoCampania.tipoParticipacion!=0){ 
        // Registrar Participacion Acumulativa
        const newData = {
            fecha : new Date(),
            customerId: infoTransaccion.fk_customer_id,
            idtxt : '',
            descripcionTrx: infoTransaccion.transaction_description,
            tipo: infoCampania.tipoParticipacion,
            valor: infoTransaccion.total_amount,
            etapa: infoCampania.id,
            idTransaccion: infoTransaccion.transaction_id,
            idCampania: infoCampania.idCampania,
            codeTransaccion: infoTransaccion.transaction_code,
            idUsuarioParticipante: 0,
            idParticipacion: 0,
        }
        const registraAcumulacion = await registrarAcumulacion(newData);
        if(!registraAcumulacion.status){
            return { status: false, data: [], message: `${registraAcumulacion.message} [REGISTRANDO ACUMULAR TRANSACCION]` }
        }
        idAcumulado = registraAcumulacion.data.id;
        if(infoCampania.tipoParticipacion==1){ // Transacciones Recurrentes
            const revisaAcumulacion = await participarPorAcumularTransaccionRecurrente(infoBilletera, infoTransaccion, infoCampania);
            if(!revisaAcumulacion.status){
                return revisaAcumulacion;
            }
            dataAcumulado = revisaAcumulacion.data;
        } else if(infoCampania.tipoParticipacion==2){ // Acumular Transacciones Directas
            const revisaAcumulacion =  await participarPorAcumularTransaccionDirecta(infoBilletera, infoTransaccion, infoCampania);
            if(!revisaAcumulacion.status){
                return revisaAcumulacion;
            }
            dataAcumulado = revisaAcumulacion.data;
        } else if(infoCampania.tipoParticipacion==3){ // Acumular Transacciones Recurrentes
            const revisaAcumulacion = await participarPorAcumularTransaccionRecurrente(infoBilletera, infoTransaccion, infoCampania);
            if(!revisaAcumulacion.status){
                return revisaAcumulacion;
            }
            dataAcumulado = revisaAcumulacion.data;
        } else if(infoCampania.tipoParticipacion==4){ // Acumular Valor Directo
            const revisaAcumulacion = await participarPorAcumularValorDirecta(infoBilletera, infoTransaccion, infoCampania);
            if(!revisaAcumulacion.status){
                return revisaAcumulacion;
            }
            dataAcumulado = revisaAcumulacion.data;
        } else if(infoCampania.tipoParticipacion==5){ // Combinar Transacciones
            const revisaAcumulacion = await participarPorCombinarTransaccionDirecta(infoBilletera, infoTransaccion, infoCampania);
            if(!revisaAcumulacion.status){
                return revisaAcumulacion;
            }
            dataAcumulado = revisaAcumulacion.data;
        // } else if(infoCampania.tipoParticipacion==99){ // Acumular Valor Recurrente
        //     const revisaAcumulacion = await participarPorAcumularValorRecurrente(infoBilletera, infoTransaccion, infoCampania);
        //     if(!revisaAcumulacion.status){
        //         return revisaAcumulacion;
        //     }
        //     dataAcumulado = revisaAcumulacion.data;
        } else { 
            return { status: false, data: [], message: `El tipo de Campaña [${infoCampania.tipoParticipacion}] no esta configurada en el sistema` }
        }
    }
    // INICIA EL PROCEDIMIENTO PARA REGISTAR LA PARTICIPACION POR PREMIO
    if(infoCampania.tipoParticipacion==0 || dataAcumulado.length>0){ 
        //01 GUARDAR PARTICIPACION
        const todayDate = new Date();
        const iniDate = todayDate.getFullYear().toString().slice(-2).concat(todayDate.getMonth()<9 ? '0' : '').concat((todayDate.getMonth() + 1).toString()).concat(todayDate.getDate()<10 ? '0' : '').concat(todayDate.getDate().toString()).concat(`${todayDate.getHours().toString()}${todayDate.getMinutes().toString()}${todayDate.getSeconds().toString()}`);
        const newData = {
            fecha : new Date(),
            customerId: infoTransaccion.fk_customer_id,
            idtxt : dataAcumulado.length>0  ? dataAcumulado[dataAcumulado.length - 1].idTransaccion : infoTransaccion.transaction_id,
            descripcionTrx: infoTransaccion.transaction_description,
            tipo: infoCampania.tipoParticipacion,
            valor: infoTransaccion.total_amount,
            etapa: infoCampania.id,
            idTransaccion: infoTransaccion.transaction_code,
            idCampania: infoCampania.idCampania,
            idPremio: infoCampania.premiocampania[0].premio.id,
            urlPremio: infoCampania.premiocampania[0].premio.idTransaccion==0 ? iniDate.concat('1aAbBc2CdDeE3fF4gGhH5iI6jJkKlL7mMnNoO8pPqQ9rRsStT0uUvVwWxXyYzZ'.split('').sort(function(){return 0.5-Math.random()}).join('').slice(0, 18)) : '',
            idPresupuesto: infoCampania.presupuestos[0].id,
            jugado: 0,
            idProyecto: 0,
            idUsuarioParticipante: 0,
            tipoTransaccion: '',
        }
        const registraParticipacion = await registrarParticipacion(newData);
        if(!registraParticipacion.status) {
            // AQUI DEBERIA DE HABER UNA ALERTA PORQUE NO SE PUDO REGISTRAR EL PREMIO
            // GUARDAMOS UN REGISTRO PARA DESPUES REVISARLO ???
            return { status: false, data: [], message: `${registraParticipacion.message}` }
        }
        // 02 MARCAR LOS REGISTROS DE ACUMULACION PARA ASIGNARLOS A ESTA PARTICIPACION
        if(dataAcumulado.length>0){
            const actualizaAcumulacion = await actualizarAcumulacion(dataAcumulado.map((item) => { return {id: item.id, idParticipacion: registraParticipacion.data.id}}));
        }
        //03 HACER EL LLAMADO PARA LA OPCION Y ESPERAR LA RESPUESTA DEL PREMIO
        if (infoCampania.premiocampania[0].premio.idTransaccion==0) {
            // XXXXXX PREMIO OFERCRAFT
            // XXXXXX const abcdef = await sendOffercraft();
        } else {
            // XXXXXX PREMIO BILLETERA
            // XXXXXX const abcdef = await sendBilletera();
        }
        return { status: true, data: newData, message: `Participacion Registrada [${registraParticipacion.data.id}]` }
    } else {
        return { status: false, data: [], message: `Acumulacion Registrada [${idAcumulado}]` }
    }
}

const participarPorAcumularTransaccionDirecta = async (infoBilletera, infoTransaccion, infoCampania) => { 
    const registrosAcumulacion = await obtieneAcumulacion(infoTransaccion.fk_customer_id, infoCampania.idCampania);
    if(registrosAcumulacion.length>=infoCampania.minimoTransaccion){
        const data = registrosAcumulacion.filter((item, index) => { return index<infoCampania.minimoTransaccion; });
        return { status: true, data: data, message: `` }
    }
    return { status: false, data: [], message: `Su Participacion fue registrada Con Exito (${registrosAcumulacion.length}/${infoCampania.minimoTransaccion})` }
}

const participarPorAcumularTransaccionRecurrente = async (infoBilletera, infoTransaccion, infoCampania) => { 
    const registrosAcumulacion = await obtieneAcumulacion(infoTransaccion.fk_customer_id, infoCampania.idCampania);
    if(registrosAcumulacion.length>0){
        let data = [];
        let iniFechaTran = registrosAcumulacion[0].fecha;
        registrosAcumulacion.forEach((item) => {
            if(data.length<infoCampania.minimoTransaccion){
                // if(infoCampania.periodo==0){
                    // INTERVALO EN DIAS
                    const date1 = new Date(iniFechaTran);
                    const date2 = new Date(item.fecha);
                    if(Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))!=infoCampania.intervalo){
                        data = [];
                    }
                    data.push(item);
                // } else if (infoCampania.periodo==1) {
                //    // INTERVALO EN SEMANAS (LUN-DOM)
                // } else if (infoCampania.periodo==2) {
                //    // INTERVALO EN MESES (AÑO-MES)
                // }
                iniFechaTran = item.fecha;
            }
        });
        if(data.length>=infoCampania.minimoTransaccion){
            return { status: true, data: data, message: `` }
        }
    }
    return { status: false, data: [], message: `Su Participacion fue registrada Con Exito (${data.length}/${infoCampania.minimoTransaccion})` }
}

const participarPorAcumularValorDirecta = async (infoBilletera, infoTransaccion, infoCampania) => { 
    const registrosAcumulacion = await obtieneAcumulacion(infoTransaccion.fk_customer_id, infoCampania.idCampania);
    if(registrosAcumulacion.reduce((sum, item) => sum + parseFloat(item.valor), 0)>=infoCampania.totalMinimo) {
        let sumTotal = 0;
        const data = registrosAcumulacion.filter((item, index) => { 
            if(sumTotal<infoCampania.totalMinimo){
                sumTotal = sumTotal + parseFloat(item.valor); 
                return true; 
            } else { return false; }
        });
        return { status: true, data: data, message: `` }
    }
    return { status: false, data: [], message: `Su Participacion fue registrada Con Exito (${registrosAcumulacion.reduce((sum, item) => sum + parseFloat(item.valor), 0).toFixed(2)}/${infoCampania.totalMinimo})` }
}

const participarPorAcumularValorRecurrente = async (infoBilletera, infoTransaccion, infoCampania) => { 
    const registrosAcumulacion = await obtieneAcumulacion(infoTransaccion.fk_customer_id, infoCampania.idCampania);
    if(registrosAcumulacion.length>0){
        let data = [];
        let iniFechaTran = registrosAcumulacion[0].fecha;
        registrosAcumulacion.forEach((item) => {
            if(data.reduce((sum, itemx) => sum + parseFloat(itemx.valor), 0)<infoCampania.totalMinimo) {
                // if(infoCampania.periodo==0){
                    // INTERVALO EN DIAS
                    const date1 = new Date(iniFechaTran);
                    const date2 = new Date(item.fecha);
                    if(Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))!=infoCampania.intervalo){
                        data = [];
                    }
                    data.push(item);
                // } else if (infoCampania.periodo==1) {
                //    // INTERVALO EN SEMANAS (LUN-DOM)
                // } else if (infoCampania.periodo==2) {
                //    // INTERVALO EN MESES (AÑO-MES)
                // }
                iniFechaTran = item.fecha;
            }
        });
        if(data.reduce((sum, itemx) => sum + parseFloat(itemx.valor), 0)>=infoCampania.totalMinimo){
            return { status: true, data: data, message: `` }
        }
    }
    return { status: false, data: [], message: `Su Participacion fue registrada Con Exito (${data.reduce((sum, itemx) => sum + parseFloat(itemx.valor), 0)}/${infoCampania.totalMinimo})` }
}

const participarPorCombinarTransaccionDirecta = async (infoBilletera, infoTransaccion, infoCampania) => { 
    const registrosAcumulacion = await obtieneAcumulacion(infoTransaccion.fk_customer_id, infoCampania.idCampania);
    let data = [];
    for(i=0; i<infoCampania.parametros.length; i++){
        const revisaParametroAcumulado = registrosAcumulacion.filter((item) => { return item.codeTransaccion==infoCampania.parametros[i].idTransaccion; });
        if(revisaParametroAcumulado.length>0){
            data.push(revisaParametroAcumulado[0]);
        }
    }
    if(infoCampania.parametros.length==data.length){
        return { status: true, data: data, message: `` }
    }
    return { status: false, data: [], message: `Su Participacion fue registrada Con Exito (${infoCampania.parametros.length}/${data.length})` }
}

const participacionDiariaPorTipoTransaccion = async (infoTransaccion, idCampania) => {
    try {
        const acumuladosDeHoy = await sequelize.query(`SELECT * FROM acumulados WHERE customerId=${infoTransaccion.fk_customer_id} AND idCampania=${idCampania} AND codeTransaccion=${infoTransaccion.transaction_code} AND fecha>=CONCAT(CURDATE(), ' 00:00:00') AND fecha<=CONCAT(CURDATE(), ' 23:59:59');`, { type: Sequelize.QueryTypes.SELECT });
        return { status: true, data: acumuladosDeHoy, message: `` }
    } catch (err) { 
        return { status: false, data: [], message: `Error: Consultando Transacciones Del Dia` }
    }
}

const getPresupuestoParticipacion = async (idCampania, idPresupuesto) => {
    try {
        const acumuladosDeHoy = await sequelize.query(`SELECT COUNT(*) AS total, SUM(CASE WHEN fecha>=CONCAT(CURDATE(), ' 00:00:00') AND fecha<=CONCAT(CURDATE(), ' 23:59:59') THEN 1 ELSE 0 END) AS diario FROM participacions WHERE idCampania=${idCampania} AND idPresupuesto=${idPresupuesto};`, { type: Sequelize.QueryTypes.SELECT });
        return { status: true, data: acumuladosDeHoy, message: `` }
    } catch (err) { 
        return { status: false, data: [], message: `Error: Consultando Presupuestos en Participacion` }
    }
}

const puedeParticiparEnCampaia = async (infoBilletera, infoCampania) => {
    try {
        const fechaHoy = new Date(infoBilletera.hoy).getTime();
        // FECHAS PARA PARTICIPAR
        const fechaInicio = new Date(infoCampania.fechaInicio).getTime();
        const fechaFinal = new Date(infoCampania.fechaFin).getTime();
        if(fechaInicio>fechaHoy || fechaFinal<fechaHoy){
            return { status: false, data: [], message: `La fecha [${infoBilletera.hoy}] no se encuentra dentro del rango configurado [${infoCampania.fechaInicio}]-[${infoCampania.fechaInicio}]`}
        } 
        // PARTICIPACIONES MAXIMAS
        const cantParticipaciones = await participacionesCampania(infoCampania.id);
        if(cantParticipaciones>=infoCampania.maximoParticipaciones){
            return { status: false, data: [], message: `La campaña llego al maximo de participaciones permitido [${cantParticipaciones}/${infoCampania.maximoParticipaciones}]` }
        }
        // NUMEROS PERMITIDOS
        if(infoCampania.restriccionUser==1 && infoCampania.permitidos.filter((item) => { if(item.numero==infoBilletera.telno){ return true; }else{ false; } }).length==0) {
            return { status: false, data: [], message: `El número ${infoBilletera.telno} no se encuentra permitido para participar en la campaña` }
        }
        // NUMEROS BLOQUEADOS
        if(infoCampania.restriccionUser==2 && infoCampania.bloqueados.filter((item) => { if(item.numero==infoBilletera.telno){ return true; }else{ false; } }).length>0) {
            return { status: false, data: [], message: `El número ${infoBilletera.telno} se encuentra bloquedo para participar en la campaña` }
        }
        // EDAD
        if(infoBilletera.edad<infoCampania.edadInicial || infoBilletera.edad>infoCampania.edadFinal) {
            return { status: false, data: [], message: `La edad [${infoBilletera.edad}] no se encuentra dentro del parametro [${infoCampania.edadInicial}]-[${infoCampania.edadFinal}] para participar en la campaña` }
        }
        // GENERO
        if(infoCampania.sexo<2 && (infoCampania.sexo!=infoBilletera.genero)) {
            return { status: false, data: [], message: `El Genero [${infoBilletera.genero}] no es compatible con el parametro [${infoCampania.sexo}] para participar en la campaña` }
        }
        // COMERCIO
        if(infoCampania.tipoUsuario<2 && infoCampania.tipoUsuario!=infoBilletera.has_commerce){
            return { status: false, data: [], message: `El Tipo de Usuario (Comercio/Final) [${infoBilletera.has_commerce}] no es compatible con el parametro [${infoCampania.tipoUsuario}] para participar en la campaña` }
        }
        // TIENE ETAPAS CONFIGURADAS
        if (infoCampania.etapas.length==0){
            return { status: false, data: [], message: `La campaña no tiene configurado etapas para participar` }
        }
        // TIENE PREMIOS CONFIGURADOS
        if (infoCampania.etapas[0].premiocampania.length==0){
            return { status: false, data: [], message: `La campaña no tiene configurado premios para participar` }
        }
        // PRESUPUESTO POR ETAPA => DEPARTAMENTO/MUNICIPIO
        const campanaPresupuesto = infoCampania.etapas[0].presupuestos.filter((item) => { 
            return (parseInt(item.idDepartamento)==0 || parseInt(item.idDepartamento)==infoBilletera.department) && (parseInt(item.idMunicipio)==0 || parseInt(item.idMunicipio)==infoBilletera.municipality)
        });
        if(campanaPresupuesto.length==0){
            return { status: false, data: [], message: `No Fue Posible Encontrar Presupuesto Para La Region [${infoBilletera.department}]-[${infoBilletera.municipality}] para participar en la campaña` }
        }
        const presupuestoEnParticipacion = await getPresupuestoParticipacion(infoCampania.id, campanaPresupuesto[0].id);
        // PRESUPUESTO TOTAL DE LA CAMPAÑA
        if(campanaPresupuesto[0].limiteGanadores>=presupuestoEnParticipacion.total){ 
            return { status: false, data: [], message: `El Presupuesto Para La Region [${infoBilletera.department}]-[${infoBilletera.municipality}] llego al maximo para participar en la campaña` }
        }
        // PRESUPUESTO DIARIOA DE LA CAMPAÑA
        // if(campanaPresupuesto[0].presupestoDiario<presupuestoEnParticipacion.diario) {
        //     return { status: false, data: [], message: `El Presupuesto Para La Region [${infoBilletera.department}]-[${infoBilletera.municipality}] llego al maximo para participar en la campaña` }
        // }
        return { status: true, data: [], message: `` }
    } catch (err) { 
        return { status: false, data: [], message: `Error: Revisando Campaña Para Participar` }
    }
}

const puedeTransaccionarEnCampaia = async (infoBilletera, infoCampania, infoTransaccion) => {
    try {
        // TIPO DE TRANSACCION
        const campanaParametroTipoTransaccion = infoCampania.etapas[0].parametros.filter((item) => { 
            return item.idTransaccion==infoTransaccion.transaction_code;
        });
        if(campanaParametroTipoTransaccion.length==0){
            return { status: false, data: [], message: `La Transaccion [${infoTransaccion.transaction_code}][${infoTransaccion.transaction_description}] No esta configurada para participar en la campaña` }
        }
        // LIMITE DIARIO POR TRANSACCION
        const cantParticipacionesDiarias = await participacionDiariaPorTipoTransaccion(infoTransaccion, infoCampania.id);
        if(!cantParticipacionesDiarias.status){
            return { status: false, data: [], message: `${cantParticipacionesDiarias.message}` }
        }
        if(cantParticipacionesDiarias.data.length>=infoCampania.maximoParticipaciones){
            return { status: false, data: [], message: `El tipo de transaccion [${infoTransaccion.transaction_code}] llego al maximo de participaciones diarias permitidas [${infoCampania.maximoParticipaciones}]` }
        }
        // MONTO DE TRANSACCION
        const campanaParametroMontoTransaccion = infoCampania.etapas[0].parametros.filter((item) => { 
            return (parseFloat(item.idTransaccion)==parseFloat(infoTransaccion.transaction_code)) && (parseFloat(item.ValorMinimo)<=parseFloat(infoTransaccion.total_amount)) && (parseFloat(item.ValorMaximo)>=parseFloat(infoTransaccion.total_amount));
        });
        if(campanaParametroMontoTransaccion.length==0){
            return { status: false, data: [], message: `El Monto De La Transaccion [${infoTransaccion.transaction_code}][${infoTransaccion.transaction_description}][${infoTransaccion.total_amount}] No esta configurada para participar en la campaña` }
        }
        // TIPO DE TRANSACCION ????
        // 
        return { status: true, data: [], message: `` }
    } catch (err) { 
        return { status: false, data: [], message: `Error: Revisando Transaccion Para Participar` }
    }
}

const obtienePremiosPendintes = async (infoBilletera, infoCampania) => {
    try {
        const premiosPendientes = await sequelize.query(`SELECT c.id, DATE_FORMAT(c.fecha, '%d%m%Y%H%i%s') AS fechaParticipacion, c.urlPremio, p.link, p.claveSecreta FROM participacions c INNER JOIN premios p ON p.id = c.idPremio WHERE c.customerId=${infoBilletera.customer_id} AND c.idCampania=${infoCampania.id} AND c.jugado=0 AND p.idTransaccion=0 ORDER BY c.id DESC;`, { type: Sequelize.QueryTypes.SELECT });
        if (premiosPendientes.length==0){
            return '';
        }
        return premiosPendientes[premiosPendientes.length - 1].link.replace("{externalId}", premiosPendientes[premiosPendientes.length - 1].urlPremio.toString()).replace("{code}", premiosPendientes[premiosPendientes.length - 1].fechaParticipacion).replace("{codeh}", md5(premiosPendientes[premiosPendientes.length - 1].fechaParticipacion.concat(premiosPendientes[premiosPendientes.length - 1].claveSecreta)));
    } catch (err) { 
        return '';
    }
}

const obtieneBotonTransaccion = async (idTransaccion) => {
    try {
        if (idTransaccion==0){
            return [];
        }
        return await sequelize.query(`SELECT idBoton FROM transaccions WHERE id=${idTransaccion};`, { type: Sequelize.QueryTypes.SELECT });
    } catch (err) { 
        return [];
    }
}

const creaBitacora = async (customerId, transactionId, tipo=0) => {
    try {
        if(tipo==1) {
            const regData = await BitacoraParticipacion.create({customerId, transactionId, campaniaData: ''});
            return { status: true, data: regData, message: `Registro De Bitacora Agregada Con Exito` };
        } else if(tipo==2) {
            const regData = {};
            return { status: true, data: [], message: `Registro De Bitacora Agregada Con Exito` };
        } else {
            return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Bitacora. [${tipo}]` };
        }
    } catch (error) {
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Bitacora. [${tipo}]` };
    }
}

const actualizaBitacora = async (idBitacora, dataBitacora, tipo=0) => {
    try {
        if(tipo==1) {
            const regData = await BitacoraParticipacion.update({ campaniaData: dataBitacora.toString() }, { where: { id: idBitacora }});
        } else if(tipo==2) {
            const regData = {};
        } else {
            const regData = {};
        }
        return { status: true, data: regData, message: `Registro De Bitacora Actualizada Con Exito` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Intentando Actualizar El Registro De Bitacora.` };
    }
}

const validaCupon = async (idRevision, cupon) => {
    const defData = {
        ImgFail: "data:image/png;base64,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",
        ImgSucess: "data:image/png;base64,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",
        codFail: "11111111",
        codSucess: "",
    }
    // XXXXXX const newBitacora = await creaBitacora(codigoBilletera, numeroTransaccion, 1);
    // XXXXXX let dataBitacora = [];
    try {
        // INFORMACION DEL CLIENTE
        const infoBilletera = await revisaBilletera(idRevision);
        if(!infoBilletera.status) {
            // XXXXXX dataBitacora.push(`{campana: 0, info: ${infoBilletera.message}}`)
            return { status: false, data: { imagen: defData.ImgFail, premio: '', codigo: defData.codFail, premio: `` }, message: `${infoBilletera.message}` };
        }
        // VALIDAR EL CUPON
        const infoCupon = await cuponPromocionValido(cupon);
        if(!infoCupon.status) {
            return { status: false, data: { imagen: infoCupon.data.newImgFail!='' ? infoCupon.data.newImgFail : defData.ImgFail, premio: '', codigo: defData.codFail, premio: `` }, message: `${infoCupon.message}` };
        }
        // OBTENER EL PREMIO
        const infoPremio = await obtienePremioCupon(infoCupon.data);
        if(!infoPremio.status) {            
            return { status: false, data: { imagen: infoCupon.data.newImgFail!='' ? infoCupon.data.newImgFail : defData.ImgFail, premio: '', codigo: defData.codFail, premio: `` }, message: `${infoPremio.message}` };
        }
        const cuponParticipa = await cuponParticipacion(infoCupon.data, infoPremio.data, infoBilletera);
        if(!cuponParticipa.status) {
            return { status: false, data: { imagen: infoCupon.data.newImgFail!='' ? infoCupon.data.newImgFail : defData.ImgFail, premio: '', codigo: defData.codFail, premio: `` }, message: `${cuponParticipa.message}` };
        }
        return { status: true, data: { imagen: infoCupon.data.newImgSucess!='' ? infoCupon.data.newImgSucess : defData.ImgSucess, premio: '', codigo: defData.codSucess, premio: `Felicidades! se ha acreditado un premio, ${infoPremio.data.descripcion}` }, message: `${infoCupon.data.mesajeExito}` };
    } catch (error) {
        console.error("Error en validaCupon_get:", error);
        return { status: false, data: { imagen: defData.ImgFail, premio: '', codigo: defData.codFail, premio: `` }, message: `Error interno del servidor. [${error}]` };
    }
}

const cuponPromocionValido = async (idCupon) => {
    try {
        const regData = await sequelize.query(`SELECT dp.id, dp.esPremio, dp.estado, dp.idPromocion, dp.idPremioPromocion, pr.mesajeExito, pr.mesajeFail, pr.imgSucess, pr.imgFail FROM promocions pr INNER JOIN detallepromocions dp ON dp.idPromocion=pr.id WHERE pr.fechaInicio<=CURDATE() AND pr.fechaFin>=CURDATE() AND pr.estado=1 AND dp.cupon='${idCupon}';`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0) {
            return { status: false, data: [], message: `Error: El cupon no es valido.` };
        }
        return { status: true, data: regData[0], message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: No fue posible validar el cupon, por favor intentelo mas tarde.` };
    }
}

const obtienePremioCupon = async (infoCupon) => {
    try {
        const regData = await sequelize.query(`SELECT pp.cantidad, pp.valor, pp.idPremio, p.idTransaccion, p.link, p.claveSecreta, p.descripcion FROM premiopromocions pp INNER JOIN premios p ON p.id=pp.idPremio WHERE pp.estado=1 AND p.estado=1 AND pp.idPromocion=${infoCupon.idPromocion} AND pp.id=${infoCupon.idPremioPromocion};`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0) {
            return { status: false, data: [], message: infoCupon.mesajeFail };
        }
        regData[0].newImgSucess = await getImgBase64(regData[0].imgSucess);
        regData[0].newImgFail = await getImgBase64(regData[0].imgFail); 
        return { status: true, data: regData[0], message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: No fue posible obtener el premio asignado, por favor intentelo mas tarde` };
    }
}

const cuponParticipacion = async (infoCupon, infoPremio, infoBilletera) => {
    try {
        if(infoPremio.idTransaccion==0) {
            // XXXXXX PREMIO OFERCRAFT
            // XXXXXX const abcdef = await sendOffercraft();
        } else {
            // XXXXXX PREMIO BILLETERA
            // XXXXXX const abcdef = await sendBilletera();
        }
        const marcaCupon = await actualizaCupon(infoCupon.id, infoBilletera.customer_id);
        return { status: true, message: infoCupon.message };
    } catch (error) {
        return { status: false, message: `Error: No fue posible registrar el cupon, por favor intentelo mas tarde.` };
    }
}

const actualizaCupon = async (cuponId, customerId) => {
    try {
        const updData = await sequelize.query(`UPDATE detallepromocions SET estado=2 WHERE id=${cuponId};`, { type: Sequelize.QueryTypes.SELECT });
        console.log(updData);
        // XXXXXX , fecha=NOW(), customerId=${customerId}
        return { status: true, data: [], message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Actualizando el cupon.` };
    }
}

const actualizaJuego = async (urlPremio, valor=0) => {
    try {
        // const updData = await Participacion.update({ jugado: 1, valor: valor }, { where: { urlPremio: urlPremio }});
        const updData = await sequelize.query(`UPDATE participacions SET jugado=1, valor=${valor} WHERE urlPremio='${urlPremio}';`);
        // XXXXXX fechaJugado=NOW()
        if (updData[0].affectedRows==0){
            return { status: false, data: [], message: `No fue posible actulizar el registro` };
        }
        return { status: true, data: [], message: `` };
    } catch (error) {
        console.log(error);
        return { status: false, data: [], message: `Error: Actualizando el cupon.` };
    }
}

const registraCodigoReferidos = async (dataInsert) => {
    try {
        const regData = await codigoReferido.create(dataInsert);
        return { status: true, data: regData, message: `Registro De Codigo Referido Agregado Con Exito` };
    } catch (error) {
        console.log(error);
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro Del Codigo Referido.` };
    }
}

const registraReferidos = async (dataInsert) => {
    try {
        const regData = await referidosIngresos.create(dataInsert);
        return { status: true, data: regData, message: `Registro De Referidos Agregado Con Exito` };
    } catch (error) {
        console.log(error);
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Referidos.` };
    }
}

const referidosOpciones = async (customerReference) => {
    try {
        const regData = await sequelize.query(`SELECT id, opcion, urlApi, iconoMostrar, IFNULL((SELECT CASE WHEN DATEDIFF (now(),created_date)>3 THEN 1 WHEN a.idRefIngresos>0 THEN 1 ELSE 0 END tieneCodigo FROM referidosingresos a INNER JOIN pronet.tbl_customer b ON a.usuario=b.customer_id AND b.customer_reference='${customerReference}'), 0) AS tieneCodigo FROM configreferidos WHERE estado=1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0) {
            return { status: false, data: [], message: `Error: No hay opciones para referidos.` };
        }
        return { status: true, data: regData, message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Buscando opciones para referidos.` };
    }
}

const referidosConfiguracion = async (confId, customerReference) => {
    try {
        const regData = await sequelize.query(`SELECT textoUrl, descripcion, (SELECT customer_id FROM pronet.tbl_customer WHERE customer_reference = '${customerReference}' LIMIT 1) AS customerId FROM configreferidos WHERE id=${confId};`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0) {
            return { status: false, data: [], message: `Error: No hay configuracion para referidos.` };
        }
        return { status: true, data: regData[0], message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Buscando configuracion para referidos.` };
    }
}

const referidosBuscaCodigo = async (customerId) => {
    try {
        let codigoRetornar = '';
        const regData = await sequelize.query(`SELECT codigo FROM codigosreferidos WHERE customerId=${customerId} order by fecha DESC LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0) {
            const todayDate = new Date();
            const permittedChars = '0123456789ABCDEFGHJKLMNPQRTUVWXYZ'.split('');
            do {
                for (let i = permittedChars.length - 1; i > 0; i--) { 
                    const j = Math.floor(Math.random() * (i + 1)); 
                    [permittedChars[i], permittedChars[j]] = [permittedChars[j], permittedChars[i]]; 
                }
                codigoRetornar =  todayDate.getFullYear().toString().slice(-2).concat(todayDate.getMonth()<9 ? '0' : '').concat((todayDate.getMonth() + 1).toString()).concat(permittedChars.join('').substring(0, 6));
                const regData = await sequelize.query(`SELECT * FROM codigosreferidos WHERE codigo='${codigoRetornar}';`, { type: Sequelize.QueryTypes.SELECT });
                if (regData.length>0){ codigoRetornar = ''; }
            } while (codigoRetornar=='');
            const insData = await registraCodigoReferidos({ codigo: codigoRetornar, customerId: customerId, fecha: new Date(), estado: 1 });
            if (!insData.status){
                return { status: false, data: [], message: insData.message };
            }
        } else {
            codigoRetornar = regData[0].codigo
        }
        return { status: true, data: codigoRetornar, message: `` };
    } catch (error) {
        console.log(error);
        return { status: false, data: '', message: `Error: Buscando codigo para referidos.` };
    }
}

const obtieneCodigoReferidos = async (idConfi, usuario, idtipo) => {
    try {
        const buscaConfi = await referidosConfiguracion(idConfi, usuario);
        if (!buscaConfi.status) {
            return { status: false, data: [], message: `${buscaCodigo.message}` };
        }

        const buscaCodigo = await referidosBuscaCodigo(buscaConfi.data.customerId);
        if (!buscaCodigo.status) {
            return { status: false, data: [], message: `${buscaCodigo.message}` };
        }
        const textoPersonalizado = buscaConfi.data.descripcion.replace("{codigo}", buscaCodigo.data);
        const urlEnviar = textoPersonalizado.replace("{textoEnviar}", buscaConfi.textoUrl);
        // urlEnviar = str_replace("{textoEnviar}", str_replace(' ', '%20', $textoPersonalizado), $urlEnviar);
        const retmessage = {
            tipo: idtipo,
            url: urlEnviar,
            texto: textoPersonalizado,
            codigo: buscaCodigo.data,
            mostrarMensajeRetorno: 0,
            accionPosterior: 1,
            tituloMensaje: '',
            cuerpoMensaje: ''
        };
        return { status: true, data: retmessage, message: retmessage };
    } catch (error) {
        return { status: false, data: [], message: `Error interno del servidor. [${error}]` };
    }
}

const referidosValidaCodigo = async (customerReference, codigo) => {
    try {
        // REVISAR SI EL USURIO REFERIDO ES VALIDO
        const regDataReferido = await revisaBilletera(customerReference);
        if (!regDataReferido.status) { 
            return { status: false, data: '', message: `${regDataReferido.message}` };
        }
        if (regDataReferido.data.diasdecracion > 4) {
            return { status: false, data: '', message: `Lo sentimos, No cumples con las características de un usuario nuevo.` };
        }
        // REVISAR EL CODIGO SI ES VALIDO Y NO ES CODIGO PROPIO
        const regData = await sequelize.query(`SELECT cr.*, tc.customer_reference FROM codigosreferidos cr INNER JOIN pronet.tbl_customer tc ON tc.customer_id = cr.customerId WHERE cr.codigo = '${codigo}' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0){
            return { status: false, data: '', message: `Lo sentimos, el código ingresado no es invalido` };
        }
        if (regData[0].customerId==regDataReferido.data.customer_id){
            return { status: false, data: '', message: `Lo sentimos, el código ingresado ha caducado o es invalido` };
        }
        // REVISAR SI EL USUARIO REFERIDOR ES VALIDO
        const regDataReferidor = await revisaBilletera(regData[0].customer_reference);
        if (!regDataReferidor.status) { 
            return { status: false, data: '', message: `${regDataReferidor.message}` };
        }
        //INSERTAR EL REGISTRO DEL REFERIDO
        const insData = await registraReferidos({ id: regData.data.id, usuario: regDataReferido.data.customer_id, fecha: new Date() });
        if (!insData.status){
            return { status: false, data: '', message: `${insData.message}` };
        }

        const transaccionReferido = await validaParticipacionTransaccion(regDataReferido.data.customer_id, insData.id);
        const transaccionReferidor = await validaParticipacionTransaccion(regDataReferidor.data.customer_id, insData.id);

        // XXXXXX UPDATE registrarReferidos
        // XXXXXX CREAR EL CAMPO PARA INSERTAR EL RESULTADO
        // XXXXXX { referido: transaccionReferido, referidor: transaccionReferidor }
        
        return { status: true, data: [], message: `Alguien que te quiere mucho te ha referido! Haz cualquier transacción usando tu billetera akisí y recibe tu bono de bienvenida!!` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Validando codigo de referidos.` };
    }
}

const validaParticipacionTerceros = async (codigoTercero, codigoUnico, idTrx, monto, numBilletera, cupo, fecha, adicionales) => {
    try{
        const krezcoInfo = await krezcoInformacion(cupo);
        if (!krezcoInfo.status && numBilletera==''){
            return { status: false, data: [], message: `${krezcoInfo.message}` };
        }
        const telno = numBilletera!='' ? numBilletera : krezcoInfo.data.telno;
        if (telno=='0'){
            return { status: false, data: [], message: `El número de la billetera no existe` };
        }
        if (await validarKrezcoBilletera(telno)==0){
            return { status: false, data: [], message: `El número de la billetera no es valido` };
        }
        const regDataTerceros = await buscaDataTerceros(codigoTercero);
        if (!regDataTerceros.status){
            return { status: false, data: [], message: `No fue posible encontrar el token` };
        }
        const regBilletera = await buscaBilleteraConTel(telno);
        if (!regBilletera.status){
            return { status: false, data: [], message: `${regBilletera.message}` };
        }
        const valida = await validaTeceros(codigoTercero, telno, codigoUnico, fecha, idTrx, monto, `(${codigoTercero})${adicionales.descTransaccion}`, regBilletera.data.customer_id);
        if (!valida.status){
            return { status: false, data: [], message: `${valida.message}` };
        }
        const registra = await registraTransaccionTerceros({ fechaTransaccion: fecha, codigoUnico: codigoUnico, idTrx: idTrx, totalAmount: monto, customerId: regBilletera.data.customer_id, cupo: cupo, descTransaccion: `(${codigoTercero})${adicionales.descTransaccion}` });
        if (!registra.status){
            return { status: false, data: [], message: `${registra.message}` };
        }
        const transaccionTercero = await validaParticipacionTransaccion(regBilletera.data.customer_id, registra.id);
        return transaccionTercero;
    } catch (error) {
        return { status: false, data: [], message: `Error: Validando Participacion Terceros.` };
    }
}

const krezcoInformacion = async (cupo) => {
    try {
        const regData = await sequelize.query(`SELECT telno, a.dpi, customer_id, cupo,customer_reference FROM pronet.tbl_customer_supply_genesis a INNER JOIN pronet.tbl_customer b ON a.fk_customer_id = b.customer_id WHERE cast(cupo as decimal) = cast(${codigo} as decimal) LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0){
            return { status: false, data: {}, message: 'Error: No fue posible encontrar la información del cliente' };
        }
        return { status: true, data: regData[0], message: '' };
    } catch (error) {
        return { status: false, data: {}, message: 'Error: Obteniendo información del cliente' };
    }
}

const validarKrezcoBilletera = async (telno) => {
    try {
        const regData = await sequelize.query(`SELECT COUNT(*) result FROM pronet.tbl_customer a left JOIN pronet.tbl_customer_supply_genesis b on b.fk_customer_id = a.customer_id left JOIN pronet.tbl_customer_market_genesis c on c.FK_CUSTOMER_ID = a.customer_id WHERE a.telno = '${telno}';`, { type: Sequelize.QueryTypes.SELECT });
        if (regData.length==0){
            return 0;
        }
        return regData[0].result;
    } catch (error) {
        return 0;
    }
}

const buscaDataTerceros = async (codigoTercero) => {
    try{
        const regDataTerceros = await sequelize.query(`SELECT id FROM terceros WHERE token='${codigoTercero}' AND estado=1 LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regDataTerceros.length==0){
            return { status: false, data: [], message: `No fue posible encontrar el token` };
        }
        return { status: true, data: regDataTerceros, message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: buscando registro de terceros` };
    }
}

const validaTeceros = async (codigoTercero, telno, codigoUnico, fecha, idTrx, monto, descripcion, customerId) => {
    try{
        const regDataToken = await sequelize.query(`SELECT COUNT(*) siHay FROM terceros WHERE token='${codigoTercero}' AND estado=1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regDataToken[0].siHay==0){
            return { status: false, message: `Token no existe` };
        }
        const regDataCodigo = await sequelize.query(`SELECT COUNT(*) siHay FROM transaccionesterceros WHERE codigoUnico='${codigoUnico}';`, { type: Sequelize.QueryTypes.SELECT });
        if (regDataCodigo[0].siHay>0){
            return { status: false, message: `Error de codigo` };
        }
        const regDataDuplicado = await sequelize.query(`SELECT COUNT(*) siHay FROM transaccionesterceros WHERE fechaTransaccion='${fecha}' AND idTrx=${idTrx} AND totalAmount=${monto} AND descTransaccion='${descripcion}' AND customerId=${customerId} AND codigoUnico='${codigoUnico}';`, { type: Sequelize.QueryTypes.SELECT });
        if (regDataDuplicado[0].siHay>0){
            return { status: false, message: `Transacción duplicada` }
        }
        return { status: true, message: `` };
    } catch (error) {
        return { status: false, data: [], message: `Error: Validando registro de terceros` };
    }
}

const registraTransaccionTerceros = async (dataInsert) => {
    try {
        console.log(dataInsert);
        const regData = await TransaccionesTerceros.create(dataInsert);
        return { status: true, data: regData, message: `Registro De Terceros Agregado Con Exito` };
    } catch (error) {
        console.log(error);
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Terceros.` };
    }
}

const buscaBilleteraConTel = async (telno) => {
    try{
        const regDataUsuario = await pronet.query(`SELECT customer_id, customer_reference FROM pronet.tbl_customer WHERE telno='${telno}' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
        if (regDataUsuario.length==0){
            return { status: false, data: [], message: `Usuario no existe` };
        }
        return { status: true, data: regDataUsuario[0], message: `` };
    } catch (error) {
        console.log(error);
        return { status: false, data: [], message: `Error: Intentando Agregar El Registro De Terceros.` };
    }
}

// const participarPorTransaccionDirecta = async (infoBilletera, infoTransaccion, infoCampania) => { 
//     const registrosPendientes = await obtienePremiosPendintes();
//     if(registrosPendientes.length>=infoCampania.xxxx){
//         return { status: true, data: [], message: `MENSAJE DE FELICITACION POR GANAR.....` }
//     }
//     return { status: true, data: [], message: `NO TIENE PREMIOS PENDIENTES....` }
// }

// const participarPorTransaccionRecurrente = async (infoBilletera, infoTransaccion, infoCampania) => { 
//     return { status: false, data: [], message: `TRANSACCION RECURRENTE NO DISPONIBLE` }
// }

module.exports = {
    actualizaJuego,
    referidosOpciones,
    referidosValidaCodigo,
    validaParticipacionTransaccion,
    obtieneCampanasActivas,
    validaCupon,
    obtieneCodigoReferidos,
    validaParticipacionTerceros,
}