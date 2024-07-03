const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/database');

const {Municipio} = require('./municipio');
const {Departamento_Proyectos} = require('./departamento_proyectos');

const Departamento = sequelize.define('departamento', {
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
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
  
}, {timestamps: false}); 

Departamento.hasMany(Municipio,{
    foreignKey: 'idDepartamento',
    sourceKey: 'id'
});

Municipio.belongsTo(Departamento, {
    foreignKey: 'idDepartamento',
    targetId: 'id',
});



//  (async () => {
//      await Departamento.sync({ alter: true });
   
//  })();


// Departamento.sync({ alter: true }).then(() => {
//     console.log('tabla Departamento creada');
// });


// Municipio.sync({ alter: true }).then(() => {
//     console.log('tabla Municipio creada');
// });

module.exports = {Departamento}