const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { DetallePromocion } = require('./detallePromocion');


const PremioPromocion = sequelize.define('premiopromocions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    valor: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    }, 
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    cupon: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 

    porcentaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{timestamps: false});

PremioPromocion.hasMany(DetallePromocion,{
    foreignKey: {
        name: 'idPremioPromocion',
    },
    sourceKey: 'id',
});

DetallePromocion.belongsTo(PremioPromocion,{
    foreignKey: 'idPremioPromocion',
    targetId: 'id',
});




// (async () => {
//     await PremioPromocion.sync({ alter: false });
// //     // Code here
// })();

module.exports = {PremioPromocion, sequelize}