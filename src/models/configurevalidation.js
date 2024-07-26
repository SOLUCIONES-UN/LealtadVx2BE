const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Campania } = require('./campanias');
const { CampaniaValidation } = require('./campaniaValidation');


const Configurevalidation = sequelize.define('configurevalidation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    validacion: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },


    time_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: true,

    },
    cantTransaccion_time: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: true,

    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },


    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },

}, { timestamps: false });


Configurevalidation.hasMany(CampaniaValidation, {
    foreignKey: 'idConfiguration',
    sourceKey: 'id',
    allowNull: false

});

CampaniaValidation.belongsTo(Configurevalidation, {
    foreignKey: 'idConfiguration',
    targetId: 'id',
    allowNull: false


});



// Configurevalidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


// CampaniaValidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


module.exports = { Configurevalidation }