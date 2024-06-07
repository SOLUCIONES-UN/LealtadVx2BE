const { QueryTypes } = require('sequelize');
const { getTestTransaccion, campanasActualesActivas, campanasActualesActivasTercero, campanaTransaccionesValidas, campanaPremiosRetornarRandom, campanaPremiosRetornarTodas, campanaPremiosInfoCliente } = require('./apiPremio.controller.js')

const fechaminimavalida = async () =>
    await sequelize.query(`SELECT MIN(fechaInicio) AS fechaApartir
        FROM genesis.enc_campana
            WHERE fechaFinal >= CAST(NOW() AS DATE) AS fechaInicio`, { raw: false, type: QueryTypes.SELECT })[0]['fechaApartir'];

const fechamaximavalida = async () =>
    await sequelize.query(`SELECT MIN(fechaFinal) AS fechaFinal
        FROM genesis.enc_campana
            WHERE fechaFinal >= CAST(NOW() AS DATE) AS fechaInicio`, { raw: false, type: QueryTypes.SELECT })[0]['fechaFinal'];

const usuarioParticipantes = async () =>
    await sequelize.query(`SELECT
            pc.idUsuarioParticipante, tc.telno,
            CONCAT_WS(' ', tui.fname, tui.mname, tui.lname, tui.slname) AS nombre
                FROM genesis.participante_campana_adicional pc
                JOIN pronet.tbl_customer tc ON tc.customer_id = pc.idUsuarioParticipante
                JOIN pronet.tblUserInformation tui ON tui.userid = tc.fk_userid
                    WHERE yaAplico = 0 AND fechaParticipacion
                        BETWEEN '${fechamaximavalida()} 00:00:00'
                        AND '${fechamaximavalida()} 23:59:59'
                    GROUP BY pc.idUsuarioParticipante, tc.telno, tui.fname, tui.mname, tui.lname, tui.slname;
        `, { raw: false, type: QueryTypes.SELECT });

const reporteClientesParticipando = async (req, res) => {

    const infoParticipantes = usuarioParticipantes();
    const campanasActivasEnc = campanasActualesActivas();

    infoParticipantes.forEach((value, index) => {
        const idRevision = value.idUsuarioParticipante;

        const telretornar = value.telno;
        const ultimaFecha = '';
        const nombreretornar = value.nombre;
        const infCliente = campanaPremiosInfoCliente("pronet", "tbl_customer", "customer_id", idRevision);
        const informacionUsuario = informacionGeneralUsuario(idRevision);
        const depto = infCliente[0].department;
        const muni = infCliente[0].municipality;
        const numeroValidar = infCliente[0].telno;
        const fechaCreacion = informacionUsuario[0].fechaCreacion;
        const edad = informacionUsuario[0].edad;
        const genero = informacionUsuario[0].genero;
        const retorno = [];
        const campanasActivasEnc = campanasActualesActivas();
    });

    const ws2 = XLSX.utils.aoa_to_sheet([row4]);
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');
    XLSX.writeFile(wb, "reporte-notificaciones-offercraft.xlsx");

}

module.exports = { fechaminimavalida, fechamaximavalida, usuarioParticipantes, reporteClientesParticipando }