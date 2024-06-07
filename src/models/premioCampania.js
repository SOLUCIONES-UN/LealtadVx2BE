const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');


const PremioCampania = sequelize.define('premiocampania', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    valor: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    }, 
    linkPremio:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tipoPremio:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    porcentajePremio:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});


// (async () => {
//     await PremioCampania.sync({ alter: true });
//     // Code here
//  })();

module.exports = {PremioCampania, sequelize}