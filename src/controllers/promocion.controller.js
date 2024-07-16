const { Promocion } = require('../models/promocion');
const { DetallePromocion } = require('../models/detallePromocion');
const { PremioPromocion } = require('../models/premioPromocion');
const { Premio } = require('../models/premio');
const { Op } = require("sequelize");
const { GetColumnaById } = require('./columna.controller');


const GetPromocion = async (req, res) => {
    try {
        const trx = await Promocion.findAll({
            where: {
                estado: [1, 2, 0]
            }
        })
        res.json(trx)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar consultar las promociones.' });
    }

}


const AddPromocion = async (req, res) => {

    try {

        const {
            nemonico,
            nombre,
            descripcion,
            mesajeExito,
            mesajeFail,
            imgSuccess,
            imgFail,
            fechaInicio,
            fechaFin,
            PremioXcampania,
            estado,
            codigos,
            premios
        } = req.body;

        if (!nemonico || !nombre || !fechaInicio || !fechaFin || !PremioXcampania || !estado || !codigos || !premios) {
            return res.status(400).send({ errors: 'Faltan datos requeridos en la solicitud.' });
        }

        const existingPromo = await Promocion.findOne({ where: { nemonico } });
        if (existingPromo) {
            return res.status(400).send({ errors: 'El nemonico ya existe en una de las promociones.' });
        }

        const existingPromoName = await Promocion.findOne({ where: { nombre } });
        if (existingPromoName) {
            return res.status(400).send({ errors: 'El nombre ya existe en una de las promociones.' });
        }

        const estadotext = estado === 3 ? 'en Borrador' : '';
        const newPromo = await Promocion.create({
            nemonico,
            nombre,
            descripcion,
            mesajeExito,
            mesajeFail,
            imgSuccess,
            imgFail,
            fechaInicio,
            fechaFin,
            estado,
            PremioXcampania
        });

        const { id } = newPromo.dataValues;

        premios.forEach(element => {
            const { cantidad } = element;
            const cantCodigos = codigos.length;

            for (let index = 0; index < cantidad;) {
                let random = Math.floor(Math.random() * cantCodigos);

                if (codigos[random].esPremio === 0) {
                    codigos[random] = { ...codigos[random], esPremio: 1 };
                    index++;
                }
            }
        });



        const nuevoArrarPremios = premios.map((item) => ({
            ...item,
            idPromocion: id,
            valor: item.valor || 0,
            nombre: item.nombre || 'Desconocido',
            cupon: item.cupon.cupon || '',
            porcentaje: item.porcentaje || 0
        }));

        const premiosInsertados = await PremioPromocion.bulkCreate(nuevoArrarPremios);

        let nuevoArray = [];

        let premiosCreados = premiosInsertados.map((item) => ({
            idPremio: item.id,
            cantidad: item.cantidad,
            cupon: item.cupon,
            porcentaje: item.porcentaje,
            entregados: 0
        }));

        let indexact = 0;

        for (const item of codigos) {
            var newData = {
                ...item,
                idPromocion: id,
                cupon: item.cupon || ''
            };

            if (item.esPremio === 1) {
                newData.idPremioPromocion = premiosCreados[indexact].idPremio;
                premiosCreados[indexact].entregados = premiosCreados[indexact].entregados + 1;

                if (premiosCreados[indexact].cantidad === premiosCreados[indexact].entregados) {
                    indexact++;
                }
            }

            nuevoArray.push(newData);
        }

        await DetallePromocion.bulkCreate(nuevoArray);

        return res.status(200).json({ code: 'ok', message: 'Promocion creada ' + estadotext + ' con exito' });

    } catch (error) {
        return res.status(403).send({ errors: 'Ha sucedido un error al intentar Crear la Promocion.', detail: error.message });
    }
};



const checkNemonico = async (req, res) => {
    try {
        const { nemonico } = req.body;
        const promocion = await Promocion.findOne({ where: { nemonico } });

        if (promocion) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).send({ errors: 'Error al verificar nemonico.' });
    }
};


const checkNombre = async (req, res) => {
    try {
        const { nombre } = req.body;
        const promocion = await Promocion.findOne({ where: { nombre: nombre.trim() } });

        if (promocion) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).send({ errors: 'Error al verificar nombre promocion.' });
    }
};

const PausarPromocion = async (req, res) => {

    try {
        const { id } = req.params;
        await Promocion.update({
            estado: 2
        }, {
            where: {
                id: id
            }
        });
        res.json({ code: 'ok', message: 'Promocion pausada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar pausar la Promocion.' });
    }

}


const ActivarPromocion = async (req, res) => {

    try {
        const { id } = req.params;
        await Promocion.update({
            estado: 1
        }, {
            where: {
                id: id
            }
        });


        res.json({ code: 'ok', message: 'Promocion activada con exito' });

    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar activar la Promocion.' });
    }

}






const UpdatePromocion = async (req, res) => {
    const { id } = req.params;
    try {

        const {
            nemonico,
            nombre,
            descripcion,
            mesajeExito,
            mesajeFail,
            imgSuccess,
            imgFail,
            fechaInicio,
            fechaFin,
            PremioXcampania,
            estado,
            codigos,
            premios
        } = req.body;

        if (!nemonico || !nombre || !fechaInicio || !fechaFin || !PremioXcampania || !estado || !codigos || !premios) {
            return res.status(400).send({ errors: 'Faltan datos requeridos en la solicitud.' });
        }

        const estadotext = estado === 0 ? 'en Borrador' : '';
        const promoExistente = await Promocion.findByPk(id);

        if (!promoExistente) {
            return res.status(404).send({ errors: 'Promoción no encontrada.' });
        }

        const newImgSuccess = imgSuccess ? imgSuccess : promoExistente.imgSuccess;
        const newImgFail = imgFail ? imgFail : promoExistente.imgFail;


        await promoExistente.update({
            nemonico,
            nombre,
            descripcion,
            mesajeExito,
            mesajeFail,
            imgSuccess: newImgSuccess,
            imgFail: newImgFail,
            fechaInicio,
            fechaFin,
            estado,
            PremioXcampania
        });

        await PremioPromocion.destroy({ where: { idPromocion: id } });

        if (codigos && codigos.length > 0) {
            await DetallePromocion.destroy({ where: { idPromocion: id } });
            await DetallePromocion.bulkCreate(codigos.map(codigos => ({
                ...codigos,
                idPromocion: id
            })));
        }

        const nuevoArrarPremios = premios.map(item => ({
            ...item,
            idPromocion: id,
            valor: item.valor || 0,
            nombre: item.nombre || 'Desconocido',
            cupon: item.cupon || '',
            porcentaje: item.porcentaje || 0
        }));

        const premiosInsertados = await PremioPromocion.bulkCreate(nuevoArrarPremios);
        let nuevoArray = [];

        let premiosCreados = premiosInsertados.map(item => ({
            idPremio: item.id,
            cantidad: item.cantidad,
            cupon: item.cupon,
            porcentaje: item.porcentaje,
            entregados: 0
        }));

        let indexact = 0;

        for (const item of codigos) {
            var newData = {
                ...item,
                idPromocion: id,
                cupon: item.cupon || ''
            };

            if (item.esPremio === 1) {
                newData.idPremioPromocion = premiosCreados[indexact].idPremio;
                premiosCreados[indexact].entregados = premiosCreados[indexact].entregados + 1;

                if (premiosCreados[indexact].cantidad === premiosCreados[indexact].entregados) {
                    indexact++;
                }
            }

            nuevoArray.push(newData);
        }


        await DetallePromocion.destroy({ where: { idPromocion: id } });
        await DetallePromocion.bulkCreate(nuevoArray);

        return res.status(200).json({ code: 'ok', message: 'Promocion actualizada ' + estadotext + ' con exito' });

    } catch (error) {
        return res.status(403).send({ errors: 'Ha sucedido un error al intentar actualizar la Promocion.', detail: error.message });
    }
};


const GetPromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Promocion.findByPk(id, {

            include: [
                { model: DetallePromocion },
                {
                    model: PremioPromocion,
                    include: [Premio]
                }

            ]
        });

        const fechaActual = new Date();
        const fechaFin = new Date(project.fechaFin);

        if (fechaActual > fechaFin) {
            await DetallePromocion.update(
                { estado: 3 },
                { where: { idPromocion: id, estado: {[Op.ne]: 2 } } }
            );
            await project.reload();
        }

        res.json(project)
    } catch (error) {
        res.status(403)
        res.send({ errors: 'Ha sucedido un  error al intentar consultar las Promociones.' });
    }

}



const GetCuponByDetallePromocionId = async (req, res) => {
    try {
        const { id } = req.params;
        const detallePromocion = await DetallePromocion.findByPk(id, {
            attributes: ['cupon']
        });

        if (!detallePromocion) {
            return res.status(404).json({ error: 'DetallePromocion no encontrado.' });
        }

        res.json(detallePromocion);
    } catch (error) {
        res.status(403).json({ errors: 'Ha sucedido un error al intentar consultar el cupon de la Promoción.' });
    }
};

const DeletePromocion = async (req, res) => {
    try {

        const { id } = req.params;

        await Promocion.update({
            estado: 0
        }, {
            where: {
                id: id
            }
        });

        res.json({ code: 'ok', message: 'Promocion inhabilitado con exito.' });

    } catch (e) {
        res.status(403);
        res.send({ errors: 'Ha ocurrido un error al intentar inhabilitar la promocion.' });
    }
}

const TestearCodigo = async (req, res) => {
    const { cupon } = req.body;
    const cantidadCupones = await DetallePromocion.count({
        where: {
            cupon: cupon
        }
    });
    if (cantidadCupones === 0) {
        res.json(
            {
                code: '03',
                messagge: 'Lo sentimos, el cupon no existe o no esta disponible.'
            })

    } else {
        const cuponDentroActivo = await Promocion.count({
            include: {
                model: DetallePromocion,
                where: {
                    cupon: cupon
                }
            },
            where: {
                estado: 1,
                fechaInicio: {
                    [Op.lte]: new Date(),
                },
                fechaFin: {
                    [Op.gte]: new Date(),
                }
            }
        });

        if (cuponDentroActivo === 0) {
            res.json(
                {
                    code: '04',
                    messagge: 'Lo sentimos, La Promocion ha caducado.'
                })

        } else {
            const promoxionx = await Promocion.findOne({
                include: {
                    model: DetallePromocion,
                    where: {
                        cupon: cupon
                    }
                }
            });


            const datax = promoxionx.dataValues;

            const detallePromocions = datax.detallepromocions;
            const cuponValido = detallePromocions[0].dataValues;
            if (datax.estado === 2) {
                res.json(
                    {
                        code: '05',
                        messagge: 'Lo sentimos este cupon ya ha sido cangeado.',
                        data: {}
                    })
            } else {
                if (cuponValido.esPremio === 0) {

                    res.json(
                        {
                            code: '02',
                            messagge: datax.mesajeFail,
                            data: {
                                imgFail: datax.imgFail,
                                promocion: datax.nombre,
                                nemonico: datax.nemonico,
                                descripcion: datax.descripcion,
                            }
                        }
                    )

                } else {

                    res.json(
                        {
                            code: '01',
                            messagge: datax.mesajeExito,
                            data: {
                                imgFail: datax.imgSuccess,
                                promocion: datax.nombre,
                                nemonico: datax.nemonico,
                                descripcion: datax.descripcion,
                            }
                        })
                }
            }


        }

    }

}

module.exports = { GetPromocion, AddPromocion, PausarPromocion, ActivarPromocion, UpdatePromocion, DeletePromocion, GetPromocionById, TestearCodigo, GetCuponByDetallePromocionId, checkNemonico, checkNombre }