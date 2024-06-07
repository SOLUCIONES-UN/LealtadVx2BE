const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
// const { participacionReferidos } = require('./participacionReferidos');
// const { ConfigReferido } = require('./configReferidos');

//Creacion de tabla y declaracion de sus atributos correspondientes
const referidosIngresos = sequelize.define('referidosingresos', {
    idRefIngresos: {
        type: DataTypes.INTEGER,
         primaryKey: true,
        autoIncrement: true,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario : {
        type: DataTypes.INTEGER,
        
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    
},{timestamps: false});

// ConfigReferido.belongsTo(referidosIngresos, {
//     foreignKey: 'idConfiguracion',
//     targetKey: 'id',
    
// });

//relacion entre tablas, menu tiene muchas paginas
/*Menu.hasMany(Pagina,{
    foreignKey: 'idMenu',
    sourceKey: 'id'
});*/


// (async () => {
//     await referidosIngresos.sync({ alter: true });
//     console.log("la tabla de Ingresos Referidos se creo correctamente");
// })();

// referidosIngresos.sync({ force: false }).then(() => {
//     console.log('tabla campania creada');
// });
module.exports = {referidosIngresos}