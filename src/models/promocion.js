const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { DetallePromocion } = require("../models/detallePromocion");
const { PremioPromocion } = require('./premioPromocion');
const { Configuraciones } = require('./configuraciones');


const Promocion = sequelize.define('promocions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nemonico: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    mesajeExito: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    mesajeFail: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    imgSuccess: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    imgFail: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    PremioXcampania: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { timestamps: false });



Promocion.hasMany(DetallePromocion, {
    foreignKey: 'idPromocion',
    sourceKey: 'id'
});

DetallePromocion.belongsTo(Promocion, {
    foreignKey: 'idPromocion',
    targetId: 'id',

});


Promocion.hasMany(PremioPromocion, {
    foreignKey: 'idPromocion',
    sourceKey: 'id'
});

PremioPromocion.belongsTo(Promocion, {
    foreignKey: 'idPromocion',
    targetId: 'id',

});

Promocion.hasMany(Configuraciones, {
    foreignKey: 'idPromocion',
    sourceKey: 'id'
});

Configuraciones.belongsTo(Promocion, {
    foreignKey: 'idPromocion',
    targetId: 'id',
});




// (async () => {
//     await Promocion.sync({ alter: true });
//     // Code here
// // })();



module.exports = { Promocion, sequelize }