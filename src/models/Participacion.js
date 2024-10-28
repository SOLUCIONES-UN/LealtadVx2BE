const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { TransaccionPremio } = require('./transaccionPremio');
const { codigoReferido } = require('./codigoReferidos');
const { FailTransaccion } = require('./failTransaccion');


const { sumaTotal } = require('sequelize');

const Participacion = sequelize.define('participacions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idProyecto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idUsuarioParticipante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    customerId: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    idtxt: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    descripcionTrx: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(15),
        allowNull: false
    },
    urlPremio: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    etapa: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jugado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaJugado: {
        type: DataTypes.DATE,
        allowNull: true
    },
    idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipoTransaccion: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    trxBilletera: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    regBilletera: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: ''
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
}, { timestamps: false })


Participacion.hasMany(TransaccionPremio, {
    foreignKey: 'idParticipacion',
    sourceKey: 'id'
});


TransaccionPremio.belongsTo(Participacion, {
    foreignKey: 'idParticipacion',
    targetKey: 'id',
});

Participacion.hasMany(codigoReferido, {
    foreignKey: 'customerId',
    sourceKey: 'customerId'
});

codigoReferido.belongsTo(Participacion, {
    foreignKey: 'customerId',
    targetKey: 'customerId',
    as: 'codigoReferidoAssociation'
});

Participacion.hasMany(FailTransaccion, {
    foreignKey: 'idParticipacion',
    sourceKey: 'id',
    allowNull: false

});

FailTransaccion.belongsTo(Participacion, {
    foreignKey: 'idParticipacion',
    targetId: 'id',
    allowNull: false


});

// ESTADOS PARA MANEJO DE PARTICIPACIONES
//   0 => Anulado/Descartado
//   1 => Para enviar mensaje juego disponible de Offercraft
//   2 => Enviado mensaje juego disponible de Offercraft
//   3 => Para enviar a Billetera
//  98 => Registro marcado para proceso de envio de notificacion offercraft
//  99 => Registro marcado para proceso de envio a Billetera
// 100 => Proceso finalizado

// (async () => {
//     try{ 
//     await Participacion.sync({ alter: true });
//     console.log("Se cargo correctamente");


//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();


// FailTransaccion.sync({ alter: true }).then(() => {
//     console.log('tabla failTransaccion creada');
// });

module.exports = { Participacion }