const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const asignarCategoria = sequelize.define('asignarcategoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATEONLY
    }

}, {timestamps: false});

// (async () => {
//   await asignarCategoria.sync({ alter: true });
// //     // Code here
// })();

module.exports = {asignarCategoria}