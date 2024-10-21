const { QueryTypes } = require('sequelize');

const check_auth_client = async () => {

    const client_service = req.headers['Client-Service'];
    const auth_key = req.headers['Auth-Key'];

    return true

}

const auth = async (req, res) => {

    const users_id = req.headers['User-ID'];
    const token = req.headers['Authorization'];

    return { 'status': 200, 'message': 'Authorized.' }

}

const getTestTransaccion = async (base, tabla, campo, campoid, idTransaccion) =>
    await sequelize.query(`SELECT * FROM :base.:tabla WHERE :campoid = :idTransaccion;`, { raw: false, type: QueryTypes.SELECT, replacements: { base, tabla, campo, campoid, idTransaccion } });

const campanasActualesActivas = async (idUsuario = 0, soloMostrar = 0) => {

    if (idUsuario == 0) {

        await sequelize.query(`SELECT
                    fechaRegistro, edadInicial, edadFinal,
                    tipoUsuario, sexo, usuariosInternos, UsuariosNuevos,
                    UsuariosAntiguos, idCampana, nombreCampana, filtradoNumero,
                    tipoPremio, limiteParticipaciones, tipoParticipacion, minimoTransacciones,
                    minimoAcumular, IFNULL(tituloNotificacion, 'Felicidades!!!') tituloNotificacion,
                    IFNULL(descripcionNotificacion, REPLACE('Usted esta participando en nuestra nueva promoción {nombreCampana}', '{nombreCampana}',
                    REPLACE(REPLACE(nombreCampana,'&#34;','\"'),'&#39;','\''))) descripcionNotificacion, iconoAkisi, imagenPush, descripcionCampana, 0 AS maximoDiario  
                FROM genesis.enc_campana WHERE estado = 1 AND fechaFinal >= CAST(NOW() AS DATE) AND fechaInicio <= CAST(NOW() AS DATE) 
                ORDER BY fechaCreacion DESC
            `, { raw: false, type: QueryTypes.SELECT });

    } else {

        /* await sequelize.query(`SELECT
                    fechaRegistro, edadInicial, edadFinal, tipoUsuario,
                    sexo, usuariosInternos, UsuariosNuevos, UsuariosAntiguos,
                    idCampana, nombreCampana, filtradoNumero, tipoPremio,
                    limiteParticipaciones, tipoParticipacion, minimoTransacciones, minimoAcumular,
                    IFNULL(tituloNotificacion, 'Felicidades!!!') tituloNotificacion,IFNULL(descripcionNotificacion,
                    REPLACE('Usted esta participando en nuestra nueva promoción {nombreCampana}', '{nombreCampana}',
                    REPLACE(REPLACE(nombreCampana,'&#34;','\"'),'&#39;','\''))) descripcionNotificacion, iconoAkisi,
                    imagenPush, descripcionCampana, 0 AS maximoDiario, limiteParticipaciones,
                        (SELECT COUNT(*) FROM genesis.participante_campana
                        WHERE idUsuarioParticipante = :idUsuario
                            AND participante_campana.idCampana = enc_campana.idCampana)
                        AS actualParticipaciones 
                FROM genesis.enc_campana 
                WHERE estado = 1 AND fechaFinal >= CAST(now() as date) AND fechaInicio <= CAST(now() as date)`
            , { raw: false, type: QueryTypes.SELECT, replacements: { idUsuario } }); */

    }
}

const campanasActualesActivasTercero = async () =>
    await sequelize.query(`SELECT fechaRegistro, edadInicial, edadFinal, tipoUsuario,
                            sexo, usuariosInternos, UsuariosNuevos, UsuariosAntiguos,
                            idCampana, nombreCampana, filtradoNumero, tipoPremio,
                            limiteParticipaciones, tipoParticipacion, minimoTransacciones,
                            minimoAcumular, IFNULL(tituloNotificacion, 'Felicidades!!!') tituloNotificacion,
                            IFNULL(descripcionNotificacion, REPLACE('Usted esta participando en nuestra nueva promoción {nombreCampana}', '{nombreCampana}',
                            REPLACE(REPLACE(nombreCampana,'&#34;','\"'),'&#39;','\''))) descripcionNotificacion, iconoAkisi, imagenPush, descripcionCampana
                                FROM genesis.enc_campana
                            WHERE estado = 1
                                AND fechaFinal >= CAST(NOW() AS DATE)
                                AND fechaInicio <= CAST(NOW() AS DATE)
                                AND terceros = 1
                            ORDER BY fechaCreacion DESC;`, { raw: false, type: QueryTypes.SELECT });

const campanaTransaccionesValidas = async (idCampana) =>
    await sequelize.query(`SELECT idLocal, valorMinimo, valorMaximo
                                FROM genesis.det_campana_participacion dcp
                            INNER JOIN genesis.transacciones t ON t.idTransaccion = dcp.idTransaccion
                            WHERE idCampana = :idCampana AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const campanaPremiosRetornarRandom = async (idCampana, idCampanaRegion) =>
    await sequelize.query(`SELECT p.idTransaccion, link, claveSecreta, dcp.valor,
                            t.descripcion, p.idPremio idtablaPremios, dppr.idPremioPR
                            FROM genesis.det_campana_premios dcp
                            INNER JOIN genesis.det_campana_premios_porcentaje_regiones dppr
                                ON dppr.idCampanaPremio = dcp.idCampanaPremio
                                AND dppr.estado = 1
                                AND limite > 0
                                AND dppr.limite > dppr.listo
                                AND dppr.idCampanaRegion = :idCampanaRegion
                            INNER JOIN genesis.premios p
                                ON p.idPremio = dcp.idPremio
                            LEFT JOIN genesis.transacciones t
                                ON p.idTransaccion = t.idTransaccion
                            WHERE idCampana = :idCampana
                                AND dcp.estado = 1 ORDER BY RAND() LIMIT 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idCampanaRegion } });

const campanaPremiosRetornarTodas = async (idCampana, idCampanaRegion) =>
    await sequelize.query(`SELECT p.idTransaccion, link, claveSecreta, dcp.valor,
                            t.descripcion, p.idPremio idtablaPremios, dppr.idPremioPR
                                FROM genesis.det_campana_premios dcp
                                INNER JOIN genesis.det_campana_premios_porcentaje_regiones dppr
                                    ON dppr.idCampanaPremio = dcp.idCampanaPremio
                                    AND dppr.estado = 1
                                    AND limite > 0
                                    AND dppr.limite > dppr.listo
                                    AND dppr.idCampanaRegion = :idCampanaRegion
                                INNER JOIN genesis.premios p
                                    ON p.idPremio = dcp.idPremio
                                LEFT JOIN genesis.transacciones t
                                    ON p.idTransaccion = t.idTransaccion
                                WHERE idCampana = :idCampana
                                    AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idCampanaRegion } });

const campanaPremiosInfoCliente = async (base, tabla, campoid, idTransaccion) =>
    await sequelize.query(`SELECT telno, department, municipality
                                    FROM pronet.tbl_customer
                                WHERE customer_id = :idTransaccion;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { base, tabla, campoid, idTransaccion } });

const ValidarNumeroTelefono = async telno => {
    const data = await sequelize.query(`SELECT COUNT(*) existeNumero
                            FROM pronet.tbl_customer
                            WHERE telno = :telno;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { telno } });
    return data.length > 0 ? data[0]['existeNumero'] : [{}]
}

const CampanaNumerosRestringidos = async (idCampana, numero, restringe) => {

    if (restringe == 0) {
        return { 'permitido': 1 }
    } else if (restringe == 1) {
        return await sequelize.query(`SELECT COUNT(*) AS permitido FROM genesis.det_campana_numeros_p WHERE id_campana = :idCampana and numero = ':numero' and estado = 1;`
            , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, numero, restringe } });
    } else if (restringe == 2) {
        return await sequelize.query(`SELECT CASE WHEN COUNT(*)>0 THEN 0 ELSE 1 END AS permitido FROM genesis.det_campana_numeros_p WHERE id_campana = :idCampana and numero = ':numero' and estado = 1;`
            , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, numero } });
    } else {
        return 0
    }

}

const validarUnicaTransaccion = async (usuario, idTransaccion, horaTransaccion, descTransaccion) => 0

const validarUnicaTransaccion2 = async (usuario, idTransaccion, horaTransaccion, descTransaccion, idCampana) => {
    const data = await sequelize.query(`SELECT SUM(existe) existe FROM (
        SELECT COUNT(*) existe FROM genesis.participante_campana WHERE idTransaccion = :idTransaccion AND horaTransaccion = ':horaTransaccion' 
            AND descTransaccion = ':descTransaccion' and idUsuarioParticipante = :usuario AND idCampana = :idCampana
                UNION ALL 
        SELECT COUNT(*) existe FROM genesis.participante_campana_adicional WHERE idTransaccion = :idTransaccion AND horaTransaccion = ':horaTransaccion' 
            AND descTransaccion = ':descTransaccion' AND idUsuarioParticipante = :usuario AND idCampana = :idCampana) sumar`
        , { raw: false, type: QueryTypes.SELECT, replacements: { usuario, idTransaccion, horaTransaccion, descTransaccion, idCampana } });
    return data.length > 0 ? data[0]['existe'] : [{}]
}


const validarUnicaTransaccion3 = async (usuario, idTransaccion, idCampana) => {
    const data = await sequelize.query(`SELECT COUNT(*) AS existe
                        FROM genesis.participante_campana_adicional
                        WHERE idTransaccion = ':idTransaccion'
                        AND idCampanaParticipacion = :idCampana
                        AND idUsuarioParticipante = :usuario`
        , { raw: false, type: QueryTypes.SELECT, replacements: { usuario, idTransaccion, idCampana } });
    return data.length > 0 ? data[0]['existe'] : [{}]
}

const validarLimiteParticipacionesPorUsuario = async (usuario, idCampana) => {
    await sequelize.query(`SELECT SUM(participaHoy) participaHoy FROM (SELECT COUNT(*) participaHoy
    FROM genesis.participante_campana
    WHERE idUsuarioParticipante = :usuario AND idCampana = :idCampana AND CAST(fechaParticipacion AS DATE) = CAST(NOW() AS DATE)) AS sumar;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { usuario, idCampana } });
    return data.length > 0 ? data[0]['participaHoy'] : [{}]
}

const validarlimitetransacciones = async (idParticipante, idTransaccion) => {
    const data = await sequelize.query(`SELECT
                                            SUM(cantidad) cantidad
                                        FROM (SELECT COUNT(idParticipante) cantidad FROM genesis.participante_campana
                                            WHERE idUsuarioParticipante = :idParticipante
                                                AND CAST(fechaParticipacion AS DATE) = CAST(NOW() AS DATE)
                                                AND idCampanaParticipacion = :idTransaccion
                                            UNION ALL
                                        SELECT COUNT(idParticipante) cantidad FROM genesis.participante_campana_adicional
                                        WHERE idUsuarioParticipante = :idParticipante
                                        AND CAST(fechaParticipacion AS DATE) = CAST(NOW() AS DATE)
                                        AND idCampanaParticipacion = :idTransaccion) sumar;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idParticipante, idTransaccion } });
    return data.length > 0 ? data[0]['cantidad'] : [{}]
}


const validarParticipantesRestantes = async (idCampana, idDepto, idMuni) => {
    const data = await sequelize.query(`SELECT COUNT(*) espacio
                                            FROM genesis.det_campana_regiones
                                            WHERE idCampana = :idCampana
                                                AND idDepartamento = :idDepto
                                                AND estado = 1
                                                AND idMunicipio = :idMuni
                                                AND limites > listos;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idDepto, idMuni } });
    return data.length > 0 ? data[0]['espacio'] : [{}]
}

const actualizarParticipantesRestantes = async (idCampana, idDepto, idMuni) => {
    const data = await sequelize.query(`UPDATE genesis.det_campana_regiones
                                            SET listos = listos + 1
                                            WHERE idCampana = :idCampana
                                                AND idDepartamento = :idDepto
                                                AND estado = 1
                                                AND idMunicipio = :idMuni;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idDepto, idMuni } });
    return data.length > 0 ? { 'status': 201, 'message': 'Datos guardados exitosamente.' } : { 'status': 400, 'message': 'Nop.' }
}

const transaccionesUsuario = async (usuario, numeroRetornar) => {
    const data = await sequelize.query(`UPDATE genesis.det_campana_regiones
                                            SET listos = listos + 1
                                            WHERE idCampana = :idCampana
                                                AND idDepartamento = :idDepto
                                                AND estado = 1
                                                AND idMunicipio = :idMuni;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { usuario, numeroRetornar } });
    return data.length > 0 ? data[0]['espacio'] : [{}]
}

const informacionGeneralUsuario = async usuario =>
    await sequelize.query(`SELECT DATE_FORMAT(tc.created_date, '%Y-%m-%d') fechaCreacion,
                                            timestampdiff(YEAR, bdate, NOW()) edad, CASE WHEN tui.gender = 'MALE'
                                                THEN 1 WHEN tui.gender = 'FEMALE'
                                                THEN 2 END genero, tc.telno
                                            FROM pronet.tblUserInformation tui
                                            INNER JOIN pronet.tbl_customer tc
                                                ON tc.fk_userid = tui.userid WHERE customer_id = :usuario;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { usuario } });

const transaccionesValidasCampana = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, idTipoParticipacion, limiteTransacciones,
                                tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion
                            FROM genesis.det_campana_participacion dcp
                            INNER JOIN genesis.transacciones t
                                ON t.idTransaccion = dcp.idTransaccion
                            INNER JOIN genesis.columnastablasdb ctdb
                                ON ctdb.id = t.columna
                            WHERE idCampana = :idCampana AND  tipoTransaccion = 't'  AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const transaccionesValidasCampanaCategoria = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, dcp.idTipoParticipacion, dcp.limiteTransacciones,
        dcp.tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion
    FROM genesis.det_campana_participacion dcp 
        INNER JOIN genesis.det_categoria AS dc ON dc.id_categoria = dcp.idTransaccion
        INNER JOIN genesis.transacciones AS t ON t.idTransaccion = dc.idtransaccion 
        INNER JOIN genesis.columnastablasdb ctdb ON ctdb.id = t.columna
    WHERE dcp.idCampana = ':idCampana' AND  tipoTransaccion = 'c' AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const transaccionesValidasCampanasFusion = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, idTipoParticipacion, limiteTransacciones,
                                tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion
                            FROM genesis.det_campana_participacion dcp INNER JOIN genesis.transacciones t ON t.idTransaccion = dcp.idTransaccion 
                            INNER JOIN genesis.columnastablasdb ctdb ON ctdb.id = t.columna WHERE idCampana = :idCampana AND  tipoTransaccion = 't'  AND dcp.estado = 1
                                UNION ALL
                                SELECT 
                            dcp.valorMinimo, dcp.valorMaximo, dcp.idTipoParticipacion, dcp.limiteTransacciones,
                            dcp.tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion
                            FROM genesis.det_campana_participacion dcp
                                INNER JOIN genesis.det_categoria AS dc ON dc.id_categoria = dcp.idTransaccion
                                INNER JOIN genesis.transacciones AS t ON t.idTransaccion = dc.idtransaccion 
                                INNER JOIN genesis.columnastablasdb ctdb ON ctdb.id = t.columna WHERE dcp.idCampana = :idCampana AND  tipoTransaccion = 'c' AND dcp.estado = 1  
                            GROUP BY tipoTransaccion = 'c'`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const transaccionesValidasCampanasFusionL = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, idTipoParticipacion, limiteTransacciones, tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion, dcp.idCampana 
                            FROM genesis.det_campana_participacion dcp INNER JOIN genesis.transacciones t ON t.idTransaccion = dcp.idTransaccion
                            INNER JOIN genesis.columnastablasdb ctdb ON ctdb.id = t.columna WHERE idCampana = :idCampana AND  tipoTransaccion = 't'  AND dcp.estado = 1
                                UNION ALL
                            SELECT dcp.valorMinimo, dcp.valorMaximo, dcp.idTipoParticipacion, dcp.limiteTransacciones, dcp.tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion, dcp.idCampana 
                            FROM genesis.det_campana_participacion dcp 
                            INNER JOIN genesis.det_categoria AS dc ON dc.id_categoria = dcp.idTransaccion 
                            INNER JOIN genesis.transacciones AS t ON t.idTransaccion = dc.idtransaccion 
                            INNER JOIN genesis.columnastablasdb ctdb ON ctdb.id = t.columna WHERE dcp.idCampana = :idCampana AND  tipoTransaccion = 'c' AND dcp.estado = 1 and dc.estado = 1`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const regionesValidasCampana = async idCampana =>
    await sequelize.query(`SELECT dcr.idDepartamento, dcr.idMunicipio, d.idLocal idlocald,
                                m.idLocal idlocalm, limites, listos,
                                dcr.idCampanaRegion
                            FROM genesis.det_campana_regiones dcr
                            LEFT JOIN genesis.departamento d
                                ON d.iddepartamento = dcr.iddepartamento
                            LEFT JOIN genesis.municipio m
                                ON m.departamento = dcr.idDepartamento
                                AND m.idmunicipio = dcr.idMunicipio
                            WHERE idCampana = :idCampana
                                AND dcr.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const guardarParticipacion = async idCampana =>
    await sequelize.query(`INSERT INTO genesis.participante_campana (idProyecto, idUsuarioParticipante, fechaParticipacion,
                            idCampana, idTransaccion, horaTransaccion, descTransaccion, idCampanaParticipacion, idPremio,
                            valorPremio, urlPremio) VALUES ((SELECT idProyecto FROM genesis.enc_campana
                            WHERE idCampana = :idCampana), :idUsuario, NOW(), :idCampana, :idTransaccion, ':horaTransaccion', ':descTransaccion', :idCampanaParticipacion, :idtablaPremios, :valorPremio, ':urlPremio');`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const guardarParticipacionAlterna = async (idCampana, idUsuario, idTransaccion, horaTransaccion,
    descTransaccion, idCampanaParticipacion, idtablaPremios, valorTransaccion) =>
    await sequelize.query(`INSERT INTO genesis.participante_campana_adicional
                                (idProyecto, idUsuarioParticipante, fechaParticipacion, idCampana,
                                idTransaccion, horaTransaccion, descTransaccion, idCampanaParticipacion,
                                valorTransaccion) VALUES (IFNULL((SELECT idProyecto
                            FROM genesis.enc_campana WHERE idCampana = :idCampana), 0), :idUsuario, NOW(), :idCampana, :idTransaccion, ':horaTransaccion', ':descTransaccion', :idCampanaParticipacion, :valorTransaccion);`
        , {
            raw: false, type: QueryTypes.SELECT, replacements: {
                idCampana, idUsuario, idTransaccion, horaTransaccion,
                descTransaccion, idCampanaParticipacion, idtablaPremios, valorTransaccion
            }
        });

const guardaOfferCraftNotification = async (url, tipoTrax, telefono) =>
    await sequelize.query(`INSERT INTO pronet.tbl_offercraft_notifications(url, estado, fecha_uso, tipo_trx, telefono)
                            VALUES (':url', 1, NOW(), ':tipoTrax', ':telefono');`
        , { raw: false, type: QueryTypes.SELECT, replacements: { url, tipoTrax, telefono } });

const revisionCampanaTransaccionesRecurrentes = async idCampana =>
    await sequelize.query(`SELECT dcp.idCampanaParticipacion, dcp.idTransaccion,
                            limiteTransacciones, DATEDIFF(CAST(NOW() AS DATE), ec.fechaFinal) yaTermino,
                            DATEDIFF(CAST(ec.fechaFinal AS DATE), CAST(ec.fechaInicio AS DATE)) + 1 cantidadDias,
                            ec.minimoTransacciones, ec.minimoAcumular
                            FROM genesis.enc_campana ec
                            INNER JOIN genesis.det_campana_participacion dcp
                                ON dcp.idCampana = ec.idCampana
                            WHERE ec.idcampana = :idCampana
                                AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const obtenerTransaccionesParaRevision = async (idCampana, idParticipacion, idParticipante) =>
    await sequelize.query(`SELECT COUNT(*) existe
                            FROM genesis.participante_campana_adicional
                            WHERE idCampana = :idCampana
                                AND idCampanaParticipacion IN (:idParticipacion)
                                AND yaAplico = 0
                                AND idUsuarioParticipante = :idParticipante;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idParticipacion, idParticipante } });

const obtenerTransaccionesParaRevisionDias = async (idCampana, idParticipacion, idParticipante) => {
    const data = await sequelize.query(`SELECT COUNT(*) existe
                            FROM (SELECT CAST(fechaParticipacion as date)
                            FROM genesis.participante_campana_adicional
                            WHERE idCampana = :idCampana
                            AND idCampanaParticipacion IN (:idParticipacion)
                            AND yaAplico = 0
                            AND idUsuarioParticipante = :idParticipante
                            GROUP BY CAST(fechaParticipacion AS DATE)) AS contador;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idParticipacion, idParticipante } });
    return data.length > 0 ? data[0]['existe'] : [{}];
}

const obtenerTransaccionesParaRevisionValor = async (idCampana, idParticipacion, idParticipante) => {
    const data = await sequelize.query(`SELECT SUM(valorTransaccion)
                                        FROM genesis.participante_campana_adicional
                                        WHERE idCampana = :idCampana
                                        AND idCampanaParticipacion IN (:idParticipacion)
                                        AND yaAplico = 0
                                        AND idUsuarioParticipante = :idParticipante;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idParticipacion, idParticipante } });
    return data.length > 0 ? data[0]['existe'] : [{}];
}

const actualizarTransaccionesRevisadas = async (idCampana, idParticipacion, idParticipante) =>
    await sequelize.query(`UPDATE genesis.participante_campana_adicional
                            SET yaAplico = 1
                            WHERE idCampana = :idCampana
                            AND idCampanaParticipacion = :idParticipacion
                            AND yaAplico = 0
                            AND idUsuarioParticipante = :idParticipante;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idParticipacion, idParticipante } });

const campanasRecurrentesAcumulativasParaRevision = async () =>
    await sequelize.query(`SELECT idCampana, nombreCampana, tipoParticipacion, fechaInicio,
                                fechaFinal, DATEDIFF(fechaFinal, fechaInicio) + 1 diasContar,
                                limiteParticipaciones, tipoPremio
                            FROM genesis.enc_campana
                            WHERE estado = '1'
                            AND tipoParticipacion IN (2,3,4)
                            AND fechaFinal = CAST(DATE_ADD(NOW(), INTERVAL -1 DAY) AS DATE);`
        , { raw: false, type: QueryTypes.SELECT });

const deptosMunisCampanasRecurrentesAcumulativasParaRevision = async idCampana =>
    await sequelize.query(`SELECT  IFNULL(d.iddepartamento, 0) iddepartamento,
                            IFNULL(d.idLocal, 0) idLocald, IFNULL(m.idmunicipio, 0) idmunicipio,
                            IFNULL(m.idLocal, 0) idlocalm, limites - listos restantes, dcr.idCampanaRegion
                            FROM genesis.enc_campana ec
                            INNER JOIN genesis.det_campana_regiones dcr
                                ON dcr.idCampana = ec.idCampana
                                    AND dcr.estado = 1
                            LEFT JOIN genesis.departamento d
                                ON d.proyecto = ec.idProyecto
                                    AND d.iddepartamento = dcr.idDepartamento
                                    AND d.estado = 1
                            LEFT JOIN genesis.municipio m ON m.departamento = d.iddepartamento
                                        AND dcr.idMunicipio = m.idmunicipio
                                        AND m.estado = 1
                            WHERE ec.idCampana = :idCampana;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const participanteCampanasRecurrentesAcumulativasParaRevision = async (idCampana, fecha1, fecha2, idDepto, idMuni, limiteGanadores, minimoAcumulativo) =>
    await sequelize.query(`SELECT SUM(contador) suma, idUsuarioParticipante
                            FROM (SELECT 1 contador, idUsuarioParticipante
                            FROM genesis.participante_campana_adicional pca
                            INNER JOIN pronet.tbl_customer tc
                                ON pca.idUsuarioParticipante = tc.customer_id
                            WHERE idCampana = :idCampana
                                AND CAST(fechaParticipacion AS DATE)
                                    BETWEEN ':fecha1'
                                        AND ':fecha2'
                                AND CASE WHEN :idDepto = 0 THEN 0
                                    ELSE department
                                END = :idDepto
                                AND CASE WHEN :idMuni = 0 THEN 0
                                    ELSE municipality
                                END = :idMuni
                                AND yaAplico = 0
                            GROUP BY CAST(fechaParticipacion AS DATE), idUsuarioParticipante) sumar
                            GROUP BY idUsuarioParticipante
                            HAVING SUM(contador) >= :minimoAcumulativo
                            LIMIT :limiteGanadores;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, fecha1, fecha2, idDepto, idMuni, limiteGanadores, minimoAcumulativo } });

const campanasRevisionGeneral = async () =>
    await sequelize.query(`SELECT idCampana, tipoParticipacion, fechaCreacion, fechaInicio,
                            fechaFinal, fechaRegistro, edadInicial, edadFinal,
                            tipoUsuario, sexo, usuariosInternos, UsuariosAntiguos,
                            UsuariosNuevos, nombreCampana, filtradoNumero, tipoPremio,
                            tituloNotificacion, descripcionNotificacion, limiteParticipaciones,
                            minimoTransacciones, minimoAcumular
                            FROM genesis.enc_campana
                            WHERE tipoParticipacion IN (1,3)
                                AND estado = '1'
                                AND fechaFinal >= CAST(NOW() as date)
                            UNION ALL
                            SELECT idCampana, tipoParticipacion, fechaCreacion, fechaInicio,
                                fechaFinal, fechaRegistro, edadInicial, edadFinal,
                                tipoUsuario, sexo, usuariosInternos, UsuariosAntiguos,
                                UsuariosNuevos, nombreCampana, filtradoNumero, tipoPremio, tituloNotificacion, descripcionNotificacion, limiteParticipaciones, minimoTransacciones, minimoAcumular FROM genesis.enc_campana WHERE tipoParticipacion IN (2,4,5) AND estado = '1' AND fechaFinal >= CAST(NOW() as date);`
        , { raw: false, type: QueryTypes.SELECT });

const transaccionesDelUsurioPendientesXcampana = async (idUsuario, fecha1, fecha2, idCampana) =>
    await sequelize.query(`SELECT *, CAST(fechaParticipacion AS DATE) solofecha
                            FROM genesis.participante_campana_adicional
                            WHERE yaAplico = 0
                                AND idCampanaParticipacion = :idCampana
                                AND idUsuarioParticipante = :idUsuario
                                AND (fechaParticipacion
                                    BETWEEN ':fecha1 00:00:00'
                                        AND ':fecha2 23:59:59')
                                AND fechaParticipacion >= (SELECT fechaCreacion
                                    FROM enc_campana
                                    WHERE idCampana = idCampana);`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idUsuario, fecha1, fecha2, idCampana } });

const TransaccionesDelUsurioPendientes = async (idUsuario, fecha1, fecha2) =>
    await sequelize.query(`SELECT *, CAST(fechaParticipacion AS DATE) solofecha
                            FROM genesis.participante_campana_adicional
                            WHERE yaAplico = 0
                                AND idCampana = 0
                                AND idUsuarioParticipante = :idUsuario
                                AND fechaParticipacion BETWEEN ':fecha1'
                                AND ':fecha2 23:59:59';`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idUsuario, fecha1, fecha2 } });

const actualizarTransaccionesAplicadas = async (idCampana, transacciones) =>
    await sequelize.query(`UPDATE genesis.participante_campana_adicional
                            SET idCampana = :idCampana, yaAplico = 1
                            WHERE idParticipante IN (:transacciones)
                                AND idCampanaParticipacion = :idCampana;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, transacciones } });

const limiteTransaccionesCampana = async idCampana =>
    await sequelize.query(`SELECT limiteTransacciones
                            FROM det_campana_participacion
                            WHERE idCampana = :idCampana
                                AND tipoTransaccion = 'c'`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const participacionesAdicionales = async (idparticipante, idCampana) =>
    await sequelize.query(`SELECT COUNT(idParticipante) cantidad
                            FROM genesis.participante_campana_adicional
                            WHERE idUsuarioParticipante = :idparticipante
                                AND CAST(fechaParticipacion AS DATE) = CAST(NOW() AS DATE)
                                AND idCampanaParticipacion = :idCampana"`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idparticipante, idCampana } });

const participacionesAdicionalesList = async (idparticipante, idCampana) =>
    await sequelize.query(`SELECT *
                            FROM genesis.participante_campana_adicional
                            WHERE idUsuarioParticipante = :idparticipante
                                AND idCampanaParticipacion = :idCampana"`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idparticipante, idCampana } });


const TransaccionenXCampana = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, idTipoParticipacion, limiteTransacciones,
                                tipoTransaccion, t.descripcion, ctdb.columna, dcp.idCampanaParticipacion
                            FROM genesis.det_campana_participacion dcp
                            INNER JOIN genesis.transacciones t
                                ON t.idTransaccion = dcp.idTransaccion
                            INNER JOIN genesis.columnastablasdb ctdb
                                ON ctdb.id = t.columna WHERE idCampana = :idCampana
                            AND dcp.estado = 1;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const TransaccionenXNew = async idCampana =>
    await sequelize.query(`SELECT dcp.valorMinimo, dcp.valorMaximo, idTipoParticipacion, limiteTransacciones,
                            tipoTransaccion,  dcp.idCampanaParticipacion
                            FROM genesis.det_campana_participacion dcp
                            WHERE idCampana =:idCampana`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const cantidadParametros = async idCampana =>
    await sequelize.query(`SELECT SUM(limiteTransacciones) cantidad
                            FROM genesis.det_campana_participacion
                            WHERE idCampana = :idCampana`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });

const cantidadParticipacionesAdicional = async (idCampana, idRevision) =>
    await sequelize.query(`SELECT *
                            FROM participante_campana_adicional 
                            WHERE yaAplico = 0
                                AND idCampanaParticipacion = :idCampana
                                AND idUsuarioParticipante = :idRevision`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idRevision } });

const cantidadParticipaciones = async (idCampana, idRevision) =>
    await sequelize.query(`SELECT
                                COUNT(*) cantidad
                            FROM participante_campana
                            WHERE idCampana = :idCampana
                            AND idUsuarioParticipante = :idRevision`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idRevision } });

const getDatosXCampana = async idCampana =>
    await sequelize.query(`SELECT tituloNotificacion, descripcionNotificacion, tipoPremio,
                            (SELECT idCampanaRegion FROM genesis.det_campana_regiones
                                WHERE idCampana = enc_campana.idCampana limit 1) idCampanaRegion
    FROM enc_campana WHERE idCampana = :idCampana`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idRevision } });

const getCustomerID = async telno =>
    await sequelize.query(`SELECT customer_id
                            FROM pronet.tbl_customer
                            WHERE telno = :telno`
        , { raw: false, type: QueryTypes.SELECT, replacements: { telno } });

const removeAdicionales = async (idCampana, idUsuario) =>
    await sequelize.query(`UPDATE participante_campana_adicional
                            SET yaAplico = 1, idCampana = :idCampana
                            WHERE idCampanaParticipacion = :idCampana
                            AND yaAplico = 0
                            AND idUsuarioParticipante = ':idUsuario';`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana, idUsuario } });

const getPremiosXCamapa = async idCampana =>
    await sequelize.query(`SELECT p.idTransaccion, dcp.valor,
                                IFNULL(t.descripcion, '---') AS descripcion, p.idPremio
                                    AS idtablaPremios, 0 AS idPremioPR
                            FROM genesis.det_campana_premios dcp
                            INNER JOIN genesis.premios p
                                ON p.idPremio = dcp.idPremio
                                    LEFT JOIN genesis.transacciones t
                                        ON p.idTransaccion = t.idTransaccion
                            WHERE dcp.idCampana = :idCampana;`
        , { raw: false, type: QueryTypes.SELECT, replacements: { idCampana } });


module.exports = {
    check_auth_client, auth, getTestTransaccion, campanasActualesActivas, campanasActualesActivasTercero, campanaTransaccionesValidas, campanaPremiosRetornarRandom, campanaPremiosRetornarTodas, campanaPremiosInfoCliente,
    ValidarNumeroTelefono, CampanaNumerosRestringidos, validarUnicaTransaccion, validarUnicaTransaccion2, validarUnicaTransaccion3, validarLimiteParticipacionesPorUsuario, validarlimitetransacciones, validarParticipantesRestantes,
    actualizarParticipantesRestantes, transaccionesUsuario, informacionGeneralUsuario, transaccionesValidasCampana, transaccionesValidasCampanaCategoria, transaccionesValidasCampanasFusion, transaccionesValidasCampanasFusionL,
    regionesValidasCampana, guardarParticipacion, guardarParticipacionAlterna, guardaOfferCraftNotification, revisionCampanaTransaccionesRecurrentes, obtenerTransaccionesParaRevision, obtenerTransaccionesParaRevisionDias,
    obtenerTransaccionesParaRevisionValor, actualizarTransaccionesRevisadas, campanasRecurrentesAcumulativasParaRevision, deptosMunisCampanasRecurrentesAcumulativasParaRevision, participanteCampanasRecurrentesAcumulativasParaRevision,
    campanasRevisionGeneral, transaccionesDelUsurioPendientesXcampana, TransaccionesDelUsurioPendientes, actualizarTransaccionesAplicadas, limiteTransaccionesCampana, participacionesAdicionales, participacionesAdicionalesList,
    TransaccionenXCampana, TransaccionenXNew, cantidadParametros, cantidadParticipacionesAdicional, cantidadParticipaciones, getDatosXCampana, getCustomerID, removeAdicionales, getPremiosXCamapa
}