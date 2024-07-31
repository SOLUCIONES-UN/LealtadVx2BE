const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Configuraciones } = require('../models/configuraciones');


const ConfigReport = sequelize.define('configreportes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    frecuencia: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    diaSemana: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    diaMes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tiporeporte: {
        type: DataTypes.STRING(65),
        allowNull: true
    },
    emails: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, { timestamps: false });







ConfigReport.hasMany(Configuraciones, {
    foreignKey: 'idConfigReport',
    sourceKey: 'id'
});
Configuraciones.belongsTo(ConfigReport, {
    foreignKey: 'idConfigReport',
    targetKey: 'id',

});











module.exports = { ConfigReport };