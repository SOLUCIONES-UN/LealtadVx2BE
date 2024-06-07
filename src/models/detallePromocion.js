const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { CangePromocion } = require('./cangePromocion');

const DetallePromocion = sequelize.define('detallepromocions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cupon: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    esPremio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, { timestamps: false });


DetallePromocion.hasMany(CangePromocion, {
    foreignKey: 'idDetallePromocion',
    sourceKey: 'id'
})

CangePromocion.belongsTo(DetallePromocion, {
    foreignKey: 'idDetallePromocion',
    targetId: 'id',
});


// (async () => {
//  await DetallePromocion.sync({ alter: false });
//     // Code here
//  })();

module.exports = { DetallePromocion }