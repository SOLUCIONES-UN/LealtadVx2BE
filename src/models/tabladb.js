const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Columna } = require('./columna');
const { Transaccion } = require('./transaccion');

const TablaDB = sequelize.define('tabladb',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    nombre_tabla:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
},{timestamps: false});

TablaDB.hasMany(Columna,{
    foreignKey: 'idTablas',
    sourceKey: 'id'
});

Columna.belongsTo(TablaDB,{
    foreignKey: 'idTablas',
    sourceKey: 'id'
});



//  (async ()=> {
//    await Transaccion.sync({alter:true})
// })()
// (async ()=> {
//     await TablaDB.sync({alter:true})
//  })()

module.exports = {TablaDB}