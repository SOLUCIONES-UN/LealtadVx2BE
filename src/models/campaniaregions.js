const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { Campania } = require('./campanias');
const { Departamento } = require('./departamento');
const { Municipio } = require('./municipio');

const CampaniaRegiones = sequelize.define('campaniaregiones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCampania: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idDepartamento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idMunicipio: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    limites: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    listos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    presupuesto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'campaniaregiones', // asegurándonos de que el nombre de la tabla en Sequelize coincida con el de MySQL
});

Departamento.hasMany(CampaniaRegiones, {
    foreignKey: 'idDepartamento'
});
CampaniaRegiones.belongsTo(Departamento, {
    foreignKey: 'idDepartamento'
});

Municipio.hasMany(CampaniaRegiones, {
    foreignKey: 'idMunicipio'
});
CampaniaRegiones.belongsTo(Municipio, {
    foreignKey: 'idMunicipio'
});

Campania.hasMany(CampaniaRegiones, {
    foreignKey: 'idCampania'
});
CampaniaRegiones.belongsTo(Campania, {
    foreignKey: 'idCampania'
});


// (async () => {
//     await CampaniaRegiones.sync({ alter: true });
//     //Code here
// })();

module.exports = {CampaniaRegiones}