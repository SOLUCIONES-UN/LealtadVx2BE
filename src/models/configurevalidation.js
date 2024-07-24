const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { TablaDB } = require('./tabladb');
const { Columna } = require('./columna');
const { Transaccion } = require('./transaccion');
const { Campania } = require('./campanias');
const { Departamento_Proyectos } = require('./departamento_proyectos');

const Configurevalidation = sequelize.define('configurevalidation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    validacion: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },


    time_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: true,

    },
    cantTransaccion_time: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: true,

    },


    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },

}, { timestamps: false });





// Configurevalidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


module.exports = { Configurevalidation }