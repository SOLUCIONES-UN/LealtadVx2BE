const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Campania } = require('../models/campanias');

const EnviaPremio = sequelize.define('enviapremios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    telefono: {
        type: DataTypes.STRING(150),
        allowNull: true,
        
    }, campania: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});

EnviaPremio.belongsTo(Campania, { foreignKey: 'campania', as: 'campaign' });

// (async () => {
//     await EnviaPremio.sync({ alter: true });
//  })();

module.exports = {EnviaPremio}
