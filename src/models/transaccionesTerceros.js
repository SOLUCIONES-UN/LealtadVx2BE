const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/database.js');

const TransaccionesTerceros = sequelize.define('transaccionestercero', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fechaTransaccion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW()
    },
    codigoUnico: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true, 
    },
    idTrx: {
        type:DataTypes.BIGINT,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(15,2),
        defaultValue: 0,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cupo: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    descTransaccion: {
        type: DataTypes.TEXT(),
        allowNull: false,
    },
}, {timestamps: false});

module.exports = {TransaccionesTerceros}