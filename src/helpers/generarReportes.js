const { QueryTypes } = require('sequelize');
const XLSX = require('xlsx');
const { reporteClientesParticipando } = require('../controllers/reports.controller.js')
const { Campania } = require('../models/campanias');
const { Configuraciones } = require('../models/configuraciones');
const { ConfigReport } = require('../models/configReport');
const { getUsuariosNotificacionesOfferCraftSel } = require('../helpers/OferCraftReport.js')
const { getParticipaciones } = require('../helpers/referidos.js')
const { getParticipacionesFechasGeneral } = require('../helpers/GeneralReport.js')
const { postDatosCupon } = require('../helpers/promocionReport.js')
const { reporteClientesContraCampanas } = require('../helpers/CampaniasAcumuladasreport.js')




const reporteClientesContraCampanasAcumulativas = async() => {



    console.log('Entrando en generarReportePromociones');
    const datas = await reporteClientesContraCampanas();

    console.log('esto biene aqui', datas)

    const wb = XLSX.utils.book_new();

    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REPORTE DE CAMPAÑAS ACUMULATIVAS', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];

    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'Reporte de clientes en una campaña', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];

    let row3 = [''];

    let row4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'TELÉFONO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'CLIENTE', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    ];

    let infoFinal = [row1, row2, row3, row4];
    let contador = 1;

    datas.forEach(data => {
        let rowInfo = [
            '',
            { v: contador, t: 's' },
            { v: data.telefono, t: 's' },
            { v: data.nombre, t: 's' },
            { v: data.campania, t: 's' },
        ];

        infoFinal.push(rowInfo);
        contador += 1;
    });

    const ws = XLSX.utils.aoa_to_sheet(infoFinal);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
    ];

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } });

    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');

    const file = XLSX.write(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });

    return file;
}




const generarReportereGeneralReferidos = async(fecha1, fecha2) => {

    const datas = await getParticipacionesFechasGeneral(fecha1, fecha2);
    console.log('esto biene en referidos', datas)

    const wb = XLSX.utils.book_new();


    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REPORTE GENERAL DE ', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];
    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REFERIDOS', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];
    let row3 = [''];
    let row4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'CÓDIGO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'REFERIDOR', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'NUMERO TEL.REFERIDOR', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'NUMERO TEL.REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'FECHA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    ];
    let infoFinal = [row1, row2, row3, row4];
    var contador = 1;
    var longitud1 = 0;
    var longitud2 = 0;
    var longitud3 = 0;
    var longitud4 = 0;

    datas.forEach((dataArray) => {
        dataArray.forEach(data => {
            let rowInfo = [
                '',
                { v: contador, t: 's' },
                { v: data["codigo"], t: 's' },
                { v: data["nombreReferidor"], t: 's' },
                { v: data["userno"], t: 's' },
                { v: data["nombreReferido"], t: 's' },
                { v: data["noReferido"], t: 's' },
                { v: data["fecha"], t: 's' },
            ];
            infoFinal.push(rowInfo);
            contador += 1;
        });
    });



    const ws = XLSX.utils.aoa_to_sheet(infoFinal);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 }, 
        { wch: 20 },
        { wch: 20 },
    ];

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 6 } });

    const ws2 = XLSX.utils.aoa_to_sheet([row4]);
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');

    const file = await XLSX.write(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });

    return file;
}



const generarReporteClientesParticipando = async() => {




    const datas = reporteClientesParticipando();

    const wb = XLSX.utils.book_new();

    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REPORTE DE NOTIFICACIONES', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];

    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'OFFERCRAFT', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];

    let row3 = [''];

    let row4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'Usuario', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'Fecha', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        { v: 'Token', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    ];

    let infoFinal = [row1, row2, row3, row4];
    let contador = 1;
    let longitud1 = 0;
    let longitud2 = 0;
    let longitud3 = 0;
    let longitud4 = 0;

    datas.forEach(data => {

        if (longitud1 < String(contador).length)
            longitud1 = String(contador).length;

        if (longitud2 < String(data.nombre).length)
            longitud2 = String(data.nombre).length;

        if (longitud3 < String(data.fecha_uso).length)
            longitud3 = String(data.fecha_uso).length;

        if (longitud4 < String(data.url).length)
            longitud4 = String(data.url).length;

        let rowInfo = [
            '',
            { v: contador, t: 's' },
            { v: data.nombre, t: 's' },
            { v: data.fecha_uso, t: 's' },
            { v: data.url, t: 's' },
        ];

        infoFinal.push(rowInfo);
        contador += 1;

    });

    const ws = XLSX.utils.aoa_to_sheet(infoFinal);
    ws['!cols'] = [
        { width: 15 },
        { width: longitud1 + 2 },
        { width: longitud2 + 2 },
        { width: longitud3 + 2 },
        { width: longitud4 + 2 }
    ];

    console.log(ws['!cols'])
    ws['!merges'] = [
        { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }
    ];

    const ws2 = XLSX.utils.aoa_to_sheet([row4]);
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');
    const file = await XLSX.writeFile(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });

    return file;

}


const generarReportereReferidos = async(campanas, fecha1, fecha2) => {
    const datas = await getParticipaciones(campanas, fecha1, fecha2);
    console.log('esto viene en referidos', datas);

    const wb = XLSX.utils.book_new();
    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REPORTE  DE ', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];
    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        { v: 'REFERIDOS', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
    ];
    let row3 = [''];
    let row4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'MEDIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'CODIGO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'TELEFONO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'NOMBRE USUARIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'FECHA Y HORA ', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'TRANSACCION', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'MONTO PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'TELEFONO REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'NOMBRE REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    ];
    let infoFinal = [row1, row2, row3, row4];
    var contador = 1;

    datas.forEach(data => {
        let codigo = "";
        let noreferido = "";
        let nombreReferido = "";

        if (data.customerInfo && data.customerInfo.length > 0) {
            const customerInfo = data.customerInfo[0];
            codigo = customerInfo.codigo || "";
            noreferido = customerInfo.noreferido || "";
            nombreReferido = customerInfo.nombreReferido || "";
        }

        let rowInfo = [
            '',
            { v: contador, t: 's' },
            { v: ["NO APLICA"], t: 's' },
            { v: data["nombre_campania"], t: 's' },
            { v: codigo, t: 's' },
            { v: data["telefono_usuario"], t: 's' },
            { v: data["nombre_usuario"], t: 's' },
            { v: data["fecha"], t: 's' },
            { v: data["idTransaccion"], t: 's' },
            { v: data["valor"], t: 's' },
            { v: noreferido, t: 's' },
            { v: nombreReferido, t: 's' },
        ];
        infoFinal.push(rowInfo);
        contador += 1;
    });

    const ws = XLSX.utils.aoa_to_sheet(infoFinal);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
    ];

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 6 } });

    const ws2 = XLSX.utils.aoa_to_sheet([row4]);
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');

    const file = await XLSX.write(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });

    return file;
}





const generarReporteOferCraft = async(idCampanas, fecha1, fecha2) => {
    const datas = await getUsuariosNotificacionesOfferCraftSel(idCampanas, fecha1, fecha2);

    console.log('Esto trae: ', datas);

    const wb = XLSX.utils.book_new();

    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 18 } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: ' REPORTE DE NOTIFICACIONES  OFFERCRAFT', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    ];

    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
        { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
    ];

    let row3 = [''];

    let row4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Fecha Acreditacion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Telefono', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Nombre', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Campaña', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Premio', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Monto Premio', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Codigo', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Monto Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Fecha Participacion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    ];

    let infoFinal = [row1, row2, row3, row4];
    let contador = 1;

    datas.forEach(data => {
        data.participaciones.forEach(participacion => {
            let rowInfo = [
                '',
                { v: contador, t: 's' },
                { v: participacion.fecha, t: 's' },
                { v: participacion.customerInfo.telno, t: 's' },
                { v: participacion.customerInfo.fname + ' ' + participacion.customerInfo.lname, t: 's' },
                { v: participacion.campanium.nombre, t: 's' },
                { v: participacion.premioDescripcion, t: 's' },
                { v: participacion.valor, t: 'n' },
                { v: participacion.descripcionTrx, t: 's' },
                { v: participacion.idTransaccion, t: 's' },
                { v: participacion.urlPremio, t: 's' },
                { v: participacion.fecha, t: 's' },
            ];

            infoFinal.push(rowInfo);
            contador += 1;
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(infoFinal);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 }, 
        { wch: 20 },
        { wch: 20 },
        { wch: 12 },
        { wch: 20 },
        { wch: 12 },
    ];

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 6 } });

    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');

    const file = XLSX.write(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });

    return file;
};



const generarReportePromociones = async (idpromocions, fechaInicio, fechaFinal) => {
    const datas = await postDatosCupon(idpromocions, fechaInicio, fechaFinal);

    const wb = XLSX.utils.book_new();

    let row1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 18 } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: 'REPORTE DE PROMOCIONES', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    ];

    let row2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
        { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
    ];

    let row3 = [''];

    const headers = [
        'NOMBRE',
        'TELEFONO',
        'CAMPAÑA',
        'PREMIO',
        'MONTO PREMIO',
        'TRANSACCIÓN',
        'CÓDIGO',
        'MONTO TRANSACCIONES',
        'FECHA ACREDITACIÓN',
        'FECHA PARTICIPACIÓN'
    ];

    const ws = XLSX.utils.aoa_to_sheet([[],[],[],headers]);

    XLSX.utils.sheet_add_aoa(ws, [row1], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [row2], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [row3], { origin: 'A3' });

    datas.forEach(data => {
        const nombre = data.detallepromocion?.promocion?.nombre || '';
        let telefono = data.numeroTelefono || '';
        if (telefono.length === 8) {
            telefono = '(502) ' + telefono;
        }
        const campania = data.detallepromocion?.promocion?.premiopromocions?.[0].premio?.premiocampania?.[0].etapa?.campanium?.nombre || '';
        const premio = data.detallepromocion?.promocion?.premiopromocions?.[0].premio.descripcion || '';
        const monto = data.detallepromocion?.promocion?.premiopromocions?.[0].premio?.premiocampania?.[0].valor || '';
        const transaccion = data.detallepromocion?.promocion?.premiopromocions?.[0].premio?.idTransaccion || '';
        const codigo = data.detallepromocion?.cupon || '';
        const montotransaccion = data.detallepromocion?.promocion?.premiopromocions?.[0].valor || '';
        const fechacreditacion = data.detallepromocion?.promocion?.fechaInicio || '';
        const fechaParticipacion = data.fecha || '';

        const row = [
            nombre,
            telefono,
            campania,
            premio,
            monto,
            transaccion,
            codigo,
            montotransaccion,
            fechacreditacion,
            fechaParticipacion
        ];
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios Notificados');

    const file = await XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'buffer' });

    return file;
};


module.exports = {
    generarReportereReferidos,
    generarReportereGeneralReferidos,
    generarReporteClientesParticipando,
    generarReporteOferCraft,
    generarReportePromociones,
    reporteClientesContraCampanasAcumulativas
};