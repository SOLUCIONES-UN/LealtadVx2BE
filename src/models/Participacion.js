const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { TransaccionPremio } = require('./transaccionPremio');
const { codigoReferido } = require('./codigoReferidos');

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
    idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipoTransaccion: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    estado : {
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

Participacion.hasMany(codigoReferido,{
    foreignKey: 'customerId',
    sourceKey: 'customerId' 
});

codigoReferido.belongsTo(Participacion, {
    foreignKey: 'customerId', // Columna en este modelo
    targetKey: 'customerId',
    as: 'codigoReferidoAssociation'
}); 

// (async () => {
//     try{ 
//     await Participacion.sync({ alter: true });
//     console.log("Se cargo correctamente");
    

//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

module.exports = { Participacion }