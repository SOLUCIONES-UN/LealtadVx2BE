const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const referidosIngresos = sequelize.define('referidosingresos', {
    idRefIngresos: {
        type: DataTypes.INTEGER,
         primaryKey: true,
        autoIncrement: true,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario : {
        type: DataTypes.INTEGER,
        
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
},{timestamps: false});


module.exports = {referidosIngresos}