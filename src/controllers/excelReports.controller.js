const { QueryTypes } = require('sequelize');
const XLSX = require("xlsx");
const { reporteClientesParticipando } = require('./reports.controller.js')

const reporteClientesParticipandoExcel = async (req, res) => {

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
    // ws['!cols'] = [{ width: 30 }, { width: 20 }, { width: 20 }]
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
    XLSX.writeFile(wb, "reporte-notificaciones-offercraft.xlsx");

}


const reporteClientesContraCampanasExcel = async (req, res) => {

    const datas = [
        {
            "telefono": "50230349689",
            "nombre": "Bryan Cristopher  García  Castillo ",
            "campana": "REFIRIENDO",
            "tipo": "1"
        },
        {
            "telefono": "50230349689",
            "nombre": "Bryan Cristopher  García  Castillo ",
            "campana": "Refiere y Gana",
            "tipo": "1"
        }
    ]

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
    var contador = 1;
    var longitud1 = 0;
    var longitud2 = 0;
    var longitud3 = 0;
    var longitud4 = 0;

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
    // let row2 = [1, 2, 3];
    // let row3 = [
    // 	{ v: 'Courier 24', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
    // 	{ v: 'bold', t: 's', s: { font: { bold: true, color: { rgb: 'FFFF0000' } } } },
    // 	{ v: 'filled', t: 's', s: { fill: { fgColor: { rgb: 'FFE9E9E9' } } } },
    // 	{ v: 'line break\n"test"', t: 's', s: { alignment: { wrapText:true } } },
    // ]
    const ws = XLSX.utils.aoa_to_sheet(infoFinal);
    // ws['!cols'] = [{ width: 30 }, { width: 20 }, { width: 20 }]
    ws['!cols'] = [
        { width: 15 },
        { width: longitud1 + 2 },
        { width: longitud2 + 2 },
        { width: longitud3 + 2 },
        { width: longitud4 + 2 }
    ]
    console.log(ws['!cols'])
    ws['!merges'] = [
        { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }
    ]
    const ws2 = XLSX.utils.aoa_to_sheet([row4]);
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "reporte-notificaciones-offercraft.xlsx");
    
    const file = await XLSX.write(wb, { bookType: "xlsx", bookSST: false, type: "buffer" });
    res.send(file)

}


module.exports = { reporteClientesParticipandoExcel, reporteClientesContraCampanasExcel }