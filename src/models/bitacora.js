const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const BitacoraParticipacion = sequelize.define('bitacoraparticipacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    customerId: {
        type: DataTypes.STRING(100),
    },
    transactionId: {
        type: DataTypes.STRING(100),
    },
    campaniaData: {
        type:  DataTypes.TEXT('long'),
    },
}, { timestamps: false });

const BitacoraPromocion = sequelize.define('bitacorapromocion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false });

const BitacoraJuegoAbierto = sequelize.define('bitacorajuegoabierto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false });

const BitacoraReferido = sequelize.define('bitacorareferido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false });

module.exports = { BitacoraParticipacion, BitacoraPromocion, BitacoraJuegoAbierto, BitacoraReferido }