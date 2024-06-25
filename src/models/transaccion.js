const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { asignarCategoria } = require('./asignarCategoria');
const { Participacion } = require('./Participacion');
const { Premio } = require('./premio');
const { FailTransaccion } = require('./failTransaccion');




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
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },

}, { timestamps: false });

Transaccion.hasMany(asignarCategoria, {
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

asignarCategoria.belongsTo(Transaccion, {
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});

Transaccion.hasMany(Participacion, {
    foreignKey: {
        name: 'idTransaccion',
        allowNull: false,
    },
    sourceKey: 'id',
    allowNull: false
});

Participacion.belongsTo(Transaccion, {
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});

Transaccion.hasMany(Premio, {
    foreignKey: 'idTransaccion',
    sourceKey: 'id',
    allowNull: false

});

Premio.belongsTo(Transaccion, {
    foreignKey: 'idTransaccion',
    targetId: 'id',
    allowNull: false
});

Transaccion.hasMany(FailTransaccion, {
    foreignKey: 'idTransaccion',
    sourceKey: 'id',
    allowNull: false

});

FailTransaccion.belongsTo(Transaccion, {
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

// Premio.sync({ alter: true }).then(() => {
//       console.log('se creo con exito la tabla  Premio ');
//   });



// FailTransaccion.sync({ alter: true }).then(() => {
//     console.log('tabla failTransaccion creada');
// });




module.exports = { Transaccion }