const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/database.js');

const Tercero = sequelize.define('tercero', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    }, 
    // nemonico: {
    //     type: DataTypes.STRING(15),
    //     allowNull: false,
    // },
    token: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {timestamps: false});

// (async () => {
//     await Tercero.sync({alter: true})
// })();

module.exports = {Tercero}