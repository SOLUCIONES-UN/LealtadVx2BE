const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/database');

const permisoUsuario = sequelize.define('permisousuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fechaAsignacion: {
        type: DataTypes.DATEONLY
    }
}, {timestamps: false});

// (async () => {
//   await permisoUsuario.sync({ alter: true });
//     // Code here
// })();

module.exports = {permisoUsuario}