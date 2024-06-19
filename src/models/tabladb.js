const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Columna } = require('./columna');
const { Transaccion } = require('./transaccion');

const TablaDB = sequelize.define('tabladbs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_tabla: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, { timestamps: false });

TablaDB.hasMany(Columna, {
    foreignKey: 'idTablas',
    sourceKey: 'id'
});

Columna.belongsTo(TablaDB, {
    foreignKey: 'idTablas',
    sourceKey: 'id'
});

TablaDB.hasMany(Transaccion, {
    foreignKey: 'idTablas',
    sourceKey: 'id'
});

Transaccion.belongsTo(TablaDB, {
    foreignKey: 'idTablas',
    sourceKey: 'id'
});




    //   Transaccion.sync({ alter: true }).then(() => {
    //       console.log('se creo con exito la tabla  Transaccion ');
    //   });


// (async () => {
//     try{ 
//     await TablaDB.sync({ alter: true });
//     console.log("Se cargo correctamente");
//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();


// Columna.sync({ alter: true }).then(() => {
//     console.log('tabla TablaDB Columna');
// });


module.exports = { TablaDB }