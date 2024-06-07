const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const {Campania} = require('./campanias');

const Configuraciones = sequelize.define('configuraciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, { timestamps: false });

// Configuraciones.sync({ alter: true }).then(() => {
//     console.log('Tabla Configuraciones creada o actualizada correctamente');
// });

// Configuraciones.sync({ alter: true }).then(() => {
//     console.log('tabla Campania creada');
// });


module.exports = { Configuraciones };