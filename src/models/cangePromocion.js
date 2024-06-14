const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const CangePromocion = sequelize.define('cangepromocions', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numeroTelefono: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {timestamps: false});

// (async () => {
//     await CangePromocion.sync({ alter: false });
//     //   Code here
// })();

module.exports = {CangePromocion, sequelize}