const { Op, Sequelize } = require('sequelize');
const { asignarCategoria } = require('../models/asignarCategoria');
const { Campania } = require('../models/campanias');
const { Etapa } = require('../models/etapa');
const { Parametro } = require('../models/parametro');
const { Participacion } = require('../models/Participacion');
const { Participantes } = require('../models/participantes');
const { PremioCampania } = require('../models/premioCampania');
const { Presupuesto } = require('../models/presupuesto');
const { Transaccion } = require('../models/transaccion');
const { Bloqueados } = require('../models/bloqueados');
const { sequelize } = require('../database/database');


const AddCampania = async(req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            nombre,
            descripcion,
            fechaCreacion,
            fechaRegistro,
            fechaInicio,
            fechaFin,
            edadInicial,
            edadFinal,
            sexo,
            tipoUsuario,
            tituloNotificacion,
            descripcionNotificacion,
            imgPush,
            imgAkisi,
            estado,
            maximoParticipaciones,
            campaniaTerceros,
            terminosCondiciones,
            observaciones,
            esArchivada,
            restriccionUser,
            idProyecto,
            etapas,
            bloqueados,
            participacion,
            emails,
            ultimoCorreoEnviado
        } = req.body;




        const newCampains = await Campania.create({
            nombre,
            descripcion,
            fechaCreacion,
            fechaRegistro,
            fechaInicio,
            fechaFin,
            edadInicial,
            edadFinal,
            sexo,
            tipoUsuario,
            tituloNotificacion,
            descripcionNotificacion,
            imgPush,
            imgAkisi,
            estado,
            maximoParticipaciones,
            campaniaTerceros,
            terminosCondiciones,
            observaciones,
            esArchivada,
            restriccionUser,
            idProyecto,
            emails,
            ultimoCorreoEnviado
        }, { transaction });

        const { id } = newCampains.dataValues;

        const etapaData = etapas.map(etapa => ({
            ...etapa,
            idCampania: id,
            periodo: etapa.periodo ? parseInt(etapa.periodo) : null,
            intervalo: etapa.intervalo ? parseInt(etapa.intervalo) : null,
            intervaloSemanal: etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null,
            intervaloMensual: etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null,
            valorAcumulado: etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null
        }));
        const nuevaEtapa = await Etapa.bulkCreate(etapaData, { transaction });

        const etapasConId = nuevaEtapa.map((etapa, index) => ({
            ...etapas[index],
            id: etapa.id,
        }));

        const parametrosData = etapasConId.flatMap(etapa => etapa.parametros.map(parametros => ({...parametros, idEtapa: etapa.id })));
        await Parametro.bulkCreate(parametrosData, { transaction });

        const presupuestoData = etapasConId.flatMap(etapa => etapa.presupuesto.map(presupuesto => ({...presupuesto, idEtapa: etapa.id })));
        await Presupuesto.bulkCreate(presupuestoData, { transaction });

        const premioData = etapasConId.flatMap(etapa => etapa.premio.map(premio => ({...premio, idEtapa: etapa.id })));
        await PremioCampania.bulkCreate(premioData, { transaction });

        if (bloqueados) {
            const bloqueoData = bloqueados.map(bloqueo => ({...bloqueo, idCampania: id }));
            await Bloqueados.bulkCreate(bloqueoData, { transaction });
        }

        if (participacion) {
            const participacionData = participacion.map(participacion => ({...participacion, idCampania: id }));
            await Participantes.bulkCreate(participacionData, { transaction });
        }

        await transaction.commit();
        res.json({ code: 'ok', message: 'Campaña creada con exito' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la campaña:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar crear la campaña', details: error.message });
    }
}



const CheckNombreCampaña = async(req, res) => {
    try {
        const { nombre } = req.body;
        const existingCampaña = await Campania.findOne({
            where: { nombre }
        });
        if (existingCampaña) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error al verificar el nombre de la campaña:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar verificar el nombre de la campaña' });
    }
};




const GetCampania = async(req, res) => {
    try {
        const campanias = await Campania.findAll({
            where: {
                estado: [1, 2, 3]
            },
            include: [{
                    model: Etapa,
                    include: [
                        { model: Parametro, attributes: { exclude: ['idCampania'] } },
                        { model: Presupuesto },
                        { model: PremioCampania }
                    ]
                },
                { model: Bloqueados },
                { model: Participantes }
            ]
        });

        res.json(campanias);
    } catch (error) {
        res.status(500).json({ error: 'Ha sucedido un error al intentar ver la campaña', details: error.message });
    }
};

// const UpdateCampania = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const {
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             etapas,
//             bloqueados,
//             participacion,
//             emails,
//             ultimoCorreoEnviado
//         } = req.body;



//         const campania = await Campania.findByPk(id, { transaction });
//         if (!campania) {
//             throw new Error('La campaña no existe');
//         }

//         await campania.update({
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi ,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             emails,
//             ultimoCorreoEnviado
//         }, { transaction });

//         if (Array.isArray(etapas)) {
//             for (const etapa of etapas) {
//                 const [etapaInstancia, etapaCreada] = await Etapa.findOrCreate({
//                     where: { id: etapa.id },
//                     defaults: {
//                         idCampania: id,
//                         periodo: etapa.periodo ? parseInt(etapa.periodo) : null,
//                         intervalo: etapa.intervalo ? parseInt(etapa.intervalo) : null,
//                         intervaloSemanal: etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null,
//                         intervaloMensual: etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null,
//                         valorAcumulado: etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null
//                     },
//                     transaction
//                 });

//                 if (!etapaCreada) {
//                     await etapaInstancia.update({
//                         idCampania: id,
//                         periodo: etapa.periodo ? parseInt(etapa.periodo) : null,
//                         intervalo: etapa.intervalo ? parseInt(etapa.intervalo) : null,
//                         intervaloSemanal: etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null,
//                         intervaloMensual: etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null,
//                         valorAcumulado: etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null
//                     }, { transaction });
//                 }

//                 if (Array.isArray(etapa.parametros)) {
//                     for (const parametro of etapa.parametros) {
//                         await Parametro.upsert({ ...parametro, idEtapa: etapaInstancia.id }, { transaction });
//                     }
//                 }

//                 if (Array.isArray(etapa.presupuestos)) {
//                     for (const presupuesto of etapa.presupuestos) {
//                         await Presupuesto.upsert({ ...presupuesto, idEtapa: etapaInstancia.id }, { transaction });
//                     }
//                 }

//                 if (Array.isArray(etapa.premiocampania)) {
//                     for (const premio of etapa.premiocampania) {
//                         await PremioCampania.upsert({ ...premio, idEtapa: etapaInstancia.id }, { transaction });
//                     }
//                 }
//             }
//         }

//         if (Array.isArray(bloqueados)) {
//             for (const bloqueo of bloqueados) {
//                 await Bloqueados.upsert({ ...bloqueo, idCampania: id }, { transaction });
//             }
//         }

//         if (Array.isArray(participacion)) {
//             for (const participante of participacion) {
//                 await Participantes.upsert({ ...participante, idCampania: id }, { transaction });
//             }
//         }

//         await transaction.commit();

//         const campaniaActualizada = await Campania.findByPk(id, {
//             include: [
//                 {
//                     model: Etapa,
//                     include: [
//                         { model: Parametro, attributes: { exclude: ['idCampania'] } },
//                         { model: Presupuesto },
//                         { model: PremioCampania }
//                     ]
//                 },
//                 { model: Bloqueados },
//                 { model: Participantes }
//             ]
//         });

//         res.json({ code: 'ok', message: 'Campaña actualizada con éxito', data: campaniaActualizada });
//     } catch (error) {
//         if (transaction.finished !== 'commit') {
//             await transaction.rollback();
//         }
//         console.error('Error al actualizar la campaña:', error);
//         res.status(500).json({ error: 'Ha sucedido un error al intentar actualizar la campaña', details: error.message });
//     }
// };




//esta de abajo es prueva 

// const UpdateCampania = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const {
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             etapas,
//             bloqueados,
//             participacion,
//             emails,
//             ultimoCorreoEnviado
//         } = req.body;

//         const campania = await Campania.findByPk(id, { transaction });
//         if (!campania) {
//             throw new Error('La campaña no existe');
//         }

//         await campania.update({
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             emails,
//             ultimoCorreoEnviado
//         }, { transaction });

//         const etapaData = etapas.map(etapa => ({
//             ...etapa,
//             idCampania: id,
//             periodo: etapa.periodo ? parseInt(etapa.periodo) : null,
//             intervalo: etapa.intervalo ? parseInt(etapa.intervalo) : null,
//             intervaloSemanal: etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null,
//             intervaloMensual: etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null,
//             valorAcumulado: etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null
//         }));

//         const nuevasEtapas = await Etapa.bulkCreate(etapaData, { transaction });

//         for (let nuevaEtapa of nuevasEtapas) {
//             const parametrosData = nuevaEtapa.parametros.map(parametro => ({ ...parametro, idEtapa: nuevaEtapa.id }));
//             await Parametro.bulkCreate(parametrosData, { transaction });

//             const presupuestoData = nuevaEtapa.presupuesto.map(presupuesto => ({ ...presupuesto, idEtapa: nuevaEtapa.id }));
//             await Presupuesto.bulkCreate(presupuestoData, { transaction });

//             const premioData = nuevaEtapa.premio.map(premio => ({ ...premio, idEtapa: nuevaEtapa.id }));
//             await PremioCampania.bulkCreate(premioData, { transaction });
//         }

//         if (bloqueados) {
//             const bloqueoData = bloqueados.map(bloqueo => ({ ...bloqueo, idCampania: id }));
//             await Bloqueados.bulkCreate(bloqueoData, { transaction });
//         }

//         if (participacion) {
//             const participacionData = participacion.map(participacion => ({ ...participacion, idCampania: id }));
//             await Participantes.bulkCreate(participacionData, { transaction });
//         }

//         await transaction.commit();
//         res.json({ code: 'ok', message: 'Campaña creada con éxito' });
//     } catch (error) {
//         await transaction.rollback();
//         console.error('Error al crear la campaña:', error);
//         res.status(500).json({ error: 'Ha sucedido un error al intentar crear la campaña', details: error.message });
//     }
// }




//esta es otra prueva

// const UpdateCampania = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const {
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             etapas = [],  // Asegúrate de que etapas siempre sea un array
//             bloqueados,
//             participacion,
//             emails,
//             ultimoCorreoEnviado
//         } = req.body;

//         // Verifica si la campaña existe
//         const campania = await Campania.findByPk(id, { transaction });
//         if (!campania) {
//             throw new Error('La campaña no existe');
//         }

//         // Actualiza la campaña
//         await campania.update({
//             nombre,
//             descripcion,
//             fechaCreacion,
//             fechaRegistro,
//             fechaInicio,
//             fechaFin,
//             edadInicial,
//             edadFinal,
//             sexo,
//             tipoUsuario,
//             tituloNotificacion,
//             descripcionNotificacion,
//             imgPush,
//             imgAkisi,
//             estado,
//             maximoParticipaciones,
//             campaniaTerceros,
//             terminosCondiciones,
//             observaciones,
//             esArchivada,
//             restriccionUser,
//             idProyecto,
//             emails,
//             ultimoCorreoEnviado
//         }, { transaction });

//         // Procesa las etapas
//         const idsEtapasExistentes = etapas
//             .filter(etapa => etapa.id) // Etapas con ID (existentes)
//             .map(etapa => etapa.id);

//         // Actualiza estado de las etapas existentes
//         if (idsEtapasExistentes.length > 0) {
//             await Etapa.update(
//                 { estado: 0 },
//                 {
//                     where: {
//                         id: idsEtapasExistentes,
//                         idCampania: id
//                     },
//                     transaction
//                 }
//             );
//         }

//         // Crea nuevas etapas
//         const nuevasEtapas = etapas
//             .filter(etapa => !etapa.id) // Etapas nuevas
//             .map(etapa => ({
//                 ...etapa,
//                 idCampania: id,
//                 periodo: etapa.periodo ? parseInt(etapa.periodo) : null,
//                 intervalo: etapa.intervalo ? parseInt(etapa.intervalo) : null,
//                 intervaloSemanal: etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null,
//                 intervaloMensual: etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null,
//                 valorAcumulado: etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null
//             }));

//         // Crear etapas y obtener datos de las etapas creadas
//         const etapasCreadas = await Etapa.bulkCreate(nuevasEtapas, { returning: true, transaction });

//         // Procesar cada etapa creada para agregar parámetros, presupuestos y premios
//         for (let nuevaEtapa of etapasCreadas) {
//             // Crear parámetros de la etapa
//             const parametrosData = nuevaEtapa.parametros ? nuevaEtapa.parametros.map(parametro => ({
//                 ...parametro,
//                 idEtapa: nuevaEtapa.id
//             })) : [];
//             await Parametro.bulkCreate(parametrosData, { transaction });

//             // Crear presupuestos de la etapa
//             const presupuestoData = nuevaEtapa.presupuesto ? nuevaEtapa.presupuesto.map(presupuesto => ({
//                 ...presupuesto,
//                 idEtapa: nuevaEtapa.id
//             })) : [];
//             await Presupuesto.bulkCreate(presupuestoData, { transaction });

//             // Crear premios de la etapa
//             const premioData = nuevaEtapa.premio ? nuevaEtapa.premio.map(premio => ({
//                 ...premio,
//                 idEtapa: nuevaEtapa.id
//             })) : [];
//             await PremioCampania.bulkCreate(premioData, { transaction });
//         }

//         // Manejar bloqueados
//         if (bloqueados) {
//             const bloqueoData = bloqueados.map(bloqueo => ({ ...bloqueo, idCampania: id }));
//             await Bloqueados.bulkCreate(bloqueoData, { transaction });
//         }

//         // Manejar participaciones
//         if (participacion) {
//             const participacionData = participacion.map(participacion => ({ ...participacion, idCampania: id }));
//             await Participantes.bulkCreate(participacionData, { transaction });
//         }

//         await transaction.commit();
//         res.json({ code: 'ok', message: 'Campaña actualizada con éxito' });
//     } catch (error) {
//         await transaction.rollback();
//         console.error('Error al actualizar la campaña:', error);
//         res.status(500).json({ error: 'Ha sucedido un error al intentar actualizar la campaña', details: error.message });
//     }
// }










const UpdateCampania = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            fechaCreacion,
            fechaRegistro,
            fechaInicio,
            fechaFin,
            edadInicial,
            edadFinal,
            sexo,
            tipoUsuario,
            tituloNotificacion,
            descripcionNotificacion,
            imgPush,
            imgAkisi,
            estado,
            maximoParticipaciones,
            campaniaTerceros,
            terminosCondiciones,
            observaciones,
            esArchivada,
            restriccionUser,
            idProyecto,
            etapas,
            bloqueados,
            participacion,
            emails,
            ultimoCorreoEnviado
        } = req.body;

        const campania = await Campania.findByPk(id, { transaction });
        if (!campania) {
            throw new Error('La campaña no existe');
        }

        await campania.update({
            nombre,
            descripcion,
            fechaCreacion,
            fechaRegistro,
            fechaInicio,
            fechaFin,
            edadInicial,
            edadFinal,
            sexo,
            tipoUsuario,
            tituloNotificacion,
            descripcionNotificacion,
            imgPush,
            imgAkisi,
            estado,
            maximoParticipaciones,
            campaniaTerceros,
            terminosCondiciones,
            observaciones,
            esArchivada,
            restriccionUser,
            idProyecto,
            emails,
            ultimoCorreoEnviado
        }, { transaction });

        if (etapas.length === 1 && etapas[0].id) {
            // Si solo viene una etapa y trae id, se guarda tal como viene
            const singleEtapa = etapas[0];
            await Etapa.update(singleEtapa, { where: { id: singleEtapa.id }, transaction });

        } else {
            // Si vienen más de una etapa, actualizar etapas existentes y crear nuevas etapas
            for (let etapa of etapas) {
                if (etapa.id) {
                    // Actualizar etapa existente
                    await Etapa.update(etapa, { where: { id: etapa.id, idCampania: id }, transaction });
                } else {
                    // Crear nueva etapa
                    etapa.idCampania = id;
                    etapa.periodo = etapa.periodo ? parseInt(etapa.periodo) : null;
                    etapa.intervalo = etapa.intervalo ? parseInt(etapa.intervalo) : null;
                    etapa.intervaloSemanal = etapa.intervaloSemanal ? parseInt(etapa.intervaloSemanal) : null;
                    etapa.intervaloMensual = etapa.intervaloMensual ? parseInt(etapa.intervaloMensual) : null;
                    etapa.valorAcumulado = etapa.valorAcumulado ? parseInt(etapa.valorAcumulado) : null;
                    const nuevaEtapa = await Etapa.create(etapa, { transaction });

                    const parametrosData = etapa.parametros.map(parametro => ({ ...parametro, idEtapa: nuevaEtapa.id }));
                    await Parametro.bulkCreate(parametrosData, { transaction });

                    const presupuestoData = etapa.presupuesto.map(presupuesto => ({ ...presupuesto, idEtapa: nuevaEtapa.id }));
                    await Presupuesto.bulkCreate(presupuestoData, { transaction });

                    const premioData = etapa.premio.map(premio => ({ ...premio, idEtapa: nuevaEtapa.id }));
                    await PremioCampania.bulkCreate(premioData, { transaction });
                }
            }
        }

        if (bloqueados) {
            const bloqueoData = bloqueados.map(bloqueo => ({ ...bloqueo, idCampania: id }));
            await Bloqueados.bulkCreate(bloqueoData, { transaction });
        }

        if (participacion) {
            const participacionData = participacion.map(participacion => ({ ...participacion, idCampania: id }));
            await Participantes.bulkCreate(participacionData, { transaction });
        }

        await transaction.commit();
        res.json({ code: 'ok', message: 'Campaña actualizada con éxito' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar la campaña:', error);
        res.status(500).json({ error: 'Ha sucedido un error al intentar actualizar la campaña', details: error.message });
    }
};




// const GetcampanasActivasById = async(req, res) => {
//     try {
//         const { id } = req.params;
//         const etapa = await Campania.findByPk(id, {
//             where: { estado: 1 },
//             include: [{
//                     model: Etapa,
//                     include: [
//                         { model: Parametro, attributes: { exclude: ['idCampania'] } },
//                         { model: PremioCampania },
//                         { model: Presupuesto }
//                     ]
//                 },
//                 { model: Participantes },
//                 { model: Bloqueados }

//             ]
//         });


//         res.json(etapa);

//     } catch (error) {
//         res.status(403)
//         res.send({ errors: 'Ha sucedido un  error al intentar consultar la Campaña.', details: error.message });
//     }
// }

const GetcampanasActivasById = async (req, res) => {
    try {
        const { id } = req.params;
        const etapa = await Campania.findByPk(id, {
            include: [
                {
                    model: Etapa,
                    where: { estado: 1 },
                    include: [
                        { model: Parametro, attributes: { exclude: ['idCampania'] } },
                        { model: PremioCampania },
                        { model: Presupuesto }
                    ]
                },
                { model: Participantes },
                { model: Bloqueados }
            ]
        });

        res.json(etapa);
    } catch (error) {
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar consultar la Campaña.', details: error.message });
    }
};



const PausarCampaña = async(req, res) => {

    try {

        const { id } = req.params;

        await Campania.update({
            estado: 2
        }, {

            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Promocion pausada con exito' })

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar pausar la Campaña.' });

    }
}



const inabilitarEtapa = async(req, res) => {

    try {

        const { id } = req.params;

        await Etapa.update({
            estado: 0
        }, {

            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Etapa inabilitada con exito' })

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar inabilitar la Etapa.' });

    }
}

const ActivarCampaña = async(req, res) => {

    try {

        const { id } = req.params;

        await Campania.update({
            estado: 1
        }, {

            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Campania activada con exito' })

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar activar la Campaña.' });

    }
}

const DeleteCampania = async(req, res) => {

    try {

        const { id } = req.params;

        await Campania.update({
            estado: 0
        }, {

            where: {
                id: id
            }

        })

        res.json({ code: 'ok', message: 'Campinia deshabilitada con exito' });

    } catch (error) {

        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar deshabilitar la campaña.' });

    }

}


const GetcampanasActivas = async(req, res) => {
    try {
        const trx = await Campania.findAll({
            where: {
                estado: [1, 2, 3]
            }
        });

        res.json(trx)

    } catch (error) {
        console.error(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de las categorias.' });
    }

}

const TestearTransaccion = async(req, res) => {
    try {
        const campanias = await Campania.findAll({
            include: [{
                model: Etapa,
                include: [{
                        model: Parametro
                    },
                    {
                        model: Presupuesto
                    },
                    {
                        model: PremioCampania
                    }
                ]
            }],
            where: {
                estado: 1,
            }
        });




        const datosPersonales = {
            nombre: 'Jorge Manuel Alvarez Molina',
            sexo: 1,
            tipoUsuario: 1,
            profesion: 1,
            fechaNacimineto: '1998-07-23',
            fechaRegistro: new Date(2023, 1, 31),
        }



        let result = [];


        for (const element of campanias) {
            let enviaPremio = true;

            const datosCampania = {
                nombre: element.nombre,
                descripcion: element.descripcion
            }




            const { etapas } = element;
            const etapaActual = 1;
            const dataEtapaActual = etapas.find(item => item.orden === etapaActual);
            const { parametros, presupuestos, premioCampania: premios } = dataEtapaActual;

            const validacionPresupuesto = {
                validacion: 1,
                presupuesto: parseFloat(presupuestos[0].valor),
                limiteGanadores: presupuestos[0].limiteGanadores,
                presupuestoUtilizado: 150,
                cantParticipaciones: 50,
                presupuestoNew: 150 + parseFloat(premios[0].valor)
            }


            const validacionEtapa = {
                etapaActual,
                totalEtapas: etapas.length
            }


            let otrasValidaciones = [];

            const fechaNacimineto = datosPersonales.fechaNacimineto.split('-');
            const edad = 2023 - parseInt(fechaNacimineto[0]);
            let edadValidacion = { icono: 'gift', nombre: 'edad', 'inicial': element.edadInicial, 'final': element.edadFinal, valorActual: edad }

            if (edad >= element.edadInicial || edad <= element.edadFinal) {
                edadValidacion.valido = 1;
            } else {
                edadValidacion.valido = 0;
                enviaPremio = false;
            }

            let registroValidacion = { icono: 'calendar', nombre: 'Fecha Registro', 'inicial': format(datosPersonales.fechaRegistro), 'valorActual': format(new Date(element.fechaRegistro)) };

            if (new Date(2023, 0, 1) <= datosPersonales.fechaRegistro) {
                registroValidacion.valido = 1;
            } else {
                registroValidacion.valido = 0;
                enviaPremio = false;
            }

            let generos = ['Todos', 'Masculino', 'Femenino']
            let sexoValidacion = { icono: 'user-check', nombre: 'Genero', 'inicial': generos[element.sexo], 'final': "", valorActual: generos[datosPersonales.sexo] };

            if (element.sexo === 0 || datosPersonales.sexo === element.sexo) {
                sexoValidacion.valido = 1;
            } else {
                sexoValidacion.valido = 0;
                enviaPremio = false;
            }

            let tiposUsuarios = ["TODOS", "Adquiriente", "Final"]

            let tipoUsuarioValidacion = { icono: 'user', nombre: 'Tipo Usuario', 'inicial': tiposUsuarios[element.tipoUsuario], 'final': "", valorActual: tiposUsuarios[datosPersonales.tipoUsuario] };

            if (element.tipoUsuario === 0 || datosPersonales.tipoUsuario === element.tipoUsuario) {
                tipoUsuarioValidacion.valido = 1;
            } else {
                tipoUsuarioValidacion.valido = 0;
                result = false;
            }


            let tranasccionesX = parametros.filter(x => x.tipoTransaccion === 't');

            let transaccionesCampanias = parametros.filter(x => x.tipoTransaccion === 'c');



            let transaccionAct = { descripcion: "Recarga de Saldo", valor: 9.00 };
            let TransaccionesValidas = [];
            for (const param of tranasccionesX) {
                const transaccion = await transaccionesValidas(param.idTransaccion);
                const dataTrx = param.dataValues;
                let dataNew = {...dataTrx, transaccion: transaccion.dataValues }
                TransaccionesValidas.push(dataNew)
            }


            for (const param of transaccionesCampanias) {

            }


            otrasValidaciones = [...otrasValidaciones, edadValidacion, registroValidacion, sexoValidacion, tipoUsuarioValidacion];
            let test = await validacionTransaccion(TransaccionesValidas, transaccionAct, dataEtapaActual, element.id, '123456', dataEtapaActual.valorAcumulado);

            const validacion = { datosCampania, validacionPresupuesto, premios, validacionEtapa, otrasValidaciones, enviaPremio, TransaccionesValidas, test }

            result = [...result, validacion]
        }



        res.json(result);
    } catch (error) {
        console.error(error)
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar realizar la consulta de Campania.' });
    }
}

const transaccionesValidas = async(id) => {
    try {
        const transaccion = await Transaccion.findOne({ where: { id: id } });
        return transaccion;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const format = (inputDate) => {
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date
        .toString()
        .padStart(2, '0');

    month = month
        .toString()
        .padStart(2, '0');

    return `${date}/${month}/${year}`;
}


const validacionTransaccion = async(transaccionesCampanias, transaccionActual, etapaActual, idCampania, customerId) => {
    let result = null;
    switch (etapaActual.tipoParticipacion) {
        case 1:
            result = await ParticipacionPorParametro(transaccionesCampanias, transaccionActual, idCampania, etapaActual);
            break;


        case 2:
            result = await ParticipacionPorAcumular(transaccionesCampanias, transaccionActual, idCampania, etapaActual);
            break;

        case 3:
            result = await ParticipacionRecurente(transaccionesCampanias, transaccionActual, idCampania, etapaActual);
            break;
        case 4:
            break;
        case 5:

            result = await ParticipacionValorAcumulado(transaccionesCampanias, transaccionActual, idCampania, etapaActual, customerId);
            break;
        case 6:
            break;

        default:
            break;
    }
    return result;
}


const ParticipacionPorParametro = async(transaccionesCampanias, transaccion, idCampania, etapaActual) => {
    let filterTransaccion = transaccionesCampanias.filter(x => x.transaccion.descripcion.includes(transaccion.descripcion));


    if (filterTransaccion.length === 0) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No aplica Transaccion' }
    }



    const { limiteParticipacion, idTransaccion, tipoTransaccion, nombre, ValorMinimo, ValorMaximo } = filterTransaccion[0];



    const participacionesActuales = cantidadParticipacionCampaniaEtapa(idTransaccion, tipoTransaccion, etapaActual, idCampania)

    if (participacionesActuales >= limiteParticipacion) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'ha superado el maximo de participaciones' }
    }



    if (transaccion.valor > ValorMaximo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'Ha excedido el valor Maximo Permitido' }
    }

    if (transaccion.valor < ValorMinimo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No ha logrado alcanzar el valor minimo Establecido' }
    }



    return { premiado: true, guardaParticipacion: true, result: true }

}


const ParticipacionPorAcumular = async(transaccionesCampanias, transaccion, idCampania, etapaActual) => {
    let filterTransaccion = transaccionesCampanias.filter(x => x.transaccion.descripcion.includes(transaccion.descripcion));

    if (filterTransaccion.length === 0) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No aplica Transaccion' }
    }



    const { limiteParticipacion, idTransaccion, tipoTransaccion, ValorMinimo, ValorMaximo } = filterTransaccion[0];




    if (transaccion.valor > ValorMaximo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'Ha excedido el valor Maximo Permitido' }
    }

    if (transaccion.valor < ValorMinimo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No ha logrado alcanzar el valor minimo Establecido' }
    }



    const participacionesActuales = await cantidadParticipacionCampaniaEtapa(idTransaccion, tipoTransaccion, etapaActual.id, idCampania);

    if (participacionesActuales >= limiteParticipacion) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'ha superado el maximo de participaciones' }
    }


    if ((participacionesActuales + 1) < limiteParticipacion) {
        return { premiado: false, guardaParticipacion: true, result: false, message: 'Faltan participaciones para otorgar premio (' + parseInt(participacionesActuales + 1) + '/' + limiteParticipacion + ')' }
    }


    return { premiado: true, guardaParticipacion: true, result: true }

}


const ParticipacionRecurente = async(transaccionesCampanias, transaccion, idCampania, etapaActual) => {
    console.log(transaccion)
    let filterTransaccion = transaccionesCampanias.filter(x => x.transaccion.descripcion.includes(transaccion.descripcion));

    if (filterTransaccion.length === 0) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No aplica Transaccion' }
    }
    console.log(etapaActual.periodo)

    switch (etapaActual.periodo) {
        case 1:
            console.log('a')
            await GetParticipacionsXdias(3, new Date(2023, 0, 1), new Date(2023, 3, 1))
            break;

        default:
            break;
    }


    return { premiado: true, guardaParticipacion: true, result: true }

}


const ParticipacionValorAcumulado = async(transaccionesCampanias, transaccion, idCampania, etapaActual, customerId) => {
    let filterTransaccion = transaccionesCampanias.filter(x => x.transaccion.descripcion.includes(transaccion.descripcion));


    if (filterTransaccion.length === 0) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No aplica Transaccion' }
    }

    const { ValorMinimo, ValorMaximo, valorAnterior } = filterTransaccion[0];


    if (transaccion.valor > ValorMaximo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'Ha excedido el valor Maximo Permitido' }
    }

    if (transaccion.valor < ValorMinimo) {
        return { premiado: false, guardaParticipacion: false, result: false, message: 'No ha logrado alcanzar el valor minimo Establecido' }
    }

    const valorActual = await GetValorAcumulado(idCampania, etapaActual.id, valorAnterior, customerId);


    if (valorActual == -1) {
        return { premiado: false, guardaParticipacion: true, result: false, message: 'Ha sucedido un error al consultar los datos' }
    }

    if ((valorActual + transaccion.valor) >= etapaActual.valorAcumulado) {
        return { premiado: true, guardaParticipacion: true, result: true, message: "" }
    } else {
        return { premiado: false, guardaParticipacion: true, result: false, message: 'No a alcanzado la cantidad maxima : (' + (valorActual.toFixed(2) + ' + ' + transaccion.valor.toFixed(2)) + '/ ' + valorAcumulado + ')' }
    }

}

const GetParticipacionsXdias = async(dias, startDate, endDate) => {
    try {
        const registros = await Participacion.findAll({
            where: {
                fecha: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [Sequelize.fn('date', Sequelize.col('fecha')), 'fecha'],
                [Sequelize.fn('count', Sequelize.col('*')), 'count']
            ],
            group: [Sequelize.fn('date', Sequelize.col('fecha'))]
        });

        if (registros.length >= 0) {
            let diasSeguidos = 0;
            let ultimaFecha = null;
            let fechaAnterior = null;
            registros.forEach(registro => {
                const fechaActual = new Date(registro.get('fecha'));
                if (fechaAnterior && (fechaActual - fechaAnterior) === 86400000) {
                    diasSeguidos++;
                } else {
                    diasSeguidos = 1;
                    ultimaFecha = fechaActual
                }
                fechaAnterior = fechaActual;
            });


            if (diasSeguidos >= dias) {
                console.log('El registro se hizo en tres días seguidos');
                return { premiado: true, guardaParticipacion: true, result: true }
            } else {
                console.log('El registro no se hizo en ' + dias + '  días seguidos ' + diasSeguidos + ' de ' + dias);

                return { premiado: false, guardaParticipacion: true, result: false, message: 'El Registro no se hizo por tres dias seguidos. 1ra Transaccion Agregada' }
            }
        } else {
            return { premiado: false, guardaParticipacion: true, result: false, message: '1ra Transaccion Agregada' }
        }

    } catch (error) {
        console.error(error)
        return 0;
    }
}

const GetValorAcumulado = async(idCampania, etapa, ValorAnterior, customerId) => {
    try {

        if (ValorAnterior == 1) {
            const cantidad = await Participacion.sum('valor', {
                where: {
                    customerId: customerId,
                    idCampania: idCampania,

                }
            });

            return cantidad;

        } else {
            const cantidad = await Participacion.sum('valor', {
                where: {
                    customerId: customerId,
                    idCampania: idCampania,
                    etapa: etapa
                }
            });


            console.log(cantidad)

            return cantidad != null ? cantidad : 0;
        }




    } catch (error) {
        console.error(error);

        return -1;
    }
}

const cantidadParticipacionCampaniaEtapa = async(idTrx, tipo, etapa, idCampania) => {
    try {

        let cantidad = await Participacion.count({
            where: {
                etapa: etapa,
                idtxt: idTrx,
                tipo: tipo,
                idCampania: idCampania

            }
        })

        return cantidad;

    } catch (error) {
        console.error(error)
        return 0;
    }
}


const GetTransaccionesXCategoria = async(idCategoria) => {
    try {
        const result = await asignarCategoria.findAll({
            include: [{
                model: Transaccion,

            }],
            where: {
                idCategoria: idCategoria
            }
        });

        console.log(result)

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}




const GetCampaniasSEm = async(req, res) => {
    try {
        const fechaActual = new Date();
        const treintaDiasAntes = new Date(fechaActual);
        treintaDiasAntes.setDate(treintaDiasAntes.getDate() + 30);

        const quinceDiasAntes = new Date(fechaActual);
        quinceDiasAntes.setDate(quinceDiasAntes.getDate() + 15);

        const cincoDiasAntes = new Date(fechaActual);
        cincoDiasAntes.setDate(cincoDiasAntes.getDate() + 5);
        const campanias = await Campania.findAll({
            where: {
                estado: 1,
                [Op.or]: [{
                        fechaFin: {
                            [Op.between]: [fechaActual, treintaDiasAntes]
                        }
                    },
                    {
                        fechaFin: {
                            [Op.between]: [fechaActual, quinceDiasAntes]
                        }
                    },
                    {
                        fechaFin: {
                            [Op.between]: [fechaActual, cincoDiasAntes]
                        }
                    }
                ]
            },
        });

        res.json(campanias);
    } catch (error) {
        res.status(500).json({ error: 'Ha sucedido un error al intentar ver la campaña', details: error.message });
    }
};




const Getcampanascount = async(req, res) => {
    try {
        const campaniascount = await Campania.count({
            where: {
                estado: 1,
            }
        });
        res.json({ cantidad: campaniascount });
    } catch (error) {
        console.error("Este es el error:", error);
        res.status(403).send({ errors: 'Ha sucedido un error al intentar obtener la lista de referidos.' });
    }
};





const getnewCampanias = async(req, res) => {
    try {
        const currentDate = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        const newCampanias = await Campania.count({
            where: {
                fechaCreacion: {
                    [Op.between]: [sevenDaysAgo, currentDate]
                }
            }
        });

        res.json({ campanias: newCampanias });
    } catch (error) {
        res.status(403);
        res.send({ errors: 'Ha sucedido un error al intentar realizar la Transaccion.' });
    }
};




module.exports = {
    AddCampania,
    GetCampania,
    GetcampanasActivas,
    TestearTransaccion,
    GetcampanasActivasById,
    UpdateCampania,
    PausarCampaña,
    ActivarCampaña,
    DeleteCampania,
    GetCampaniasSEm,
    Getcampanascount,
    getnewCampanias,
    CheckNombreCampaña,
    inabilitarEtapa
}