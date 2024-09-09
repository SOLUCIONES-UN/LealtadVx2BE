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
        defaultValue: DataTypes.NOW(),
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

const BitacoraCupon = sequelize.define('bitacoracupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
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

const BitacoraJuego = sequelize.define('bitacorajuego', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
    },
    urlPremio: {
        type: DataTypes.STRING(255),
    },
    montoPremio: {
        type: DataTypes.STRING(100),
    },
    dataPremio: {
        type:  DataTypes.TEXT('long'),
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
        defaultValue: DataTypes.NOW(),
    },
    customerReference: {
        type: DataTypes.STRING(255),
    },
    codigoReferido: {
        type: DataTypes.STRING(100),
    },
    dataReferido: {
        type:  DataTypes.TEXT('long'),
    },
}, { timestamps: false });

module.exports = { BitacoraParticipacion, BitacoraCupon, BitacoraJuego, BitacoraReferido }