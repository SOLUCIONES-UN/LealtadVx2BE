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
    IdLocal: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
    }
}, {timestamps: false}); 

Departamento.hasMany(Municipio,{
    foreignKey: 'idDepartamento',
    sourceKey: 'id'
});

Municipio.belongsTo(Departamento, {
    foreignKey: 'idDepartamento',
    targetId: 'id',
});

Departamento.hasMany(Departamento_Proyectos,{
    foreignKey: 'idDepartamento',
    sourceKey: 'id'
});

Departamento_Proyectos.belongsTo(Departamento, {
    foreignKey: 'idDepartamento',
    targetKey: 'id',
});

//  (async () => {
//      await Departamento.sync({ alter: true });
   
//  })();



// Departamento_Proyectos.sync({ alter: true }).then(() => {
//     console.log('tabla TransaccionPremio creada');
// });
module.exports = {Departamento}