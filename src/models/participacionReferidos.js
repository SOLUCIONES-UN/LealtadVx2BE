const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { codigoReferidos } = require('./codigoReferidos');
const { ConfigReferido } = require('./configReferidos');

const participacionReferidos = sequelize.define('participacionReferidos', {

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    refiriente: {
        type: DataTypes.STRING(150),
        allowNull: false
    }, 
    referido: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
    ,
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}, {timestamps: false});

// (async () => {
//     await sequelize.sync({ force: false});
// })()



module.exports={participacionReferidos}