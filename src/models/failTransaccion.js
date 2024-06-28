const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const FailTransaccion = sequelize.define('failTransaccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    failmessage: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    codigoError: {
        type: DataTypes.INTEGER,
        allowNull: false
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



// (async() => {
//     try {
//         await FailTransaccion.sync({ alter: true });
//         console.log("Se cargo correctamente");


//     } catch (error) {
//         console.error("hay problema al cargar el modelo", error);
//     }
// })();

// FailTransaccion.sync({ alter: true }).then(() => {
//     console.log('tabla failTransaccion creada');
// });



module.exports = { FailTransaccion };