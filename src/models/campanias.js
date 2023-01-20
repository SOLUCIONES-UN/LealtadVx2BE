const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Etapa } = require('./etapa')

const Campania = sequelize.define('campania', {
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
    fechaCreacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaRegistro:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    edadInicial: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    edadFinal: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    sexo: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    tipoUsuario: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    tituloNotificacion: {
        type:  DataTypes.STRING(1000),
        allowNull: false
    },
    descripcionNotificacion: {
        type:  DataTypes.STRING(1000),
        allowNull: false
    },
    imgPush: {
        type:  DataTypes.STRING(1000),
        allowNull: false
    },
    imgAkisi: {
        type:  DataTypes.STRING(1000),
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    maximoParticipaciones: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
},{timestamps: false});



Campania.hasMany(Etapa,{
    foreignKey: 'idCampania',
    sourceKey: 'id'
});

Etapa.belongsTo(Campania, {
    foreignKey: 'idCampania',
    targetId: 'id',
});



// (async () => {
//     await sequelize.sync({ force: true });
//     // Code here
//  })();

module.exports = {Campania}