const { Promocion } = require('../models/promocion');
const { DetallePromocion } = require('../models/detallePromocion');
const { PremioPromocion } = require('../models/premioPromocion');
const { Premio } = require('../models/premio');
const { Op } = require("sequelize");
const { GetColumnaById } = require('./columna.controller');



//controllador paa obtener la lista de Columnaes
const GetPromocion = async (req, res) => {
    try {
        const trx = await Promocion.findAll({
            where: {
                estado: [1, 2, 3]
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
        console.log('Datos recibidos:', req.body); // Log para verificar los datos

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

        // Validar que los datos requeridos estén presentes
        if (!nemonico || !nombre || !fechaInicio || !fechaFin || !PremioXcampania || !estado || !codigos || !premios) {
            return res.status(400).send({ errors: 'Faltan datos requeridos en la solicitud.' });
        }

        // Verificar si el nemonico ya existe
        const existingPromo = await Promocion.findOne({ where: { nemonico } });
        if (existingPromo) {
            return res.status(400).send({ errors: 'El nemonico ya existe en la base de datos.' });
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
        console.log('Promoción creada con ID:', id);

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
            valor: item.valor || 0, // Proporciona un valor por defecto para 'valor'
            nombre: item.nombre || 'Desconocido', // Proporciona un valor por defecto para 'nombre'
            cupon: item.cupon.cupon || '', // Proporciona un valor por defecto para 'cupon'
            porcentaje: item.porcentaje || 0 // Proporciona un valor por defecto para 'porcentaje'
        }));

        console.log('Premios a insertar:', nuevoArrarPremios);

        const premiosInsertados = await PremioPromocion.bulkCreate(nuevoArrarPremios);
        console.log('Premios insertados:', premiosInsertados);

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
                cupon: item.cupon || '' // Proporciona un valor por defecto para 'cupon'
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

        console.log('Detalles de la promoción a insertar:', nuevoArray);

        await DetallePromocion.bulkCreate(nuevoArray);

        return res.status(200).json({ code: 'ok', message: 'Promocion creada ' + estadotext + ' con exito' });

    } catch (error) {
        console.error('Error al crear la promoción:', error);
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
      console.error('Error al verificar nemonico:', error);
      res.status(500).send({ errors: 'Error al verificar nemonico.' });
    }
  };
   
  
  

//controllador para actualizar Columnaes
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


//controllador para actualizar Columnaes
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
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL

    try {
        console.log('Datos recibidos para actualización:', req.body);

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

        // Validar que los datos requeridos estén presentes
        if (!nemonico || !nombre || !fechaInicio || !fechaFin || !PremioXcampania || !estado || !codigos || !premios) {
            return res.status(400).send({ errors: 'Faltan datos requeridos en la solicitud.' });
        }

        const estadotext = estado === 3 ? 'en Borrador' : '';
        const promoExistente = await Promocion.findByPk(id);

        if (!promoExistente) {
            return res.status(404).send({ errors: 'Promoción no encontrada.' });
        }

        await promoExistente.update({
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

        console.log('Promoción actualizada con ID:', id);

        // Actualizar los premios
        await PremioPromocion.destroy({ where: { idPromocion: id } });

        const nuevoArrarPremios = premios.map(item => ({
            ...item,
            idPromocion: id,
            valor: item.valor || 0,
            nombre: item.nombre || 'Desconocido',
            cupon: item.cupon || '',
            porcentaje: item.porcentaje || 0
        }));

        console.log('Premios a insertar:', nuevoArrarPremios);

        const premiosInsertados = await PremioPromocion.bulkCreate(nuevoArrarPremios);
        console.log('Premios insertados:', premiosInsertados);

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

        console.log('Detalles de la promoción a insertar:', nuevoArray);

        await DetallePromocion.destroy({ where: { idPromocion: id } });
        await DetallePromocion.bulkCreate(nuevoArray);

        return res.status(200).json({ code: 'ok', message: 'Promocion actualizada ' + estadotext + ' con exito' });

    } catch (error) {
        console.error('Error al actualizar la promoción:', error);
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
        console.log(project)
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
            attributes: ['cupon'] // Incluye solo el campo cupon
        });

        if (!detallePromocion) {
            return res.status(404).json({ error: 'DetallePromocion no encontrado.' });
        }

        res.json(detallePromocion);
    } catch (error) {
        res.status(403).json({ errors: 'Ha sucedido un error al intentar consultar el cupon de la Promoción.' });
    }
};


    //eliminado logico de Promociones
    const DeletePromocion = async (req, res) => {
        try{
    
            const {id} = req.params;
            console.log(id);
    
            await Promocion.update({
                estado: 0
            }, {
                where: {
                    id: id
                }
            });
    
            res.json({code: 'ok', message: 'Promocion inhabilitado con exito.'});
    
        } catch (e) {
            res.status(403);
            res.send({errors: 'Ha ocurrido un error al intentar inhabilitar la promocion.'});
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

    }else{
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
    
        console.log('cuponDentroActivo', cuponDentroActivo)
    
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

module.exports = { GetPromocion, AddPromocion, PausarPromocion, ActivarPromocion, UpdatePromocion, DeletePromocion, GetPromocionById, TestearCodigo,GetCuponByDetallePromocionId,checkNemonico }