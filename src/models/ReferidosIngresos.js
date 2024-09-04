const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
// const { participacionReferidos } = require('./participacionReferidos');
// const { ConfigReferido } = require('./configReferidos');

//Creacion de tabla y declaracion de sus atributos correspondientes
const referidosIngresos = sequelize.define('referidosingresos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCodigoReferido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
},{timestamps: false});



// (async () => {
//     await referidosIngresos.sync({ alter: true });
//     console.log("la tabla de Ingresos Referidos se creo correctamente");
// })();

// referidosIngresos.sync({ force: false }).then(() => {
//     console.log('tabla campania creada');
// });
module.exports = {referidosIngresos}