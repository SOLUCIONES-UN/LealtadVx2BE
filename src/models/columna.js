const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Transaccion }  = require('./transaccion')


const Columna = sequelize.define('columna', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    fila_insertada : {
        type: DataTypes.INTEGER,
        defaultValue: 0,
  
    },
    fila_actualizada : {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});


Columna.hasMany(Transaccion,{
    foreignKey: 'idColumna',
    sourceKey: 'id'
});

Transaccion.belongsTo(Columna, {
    foreignKey: 'idColumna',
    targetId: 'id',
    
});



// (async () => {
//     try{ 
//     await Columna.sync({ alter: true });
//     console.log("Se cargo correctamente");
    

//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();


module.exports = {Columna}