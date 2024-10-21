const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const ReglaTiempo = sequelize.define('regla_tiempo', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rangoTiempo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidadTransacciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: false });

(async () => {
await ReglaTiempo.sync({ alter: true });
//Code here
})();

module.exports = { ReglaTiempo }