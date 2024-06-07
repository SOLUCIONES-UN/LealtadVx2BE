const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const {Departamento_Proyectos} = require('./departamento_proyectos');

const Municipio = sequelize.define('municipio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },

    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
  
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull:false
    },
    
    IdLocal: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
    },
    idDepartamento: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
    }

},{timestamps: false});


Municipio.hasMany(Departamento_Proyectos,{
    foreignKey: 'idMunicipio',
    sourceKey: 'id'
});

Departamento_Proyectos.belongsTo(Municipio, {
    foreignKey: 'idMunicipio',
    targetKey: 'id',
});


//  (async () => {
//      await Municipio.sync({ alter: true });
   
//  })();




//  Departamento_Proyectos.sync({ alter: true }).then(() => {
//     console.log('tabla TransaccionPremio creada');
// });

module.exports = {Municipio}