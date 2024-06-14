const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { asignarCategoria } = require('./asignarCategoria');
const { Participacion } = require('./Participacion');



const Transaccion = sequelize.define('transaccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
  
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    idBotton: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull:false
    },
    puntos: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull:true
    },
    idColumna: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
    }
    

},{timestamps: false});

Transaccion.hasMany(asignarCategoria,{
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

asignarCategoria.belongsTo(Transaccion,{
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});

Transaccion.hasMany(Participacion,{
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

Participacion.belongsTo(Transaccion,{
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});


// (async () => {
//     await Transaccion.sync({ alter: true });
//     // Code here
// })();

module.exports = {Transaccion}
