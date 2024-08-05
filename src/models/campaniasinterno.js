const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { CampaniaInternoNumber } = require('../models/campaniaInternaNumber');
const { Premio } = require('../models/premio');
const { Campania } = require('./campanias');

const CampaniaInterna = sequelize.define('campanias_internas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tituloNotificacion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    descripcionNotificacion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    imgCampania: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    imgNotificacion: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    tipoCampania: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    esArchivada: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    emails: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    terminos: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },

}, { timestamps: false });


CampaniaInterna.hasMany(CampaniaInternoNumber, {
    foreignKey: 'idCampaniaInterna',
    sourceKey: 'id',
    allowNull: false

});

CampaniaInternoNumber.belongsTo(CampaniaInterna, {
    foreignKey: 'idCampaniaInterna',
    targetId: 'id',
    allowNull: false
});


// CampaniaInterna.sync({ alter: true }).then(() => {
//     console.log('tabla CampaniaInterna creada');
// });

module.exports = { CampaniaInterna };