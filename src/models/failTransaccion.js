const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { asignarCategoria } = require('./asignarCategoria');

const failTransaccion = sequelize.define('failTransaccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, { timestamps: false });

// Categoria.hasMany(asignarCategoria, {
//     foreignKey: {
//         name: 'idCategoria',
//         allowNull: false,
//     },
//     sourceKey: 'id',
//     allowNull: false
// });

// asignarCategoria.belongsTo(Categoria, {
//     foreignKey: 'idCategoria',
//     targetId: 'id',
//     allowNull: false
// });



// (async () => {
//     try{ 
//     await Categoria.sync({ alter: true });
//     console.log("Se cargo correctamente");


//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();


module.exports = { Categoria };