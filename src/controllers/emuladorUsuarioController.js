const { EnviaPremio } = require('../models/enviaPremio');
const { Campania } = require('../models/campanias');
const { Bloqueados } = require('../models/bloqueados');
const { Participantes } = require('../models/participantes');
const { Presupuesto } = require('../models/presupuesto');
const { Etapa } = require('../models/etapa');
const { Parametro } = require('../models/parametro');
const { Participacion } = require('../models/Participacion');
const { Transaccion } = require('../models/transaccion');
const { Departamento } = require('../models/departamento');
const { Municipio } = require("../models/municipio");

// const { EmuladorUsuario } = require('../models/emuladorUsuario');
const { pronet, sequelize, genesis, Op } = require('../database/database');
const { Sequelize, where } = require('sequelize');
const { CampaniaRegiones } = require('../models/campaniaregions');
const { CampaniasNumeros } = require('../models/campanianumero');

const transaccionesValidasCampanasFusionL = async (id) => {
    try {
        const transaccionesValidas = await Campania.findByPk(id, {
            include: [
                {
                    model: Participantes,
                    attributes: ['id'],
                },

                {
                    model: Etapa,
                    attributes: ['tipoParticipacion'],
                    include: [
                        {
                            model: Parametro,
                            attributes: ['limiteParticipacion', 'ValorMinimo', 'ValorMaximo', 'valorAnterior']
                        }
                    ]
                },
                {
                    model: Participacion,
                    as: 'participaciones',
                    include: [
                        {
                            model: Transaccion,
                            attributes: ['idColumna']
                        }
                    ]
                }
            ]
        });
        return transaccionesValidas;
    } catch (error) {
        throw error;
    }
}


const transaccionesValidasCampanasFusionLg = async (idCampanias) => {
    // const { idCampania } = req.params;

    try {
        const query = `
            SELECT 
                dcp.valorMinimo, 
                dcp.valorMaximo, 
                dcp.idTipoParticipacion, 
                dcp.limiteParticipacion, 
                dcp.tipoTransaccion, 
                t.descripcion, 
                ctdb.nombre, 
                dcp.id, 
                dcp.idCampania 
            FROM 
                lealtadv2.parametros dcp 
            INNER JOIN 
                lealtadv2.transaccions t ON t.id = dcp.idTransaccion 
            INNER JOIN 
                lealtadv2.columnas ctdb ON ctdb.id = t.idColumna 
            WHERE 
                idCampania = :idCampania AND tipoTransaccion = 't'  AND dcp.estado = 1 
            UNION ALL 
            SELECT 
                dcp.valorMinimo, 
                dcp.valorMaximo, 
                dcp.idTipoParticipacion, 
                dcp.limiteParticipacion, 
                dcp.tipoTransaccion, 
                t.descripcion, 
                ctdb.nombre, 
                dcp.id, 
                dcp.idCampania 
            FROM 
                lealtadv2.parametros dcp 
            INNER JOIN 
                lealtadv2.categoria AS dc ON dc.id = dcp.idTransaccion 
            INNER JOIN 
                lealtadv2.transaccions AS t ON t.id = dc.idTransaccion 
            INNER JOIN 
                lealtadv2.columnas ctdb ON ctdb.id = t.idColumna 
            WHERE 
                dcp.idCampania = :idCampania AND tipoTransaccion = 'c' AND dcp.estado = 1 and dc.estado = 1
        `;

        const transacciones = await sequelize.query(query, {
            replacements: { idCampania: idCampania },
            type: Sequelize.QueryTypes.SELECT
        });

        return transacciones;
    } catch (error) {
        throw error;
        // console.error("Error al obtener transacciones válidas de la campaña:", error);
        // return res.status(500).json({ message: 'Error al obtener transacciones válidas de la campaña' });
    }
};



const GetcampanasActivasById = async (id) => {
    try {
        const departamento = await Campania.findByPk(id, {
            include: [
                {
                    model: Etapa,
                    include: [
                        { model: Presupuesto, attributes: ['idDepartamento'] }
                    ]
                },
            ]
        });
        return departamento;
    } catch (error) {
        throw error;
    }
}

const generaCampanasUsuarios = async (req, res) => {
    try {
        const { referens } = req.params;
        console.log("Número de referencia:", referens);

        const refer = await pronet.query(
            `SELECT customer_id FROM pronet.tbl_customer WHERE customer_reference = :referens LIMIT 1;`, {
            replacements: { referens },
            type: Sequelize.QueryTypes.SELECT
        }
        );

        console.log("Resultado de la consulta refer:", refer);

        if (refer && refer.length > 0) {
            const usuario = await pronet.query(
                `SELECT telno, department, municipality FROM pronet.tbl_customer WHERE customer_id = :customer_id`, {
                replacements: { customer_id: refer[0].customer_id },
                type: Sequelize.QueryTypes.SELECT
            }
            );

            console.log("Resultado de la consulta usuario:", usuario);

            if (usuario && usuario.length > 0) {
                // Obtener las campañas activas utilizando el modelo Campania
                const campanasActivasEnc = await Campania.findAll({
                    where: {
                        estado: 1,
                    },
                    attributes: ['id', 'nombre', 'descripcion', 'fechaCreacion', 'fechaRegistro', 'fechaInicio', 'fechaFin', 'edadInicial', 'edadFinal', 'sexo', 'tipoUsuario', 'tituloNotificacion', 'descripcionNotificacion', 'imgPush', 'imgAkisi', 'estado', 'maximoParticipaciones', 'mistransacciones', 'transacciones'],
                    order: [
                        ['fechaCreacion', 'DESC']
                    ]
                });

                console.log("Resultado de la consulta campanasActivasEnc:", campanasActivasEnc);

                // Asignar valores a cada objeto campana
                for (const valorCampanasActivas of campanasActivasEnc) {
                    valorCampanasActivas.fechaRegistro = valorCampanasActivas.fechaCreacion;
                    valorCampanasActivas.edadInicial = valorCampanasActivas.edad_inicio;
                    valorCampanasActivas.edadFinal = valorCampanasActivas.edad_fin;
                    valorCampanasActivas.tipoUsuario = valorCampanasActivas.tipo_usuario;
                    valorCampanasActivas.sexo = valorCampanasActivas.sexo;
                    valorCampanasActivas.usuariosInternos = valorCampanasActivas.usuarios_internos;
                    valorCampanasActivas.UsuariosAntiguos = valorCampanasActivas.UsuariosAntiguos;
                    valorCampanasActivas.UsuariosNuevos = valorCampanasActivas.UsuariosNuevos;
                    valorCampanasActivas.esParaUsuariosNuevos = valorCampanasActivas.UsuariosNuevos;
                    valorCampanasActivas.idCampana = valorCampanasActivas.idCampana;
                    valorCampanasActivas.nombreCampana = valorCampanasActivas.nombreCampana;
                    valorCampanasActivas.filtradoNumero = valorCampanasActivas.filtradoNumero;
                    valorCampanasActivas.tipoPremiosCampana = valorCampanasActivas.tipoPremio;

                    if (valorCampanasActivas.imgAkisi = valorCampanasActivas.imgAkisi) {
                        valorCampanasActivas.imgAkisi = valorCampanasActivas.imgAkisi;
                    } else {
                        valorCampanasActivas.imgAkisi = valorCampanasActivas.imgAkisi || 'data:image/png;base64,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';
                    }

                    if (valorCampanasActivas.imgPush = valorCampanasActivas.imgPush) {
                        valorCampanasActivas.imgPush = valorCampanasActivas.imgPush;
                    } else {
                        valorCampanasActivas.imgPush = valorCampanasActivas.imgPush || 'data:image/png;base64,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';
                    }

                    const Bloqueado = await Bloqueados.findAll({
                        where: {
                            estado: 1,
                        },
                        attributes: ['numero', 'idCampania'],
                    });

                    // console.log("Bloqueados:", Bloqueado);
                    const Participante = await Participantes.findAll({
                        where: {
                            estado: 1,
                        },
                        attributes: ['numero', 'idCampania'],
                    });

                    // console.log("Participantes:", Participante);
                    const validaBloqueado = (bloqueado, participantes) => {
                        const participanteCoincidente = participantes.find(participante =>
                            participante.numero === bloqueado.numero && participante.idCampania === bloqueado.idCampania
                        );

                        return participanteCoincidente ? 'Restrinjido' : 'permitido';
                    };

                    const participantesPermitidos = [];
                    const participantesBloqueados = [];

                    for (const participante of Participante) {
                        const resultadoBloqueado = validaBloqueado(participante, Bloqueado);
                        // console.log(`El numero a participar ${participante.numero} es ${resultadoBloqueado}.`);

                        if (resultadoBloqueado === 'Restrinjido') {
                            participantesBloqueados.push(participante);
                        } else {
                            participantesPermitidos.push(participante);
                        }
                    }

                    const campaniasFiltradas = await Promise.all(campanasActivasEnc.map(async (campania) => {
                        try {
                            const regionesValidas = await regionesValidasCampania(campania.id);
                            // Aquí aplicas la lógica para determinar si un usuario es válido basado en las regiones\
                            console.log(`Resultado de regionesValidas para campania ${campania.id}:`, regionesValidas);
                            return regionesValidas.length > 0 ? campania : null;
                        } catch (error) {
                            console.error('Error obteniendo regiones válidas para campania:', campania.id, error);
                            return null; // Maneja el error como prefieras
                        }

                    }));


                    res.json(campaniasFiltradas.filter(campania => campania !== null));

                    // for (const region of regionesValidas) {
                    //     if (region.limites > region.listos &&
                    //         (region.idDepartamento === 0 || (region.idDepartamento === referencia.depto && (region.idMunicipio === 0 || region.idMunicipio === referencia.muni)))) {
                    //         permitidoRegionParticipante = 1;
                    //         break;  // Salir del ciclo una vez que se encuentra una región permitida
                    //     }
                    // }

                    // const notificacionData = await tienePremiosPendientesCampanas(idCampania, idRevision);
                    // let notificacion = 0;
                    // let urlnotificacion = '';
                    // let dataAgregar = {};

                    // if (notificacionData) {
                    //     notificacion = 1;
                    //     urlnotificacion = notificacionData.link;
                    //     let descripcion = `${tituloNotificacion}\n${descripcionNotificacion}`;

                    //     dataAgregar = {
                    //         idCampania: idCampania,
                    //         nombre: nombre,
                    //         descripcion: descripcionCampana,
                    //         tipoParticipacion: tipoParticipacion,
                    //         notificacion: notificacion,
                    //         urlNotificacion: urlnotificacion,
                    //         tituloNotificacion: tituloNotificacion,
                    //         descripcionNotificacion: descripcionNotificacion,
                    //         infoAdd: -1, // Específico de tu lógica de negocio
                    //         mistransacciones: 0,
                    //         transacciones: 0,
                    //         imagenIcono: imagen, // Asegurar que 'imagen' está definida apropiadamente
                    //         imagenGrande: imagenPush, // Asegurar que 'imagenPush' está definida apropiadamente
                    //         botones: [] // Asegurar que esto se define según tus requisitos
                    //     };
                    //     retorno.push(dataAgregar);
                    // } else if (permitidoRegionParticipante === 1) {
                    //     let revision = '4'; // O cualquier otro valor según la lógica de negocio
                    //     let contadorParametros = 0;
                    //     let contadorYaLlevo = 0;

                    //     parametrosParticipacion.forEach((valor) => {
                    //         contadorParametros += 1;
                    //     });

                    //     let numeroImagen = Math.floor(Math.random() * 4) + 1;
                    //     let imagen = iconoAkisi; // Asegurar que 'iconoAkisi' está correctamente definido

                    //     let infoAdd = [];
                    //     // Aquí agregarías cualquier otra lógica relevante...

                    //     // Luego construyes el objeto dataAgregar como arriba pero con valores que correspondan a este caso
                    //     // Suponiendo que ya has realizado las comprobaciones necesarias y tienes variables disponibles
                    //     let dataAgregar = {
                    //         id: idCampania, // ID de la campaña
                    //         nombre: "Nombre de la Campaña", // Deberías tener esto de algún lugar en tu flujo
                    //         descripcion: "Descripción de la campaña aquí", // Descripción basada en tu lógica de negocios
                    //         tipoParticipacion: "Tipo de Participación", // Detalles del tipo de participación de la campaña
                    //         notificacion: 0, // No hay notificaciones porque no hay premios pendientes
                    //         urlNotificacion: "", // URL vacía ya que no hay notificaciones
                    //         tituloNotificacion: "", // Sin título para notificaciones
                    //         descripcionNotificacion: "", // Sin descripción para notificaciones
                    //         infoAdd: -1, // Asumiendo que -1 es un valor estándar para indicar no información adicional
                    //         mistransacciones: 0, // Suponiendo que no hay transacciones relevantes aún
                    //         transacciones: 0, // No hay requisitos de transacción cumplidos
                    //         imagenIcono: "ruta/a/icono.png", // La imagen del icono de la campaña
                    //         imagenGrande: "ruta/a/imagen_grande.png", // La imagen grande para la campaña
                    //         botones: [] // Los botones que se deben mostrar, si es aplicable
                    //     };

                    //     return dataAgregar;

                    // }


                    for (const campania of campanasActivasEnc) {
                        // Obtener las etapas de la campaña
                        const transaccionesValidas = await transaccionesValidasCampanasFusionL(campania.id);

                        // Iterar sobre las etapas y mostrar los idDepartamento de los presupuestos asociados
                        for (const etapa of transaccionesValidas.etapas) {
                            // console.log("Información de la etapa:", etapa);
                            // console.log("Información de tipoParticipacion:", etapa.tipoParticipacion);

                            // Verifica si los parametros se están cargando correctamente
                            if (etapa && etapa.parametros && etapa.parametros.length > 0) {
                                console.log("parametros asociados:", etapa.parametros);

                                // Accede a los parametros asociados a cada etapa
                                for (const parametro of etapa.parametros) {
                                    // console.log("ValorMinimo del parametro:", parametro.ValorMinimo);
                                    // console.log("ValorMaximo del parametro:", parametro.ValorMaximo);
                                    // console.log("valorAnterior del parametro:", parametro.valorAnterior);
                                    // console.log("limiteParticipacion del parametro:", parametro.limiteParticipacion);
                                }
                            } else {
                                // console.log("No hay parametros asociados con esta etapa.");
                            }
                        }


                        for (const campania of campanasActivasEnc) {
                            // Obtener las etapas de la campaña
                            const transaccionesValidas = await transaccionesValidasCampanasFusionL(campania.id);

                            // Iterar sobre los Participantes y mostrar su id
                            if (transaccionesValidas && transaccionesValidas.Participantes) {
                                for (const Participante of transaccionesValidas.Participantes) {
                                    // console.log("Información de Participante:", Participante);
                                    // console.log("Información del id del Participante:", Participante.id);
                                }
                            } else {
                                // console.log("No hay Participantes asociados con esta campaña.");
                            }
                        }


                        for (const campania of campanasActivasEnc) {
                            // Obtener las etapas de la campaña
                            const transaccionesValidas = await transaccionesValidasCampanasFusionL(campania.id);

                            // Iterar sobre las participaciones y mostrar las transacciones asociadas
                            for (const participacion of transaccionesValidas.participaciones) {
                                console.log("Información de la participación:", participacion);

                                // Verifica si las transacciones se están cargando correctamente
                                if (participacion && participacion.Transaccions) {
                                    console.log("Transacciones asociadas:", participacion.Transaccions);

                                    // Acceder a las transacciones asociadas a cada participación
                                    for (const transaccion of participacion.Transaccions) {
                                        console.log("idColumna de la transacción:", transaccion.idColumna);
                                    }
                                } else {
                                    console.log("No hay transacciones asociadas con esta participación.");
                                }
                            }
                        }

                        for (const campania of campanasActivasEnc) {
                            // Obtener las etapas de la campaña
                            const transaccionesValidas = await transaccionesValidasCampanasFusionL(campania.id);

                            // Iterar sobre las participaciones y mostrar las transacciones asociadas
                            for (const participacion of transaccionesValidas.participaciones) {
                                console.log("Información de la participación:", participacion);

                                // Verifica si las transacciones se están cargando correctamente
                                if (participacion && participacion.Transaccions) {
                                    console.log("Transacciones asociadas:", participacion.Transaccions);

                                    // Acceder a las transacciones asociadas a cada participación
                                    for (const transaccion of participacion.Transaccions) {
                                        console.log("idColumna de la transacción:", transaccion.idColumna);
                                    }
                                } else {
                                    console.log("No hay transacciones asociadas con esta participación.");
                                }
                            }
                        }

                        // Accede a la columna idColumna de Transaccion

                    }
                    for (const campania of campanasActivasEnc) {

                        const departamento = await GetcampanasActivasById(campania.id);

                        for (const etapa of departamento.etapas) {

                            for (const presupuesto of etapa.presupuestos) {
                                console.log("IdDepartamento del presupuesto:", presupuesto.idDepartamento);
                            }
                        }
                    }

                }

                // const idUsuarioParticipante = req.res.idUsuarioParticipante || req.params.idUsuarioParticipante;

                // for (const campania of campanasActivasEnc) {
                //     console.log(`Procesando campaña: ${campania.id}`);
                //     try {
                //         const notificacionData = await tienePremiosPendientesCampanas(campania.id, idUsuarioParticipante);
                //         console.log(`Datos de notificación para la campaña ${campania.id}:`, notificacionData);

                //         let notificacion = 0;
                //         // let urlnotificacion = '';
                //         let descripcionCampania = `${campania.tituloNotificacion}\n${campania.descripcionNotificacion}`;

                //         if (notificacionData) {
                //             notificacion = 1;
                //             // urlnotificacion = notificacionData.link;
                //         }

                //         let contadorYaLlevo = 0;
                //         let contadorParametros = 0;
                //         if (minimoTransacciones > 0 && segundoFiltroTransacciones.length === minimoTransacciones) {
                //             contadorYaLlevo = minimoTransacciones;
                //             contadorParametros = minimoTransacciones;
                //         }

                //         const dataAgregar = {
                //             idCampania: campania.id,
                //             nombreCampana: campania.nombre,
                //             descripcion: descripcionCampania,
                //             tipoParticipacion: campania.tipoParticipacion,
                //             notificacion: notificacion,
                //             urlNotificacion: urlnotificacion,
                //             tituloNotificacion: campania.tituloNotificacion,
                //             descripcionNotificacion: campania.descripcionNotificacion,
                //             infoAdd: -1, // Asumiendo que infoAdd se ajusta en otra parte
                //             mistransacciones: contadorYaLlevo,
                //             transacciones: contadorParametros,
                //             imgAkisi: campania.imgAkisi,
                //             imgPush: campania.imgPush,
                //             // botones: [] // Asumiendo que botones se manejan en otra parte
                //         };

                //         retorno.push(dataAgregar);
                //     } catch (error) {
                //         // console.error(`Error processing campaign ${campania.id}: ${error.message}`);
                //         // Considerar si continuar con el siguiente o detener el proceso
                //     }
                // }






                // res.json(campanasActivasEnc);
                // res.json(campaniasFiltradas.filter(campania => campania !== null));
                // return res.json(campaniasFiltradas.filter(campania => campania !== null));
                // res.json(retorno);
            } else {
                res.status(404).json({ message: "No se encontró ningún usuario con este referens." });
            }
        } else {
            res.status(404).json({ message: "No se encontró ningún usuario con este referens." });
        }
    } catch (error) {
        console.error("Error en generaCampanasUsuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


const campanasUsuariosEmulador_get = async (req, res) => {
    try {
        const { telefono } = req.params;
        console.log("Número de teléfono:", telefono);

        const referens = await pronet.query(
            `SELECT customer_reference 
            FROM pronet.tbl_customer 
            WHERE telno = :telefono ;`,
            {
                replacements: { telefono },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        console.log("Resultado de la consulta teléfono:", referens);

        if (!referens || referens.length === 0) {
            // Si no se encuentra el referens, envía el mensaje por defecto.
            return res.status(200).json({
                textoSinInfo: 'Estamos trabajando para traerte más promociones.',
                promociones: []
            });
        } else {
            // Si se encuentra el referens, procede con la generación de campañas.
            const { customer_reference } = referens[0];
            const respData = await generaCampanasUsuarios({ params: { referens: customer_reference } }, res);
            return res.status(200).json(respData);
        }
    }
    catch (error) {
        console.error("Error en campanasUsuariosEmulador_get:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error interno del servidor." });
        }
    }
};

const transaccionesValidasCampanasFusion = async (idCampania) => {
    // const { idCampania } = req.params;

    try {
        const query = `
            SELECT 
                dcp.valorMinimo, 
                dcp.valorMaximo, 
                dcp.idTipoParticipacion, 
                dcp.limiteParticipacion, 
                dcp.tipoTransaccion, 
                t.descripcion, 
                cs.nombre, 
                dcp.id
            FROM lealtadv2.participacions dcp 
            INNER JOIN lealtadv2.transaccions t ON t.id = dcp.idTransaccion 
            INNER JOIN lealtadv2.columnas cs ON cs.id = t.idColumna  
            WHERE idCampania = :idCampania AND tipoTransaccion = 't' AND dcp.estado = 1
            UNION ALL
            SELECT 
                dcp.valorMinimo, 
                dcp.valorMaximo, 
                dcp.idTipoParticipacion, 
                dcp.limiteParticipacion,
                dcp.tipoTransaccion, 
                t.descripcion, 
                cs.nombre,
                dcp.id
            FROM lealtadv2.participacions dcp 
            INNER JOIN lealtadv2.categoria AS dc ON dc.id = dcp.idTransaccion
            INNER JOIN lealtadv2.transaccions AS t ON t.id = dcp.idTransaccion 
            INNER JOIN lealtadv2.columnas cs ON cs.id = t.idColumna 
            WHERE dcp.idCampania = :idCampania AND tipoTransaccion = 'c' AND dcp.estado = 1  
            GROUP BY dcp.valorMinimo, dcp.valorMaximo, dcp.idTipoParticipacion, dcp.tipoTransaccion, t.descripcion, cs.nombre, dcp.id
        `;

        const transacciones = await sequelize.query(query, {
            replacements: { idCampania: idCampania },
            type: Sequelize.QueryTypes.SELECT
        });

        // return res.status(200).json(transacciones);
        return transacciones;
    } catch (error) {
        console.error("Error al obtener transacciones válidas de la campaña:", error);
        throw error;
        // return res.status(500).json({ message: 'Error al obtener transacciones válidas de la campaña' });
    }
};

const actualizarParticipantesRestantes = async (idCampania, idDepto, idMuni) => {
    // const { idCampania, idDepto, idMuni } = req.params;

    try {
        const resultado = await Departamento.update({
        }, {
            where: {
                idCampania,
                idDepartamento: idDepto,
                idMunicipio: idMuni,
                estado: 1
            }
        });

        if (resultado > 0) {
            // return res.json({ status: 201, message: 'Datos actualizados exitosamente' });
        } else {
            return res.status(404).json({ status: 400, message: 'No se encontraron registros para actualizar' });
        }
    } catch (error) {
        console.error("Error al actualizar participantes restantes:", error);
        // return res.status(500).json({ message: 'Internal server error' });
    }
};



//obtener todas las campañas activas que pertenecen a terceros.
async function campanasActualesActivasTercero(res, req) {
    try {
        const campanias = await Campania.findAll({
            where: {
                estado: 1,
                fechaFin: { [Op.gte]: new Date() },
                fechaInicial: { [Op.lte]: new Date() },
                terceros: 1,
            },
            order: [['fechaCreacion', 'DESC']],
        });

        return campanias;
    } catch (error) {
        console.error("Error en campanasActualesActivasTercero:", error);
        throw error;
    }
}

const transaccionesValidasCampania = async (idCampania) => {
    // const { idCampania } = req.params;

    try {
        const transacciones = await Parametro.findAll({
            include: [{
                model: Transaccion,
                required: true  // solo si deseas que la consulta SQL use INNER JOIN
            }],
            where: { idCampania: idCampania }
        });

        // return res.status(200).json(transacciones);
        return transacciones;
    } catch (error) {
        console.error("Error al obtener transacciones válidas de la campaña:", error);
        // return res.status(500).json({ message: 'Error al obtener transacciones válidas de la campaña' });
        throw error;
    }
};


const regionesValidasCampania = async (idCampania) => {
    try {
        if (!idCampania) {
            console.error('idCampania no está definido.');
            return []; // Retorna un arreglo vacío o maneja el error como prefieras
        }
        // const idCampania = req.params.idCampania;

        const regionesValidas = await CampaniaRegiones.findAll({
            where: {
                idCampania: idCampania,
                estado: 1,
            },
            include: [
                {
                    model: Departamento,
                    as: 'departamento',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Municipio,
                    as: 'municipio',
                    attributes: ['id', 'nombre'],
                    where: {
                        // idDepartamento: sequelize.col('CampaniaRegiones.idDepartamento')
                        idDepartamento: sequelize.col('departamento.id')
                    }
                },
            ],
            attributes: ['idDepartamento', 'idMunicipio', 'limites', 'listos', 'id']
        });
        // res.json(regionesValidas);
        return regionesValidas;
    } catch (error) {
        console.error("Error en regionesValidasCampana:", error);
        throw error;
    }
};


const validarParticipacionesRestantes = async (idCampania, idDepto, idMuni) => {
    // const { idCampania, idDepto, idMuni } = req.params;

    try {
        const espacio = await CampaniaRegiones.count({
            where: {
                idCampania: idCampania,
                idDepartamento: idDepto,
                idMunicipio: idMuni,
                estado: 1,
                limites: {
                    [Sequelize.Op.gt]: Sequelize.col('listos')
                }
            }
        })

        // return res.status(200).json({ espacio: espacio });
        return { espacio: espacio };
    } catch (error) {
        console.error('Error al validar los participantes restantes:', error);
        // return res.status(500).json({ error: 'Error al validar los participantes restantes' });
        throw error;
    };
}



const campanasRevisionGeneral = async (req, res) => {

    try {
        const campaniasTipo1y3 = await Campania.findAll({
            attributes: ['id', 'fechaInicio', 'fechaFin', 'fechaRegistro', 'edadInicial', 'edadFinal', 'tipoUsuario', 'sexo', 'nombre', 'tituloNotificacion', 'descripcionNotificacion'],
            where: {
                tipoUsuario: {
                    [Op.in]: [1, 3]
                },
                estado: '1',
                fechaFin: {
                    [Op.gte]: Sequelize.literal('CAST(NOW() AS DATE)')
                }
            }
        });

        const campaniasTipo2y4y5 = await Campania.findAll({
            attributes: ['id', 'fechaInicio', 'fechaFin', 'fechaRegistro', 'edadInicial', 'edadFinal', 'tipoUsuario', 'sexo', 'nombre', 'tituloNotificacion', 'descripcionNotificacion'],
            where: {
                tipoUsuario: { [Op.in]: [2, 4, 5] },
                estado: '3',
                fechaFin: {
                    [Op.gte]: Sequelize.literal('CAST(NOW() AS DATE)')
                }
            }
        });

        const resultados = campaniasTipo1y3.concat(campaniasTipo2y4y5);
        return res.status(200).json(resultados);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las campañas' });
    }
}

const validarLimiteParticipacionesPorUsuario = async (idUsuarioParticipante, idCampania) => {
    // const idUsuarioParticipante = req.params.idUsuarioParticipante; // Asegúrate de que este parámetro está correctamente definido en la ruta
    // const idCampania = req.params.idCampania;

    const query = `
        SELECT SUM(participaHoy) AS totalParticipaciones
        FROM (
            SELECT COUNT(*) AS participaHoy 
            FROM lealtadv2.participacions
            WHERE idUsuarioParticipante = :idUsuarioParticipante
            AND idCampania = :idCampania
            AND CAST(fecha AS DATE) = CAST(now() AS DATE)
        ) AS sumar;
    `;

    try {
        const result = await sequelize.query(query, {
            replacements: { idUsuarioParticipante, idCampania },
            type: sequelize.QueryTypes.SELECT
        });

        const totalParticipaciones = result[0].totalParticipaciones || 0;
        // return res.status(200).json(totalParticipaciones); // Devuelve el total de participaciones como respuesta JSON
        return totalParticipaciones;
    } catch (error) {
        console.error('Error en validarLimiteParticipacionesPorUsuario:', error);
        // return res.status(500).json({ error: 'Error al obtener la limitación de participantes por usuario' });
        throw error;
    }
}

const TransaccionesDelUsuarioPendientesXcampana = async (idUsuarioParticipante, idParticipacion, fecha1, fecha2, idCampania) => {
    // const { idUsuarioParticipante, idParticipacion, fecha1, fecha2, idCampania } = req.params;

    try {

        const query = `
            SELECT *, CAST(fechaParticipacion AS DATE) AS solofecha
            FROM lealtadv2.campaniaadicional
            WHERE yaAplico = 1
            AND idParticipacion = :idParticipacion
            AND idUsuarioParticipante = :idUsuarioParticipante 
            AND (fechaParticipacion BETWEEN :fechaInicio AND :fechaFin)
            AND fechaParticipacion >= (
                SELECT fechaCreacion
                FROM campania
                WHERE id = :idCampania
            );
        `;
        const transacciones = await sequelize.query(query, {
            replacements: {
                idParticipacion,
                idUsuarioParticipante,
                fechaInicio: `${fecha1} 00:00:00`,
                fechaFin: `${fecha2} 23:59:59`,
                idCampania
            },
            type: sequelize.QueryTypes.SELECT
        });

        // Devuelve los resultados
        // return res.status(200).json(transacciones);
        return transacciones;
    } catch (error) {
        console.error('Error al obtener transacciones pendientes del usuario por campaña:', error);
        // return res.status(500).json({ error: 'Error al obtener transacciones pendientes del usuario por campaña:' });
        throw error;
    }
};

const cantidadParametros = async (idCampania) => {
    // const { idCampania } = req.params;

    try {

        const resultado = await Parametro.sum('limiteParticipacion', {
            where: { idCampania: idCampania }
        });

        // return res.status(200).json({ cantidad: resultado || 0 });
        return { cantidad: resultado || 0 };
    } catch (error) {
        console.error('Error al obtener la cantidad de parametros:', error);
        // return res.status(500).json({ error: 'Error interno del servidor' });
        throw error;
    }
};


const campaniaNumerosRestringidos = async (idCampania, numero, restringe) => {
    // const { idCampania, numero, restringe } = req.params;

    try {
        let permitido;
        const restringeParsed = parseInt(restringe);

        if (restringeParsed === 0) {
            permitido = 1; // Siempre permitido si restringe es 0
        } else {
            const count = await CampaniasNumeros.count({
                where: {
                    idCampania: idCampania,
                    numero: numero,
                    estado: 1
                }
            });

            if (restringeParsed === 1) {
                permitido = count; // Retorna el conteo directamente
            } else if (restringeParsed === 2) {
                permitido = count > 0 ? 0 : 1; // Retorna 0 si hay registros, 1 si no hay
            } else {
                permitido = 0; // Valor por defecto en caso de un parámetro no válido
            }
        }

        // return res.status(200).json({ permitido });
        return permitido;
    } catch (error) {
        console.error('Error al verificar números restringidos para la campaña:', error);
        // return res.status(500).json({ error: 'Error interno del servidor' });
        throw error;
    }
};

async function tienePremiosPendientesCampanas(idCampania, idUsuarioParticipante) {
    // const { idCampania, idUsuarioParticipante } = req.params;

    const query = `
        SELECT 
            DATE_FORMAT(ps.fecha, '%d%m%Y%H%i%s') AS fechaParticipacion, 
            ps.urlPremio, 
            p.link, 
            p.claveSecreta 
        FROM 
            lealtadv2.participacions ps 
        INNER JOIN 
            lealtadv2.offercraft_notifications a ON (a.url = ps.urlPremio) 
        INNER JOIN 
            lealtadv2.campania d ON (d.id = ps.idCampania) 
        INNER JOIN 
            lealtadv2.premios p ON (p.id = p.id) 
        JOIN 
            lealtadv2.equivalente_campanas e ON (e.id = a.id) 
        WHERE 
            d.id = :idCampania AND ps.idUsuarioParticipante = :idUsuarioParticipante
            AND a.fecha_uso > '2021-12-01 01:00:00' AND p.idTransaccion = 10 AND d.estado = 1 
            AND d.fechaFin >= CURDATE() AND ps.jugado IS NULL 
        LIMIT 1;
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { idCampania, idUsuarioParticipante },
            type: Sequelize.QueryTypes.SELECT
        });

        if (results && results.length > 0) {
            return results[0];
        } else {
            return null;
            // return res.status(404).json({ message: "No se encontró ningún premio pendiente." });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        throw error;
        // return res.status(500).json({ message: 'Error interno del servidor' });
    }
}


async function campanasRevisionGeneralIdCampana(id) {
    // const { id } = req.params; 

    let query = `
        SELECT 
            id, 
            tipoParticipacion, 
            fechaInicio, 
            fechaFin, 
            fechaRegistro, 
            edadInicial, 
            edadFinal, 
            tipoUsuario, 
            sexo, 
            nombre, 
            tipoPremio, 
            tituloNotificacion, 
            descripcionNotificacion, 
            maximoParticipaciones, 
            minimoTransacciones, 
            minimoAcumular 
        FROM 
            lealtadv2.campania
        WHERE 
            tipoParticipacion IN (1,3) AND id = :idCampania AND fechaFin >= CAST(NOW() as date) 
        UNION ALL 
        SELECT 
            id, 
            tipoParticipacion, 
            fechaInicio, 
            fechaFin, 
            fechaRegistro, 
            edadInicial, 
            edadFinal, 
            tipoUsuario, 
            sexo, 
            nombre, 
            tipoPremio, 
            tituloNotificacion, 
            descripcionNotificacion, 
            maximoParticipaciones,
            minimoTransacciones, 
            minimoAcumular 
        FROM 
            lealtadv2.campania 
        WHERE 
            tipoParticipacion IN (2,4,5) AND id = :idCampania AND fechaFin >= CAST(NOW() as date);
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { idCampania: id },
            type: Sequelize.QueryTypes.SELECT
        });
        // res.status(200).json(results);
        return results[0];
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        // res.status(500).json({ message: 'Error interno del servidor' });
        throw error;
    }
}

async function CampanasBotonesAppMostrar(idCampania) {
    // const { idCampania } = req.params;
    let query = `
        SELECT t.idBotton 
        FROM campania ec 
        JOIN participacions dcp ON dcp.idCampania = ec.id 
        JOIN transaccions t ON t.id = dcp.idTransaccion 
        WHERE ec.id = :idCampania
        GROUP BY t.idBotton 
        UNION ALL 
        SELECT t.idBotton 
        FROM campania ec 
        JOIN participacions dcp ON dcp.idCampania = ec.id
        JOIN lealtadv2.categoria dct ON dct.id = dcp.idTransaccion AND dcp.tipoTransaccion = 'c' 
        JOIN transaccions t ON t.id = dct.idTransaccion 
        WHERE ec.id = :idCampania AND dct.estado = 1 
        GROUP BY t.idBotton;
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { idCampania },
            type: Sequelize.QueryTypes.SELECT
        });
        // return res.status(200).json(results);
        return results;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        // return res.status(500).json({ message: 'Error interno del servidor' });
        throw error;
    }
}


// esto es para mostrar en caso de que pidan avanzes
const GetNumeroById = async (req, res) => {
    try {
        const { telefono } = req.params;
        console.log("Número de teléfono recibido:", telefono);

        const envio = await EnviaPremio.findOne({
            where: {
                telefono: telefono,
                estado: 1,
            },
            include: [{
                model: Campania,
                as: 'campaign',
                attributes: ['nombre']
            }]
        });


        return res.json(envio);
    } catch (error) {
        console.error('Error al obtener la campania:', error);
        // Enviar una respuesta de error si ocurre algún problema
        return res.status(403).send({ errors: 'Ha ocurrido un error al obtener la campania.' });
    }
};


module.exports = {

    // generaCampanasUsuarios,
    campanasUsuariosEmulador_get,
    // tienePremiosPenditesCampanas,
    validarLimiteParticipacionesPorUsuario,
    // validarParticipacionesRestantes,
    // CampanasBotonesAppMostrar,
    // campanasRevisionGeneralIdCampana,
    // TransaccionesDelUsuarioPendientesXcampana,
    campaniaNumerosRestringidos,
    // transaccionesValidasCampania,
    // cantidadParametros,
    // campanasRevisionGeneral,
    regionesValidasCampania,
    // campanasActualesActivasTercero,
    // actualizarParticipantesRestantes,
    // campanasActualesActivas,
    // transaccionesValidasCampanasFusion, 
    // transaccionesValidasCampanasFusionL,
    // DeleteEnvio,
    // GetNumeroById,

}