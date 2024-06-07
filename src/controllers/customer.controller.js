const { QueryTypes } = require('sequelize');

const dataUsuario = async (idUsuario = 0) => {

    if (idUsuario == 0) {

        const dataUsuario = await sequelize.query(`telno, has_commerce FROM pronet.tbl_customer WHERE customer_id = :idUsuario`);

        if (dataUsuario) {
            
        } else {
            
        }

        const dataUsuario_ = await sequelize.query(`SELECT
                telno, has_commerce
                FROM pronet.tbl_customer
                WHERE customer_id ${dataUsuario ? `AND (
                    filtradoNumero=0 OR 
                    (filtradoNumero=1 AND (SELECT COUNT(*) AS permitido
                        FROM genesis.det_campana_numeros_p
                            WHERE id_campana=enc_campana.idCampana
                            AND numero=${dataUsuario.telno}
                            AND estado=1)=1) OR (filtradoNumero=2
                            AND (SELECT CASE WHEN COUNT(*)>0 THEN 0 ELSE 1 END AS permitido
                            FROM genesis.det_campana_numeros_p
                            WHERE id_campana=enc_campana.idCampana
                            AND numero=${dataUsuario.telno}
                            AND estado=1)=1)
                            ) AND ( tipoUsuario = 2
                                OR tipoUsuario = ${dataUsuario.has_commerce})` :
                    'AND tipoUsuario = 2'}`
        , { raw: false, type: QueryTypes.SELECT })


    } else {

        await sequelize.query(`SELECT
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
                WHERE estado = 1 AND fechaFinal >= CAST(NOW() AS DATE) AND fechaInicio <= CAST(NOW() AS DATE)`
            , { raw: false, type: QueryTypes.SELECT });

    }
}

module.exports = { dataUsuario }