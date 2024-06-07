const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { TransaccionPremio } = require('./transaccionPremio');
const { Participacion } = require('./Participacion');


const Premiacion = sequelize.define('premiacion', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    customerId: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    url: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    valor: {
        type:  DataTypes.DECIMAL(18,2),
        allowNull: false
    },
    jugado: {
        type:  DataTypes.INTEGER,
        allowNull: false
    }

}, {timestamps: false});

Premiacion.hasMany(TransaccionPremio,{
    foreignKey: 'idPremiacion',
    sourceKey: 'id'
});

TransaccionPremio.belongsTo(Premiacion, {
    foreignKey: 'idPremiacion',
    targetKey: 'id',
});

// (async () => {
//     await Premiacion.sync({ alter: true });
//     // Code here
// })();

// TransaccionPremio.sync({ alter: true }).then(() => {
//     console.log('tabla TransaccionPremio creada');
// });

module.exports = {Premiacion, sequelize}