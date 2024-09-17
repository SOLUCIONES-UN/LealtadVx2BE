const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Acumulados = sequelize.define('acumulados', {
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
        allowNull: false
    },
    idtxt: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    descripcionTrx: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(),
        allowNull: false
    },
    etapa: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idCampania: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idUsuarioParticipante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idParticipacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    codeTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, { timestamps: false });

module.exports = { Acumulados }