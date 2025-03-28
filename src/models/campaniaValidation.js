const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { TablaDB } = require('./tabladb');
const { Columna } = require('./columna');
const { Transaccion } = require('./transaccion');
const { Campania } = require('./campanias');
const { Departamento_Proyectos } = require('./departamento_proyectos');

const CampaniaValidation = sequelize.define('campaniaValidation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },

}, { timestamps: false });





// CampaniaValidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


module.exports = { CampaniaValidation }