const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Bloqueados = sequelize.define('bloqueados', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    idCampania: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}, { timestamps: false });

// (async () => {
// await Bloqueados.sync({ alter: true });
// //Code here
// })();

module.exports = { Bloqueados }