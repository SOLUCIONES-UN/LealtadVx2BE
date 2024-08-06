const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');


const CampaniasNumeros = sequelize.define('campanianumeros', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCampania: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero : {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});



// (async () => {
//     await CampaniasNumeros.sync({ alter: true });
//     // Code here
//  })();



module.exports = {CampaniasNumeros}