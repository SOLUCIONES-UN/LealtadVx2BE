const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Participantes = sequelize.define('participantes', {


    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    idCampania: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, { timestamps: false });


// (async () => {
//     await Participantes.sync({ alter: true });
//     // Code here
// })();

module.exports = { Participantes }