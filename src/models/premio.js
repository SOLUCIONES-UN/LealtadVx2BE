const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Premiacion } = require('./premiacion');
const { PremioCampania } = require('./premioCampania');
const { PremioPromocion } = require('./premioPromocion');
const { Participacion } = require('./Participacion');




const Premio = sequelize.define('premios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true
    },
    usuario: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    link: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    claveSecreta: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: true
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

}, { timestamps: false });


Premio.hasMany(PremioCampania, {
    foreignKey: 'idPremio',
    sourceKey: 'id'
});

PremioCampania.belongsTo(Premio, {
    foreignKey: 'idPremio',
    targetId: 'id',

});


Premio.hasMany(Participacion, {
    foreignKey: 'idPremio',
    sourceKey: 'id'
});
Participacion.belongsTo(Premio, {
    foreignKey: 'idPremio',
    targetId: 'id',

});



Premio.hasMany(PremioPromocion, {
    foreignKey: 'idPremio',
    sourceKey: 'id'
});

PremioPromocion.belongsTo(Premio, {
    foreignKey: 'idPremio',
    targetId: 'id',

});

Premio.hasMany(Premiacion, {
    foreignKey: 'idPremio',
    sourceKey: 'id'

});

Premiacion.belongsTo(Premio, {
    foreignKey: 'idPremio',
    targetId: 'id',

});




//  (async () => {
//     await Premio.sync({ alter: true });
//     // Code here
//  })();

module.exports = { Premio, sequelize }