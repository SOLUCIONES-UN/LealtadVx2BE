const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Profecion = sequelize.define('profesiones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,

        
    }, proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});



// (async () => {
//     await Profecion.sync({ alter: false });
//  })();

module.exports = {Profecion}
