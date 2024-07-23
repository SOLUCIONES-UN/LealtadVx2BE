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
        defaultValue: 0,
        allowNull: true
    },
 

    time: {
        type: DataTypes.INTEGER, 
        allowNull: true,
        
    },
    cantransaccion: {
        type: DataTypes.INTEGER, 
        allowNull: true,
        
    },


    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },

}, { timestamps: false });





//    Configurevalidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


module.exports = { Configurevalidation }