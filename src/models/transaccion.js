const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { asignarCategoria } = require('./asignarCategoria');
const { Participacion } = require('./Participacion');



const Transaccion = sequelize.define('transaccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
  
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull:false
    },

},{timestamps: false});

Transaccion.hasMany(asignarCategoria,{
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

asignarCategoria.belongsTo(Transaccion,{
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});

Transaccion.hasMany(Participacion,{
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

Participacion.belongsTo(Transaccion,{
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});


// (async () => {
//     try{ 
//     await Transaccion.sync({ alter: true });
//     console.log("Se cargo correctamente");
//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

    // Transaccion.sync({ alter: true }).then(() => {
    //       console.log('se creo con exito la tabla  Transaccion ');
    //   });

module.exports = {Transaccion}
