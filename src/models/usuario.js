const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { permisoUsuario } = require('./permisoUsuario');



const Usuario = sequelize.define('usuario', {
    username: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    telefono:{
        type: DataTypes.STRING(15),
        allowNull:true
        
    },
    emailNotificacion: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true
    },
    tipoUsuario: {
        type:  DataTypes.INTEGER,
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }

},{timestamps: false});

Usuario.hasMany(permisoUsuario, {
    foreignKey: 'username',
    sourceKey: 'username',
});

permisoUsuario.belongsTo(Usuario, {
    foreignKey: 'username',
    targetId: 'username',
});


// (async () => {
//    await Usuario.sync({ alter: true });
// })();

module.exports = {Usuario}