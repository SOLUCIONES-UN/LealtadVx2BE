const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Parametro } = require('./parametro');
const { PremioCampania } = require('./premioCampania');
const { Presupuesto } = require('./presupuesto');
const { Campania } = require('./campanias');


const Etapa = sequelize.define('etapa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    tipoParticipacion: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    intervalo : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    intervaloSemanal : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    intervaloMensual : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    periodo : {
        type: DataTypes.INTEGER,

    },
    valorAcumulado: {
        type: DataTypes.DECIMAL(18,2)
    },
    minimoTransaccion:{
        type: DataTypes.DECIMAL(18,2),
        allowNull: true
    },
    totalMinimo:{
        type: DataTypes.DECIMAL(18,2),
        allowNull: true
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});


Etapa.hasMany(Presupuesto,{
    foreignKey: 'idEtapa',
    sourceKey: 'id'
});

Presupuesto.belongsTo(Etapa, {
    foreignKey: 'idEtapa',
    targetId: 'id',
});


Etapa.hasMany(Parametro,{
    foreignKey: 'idEtapa',
    sourceKey: 'id'
});

Parametro.belongsTo(Etapa, {
    foreignKey: 'idEtapa',
    targetId: 'id',
});

Etapa.hasMany(PremioCampania,{
    foreignKey: 'idEtapa',
    sourceKey: 'id'
});

PremioCampania.belongsTo(Etapa, {
    foreignKey: 'idEtapa',
    targetId: 'id',
});

// Etapa.sync({ alter: true }).then(() => {
//     console.log('Tabla Etapa creada o actualizada correctamente');
//  });

// Campania.sync({ alter: true }).then(() => {
//     console.log('tabla Campania creada');
// });


module.exports = {Etapa}


