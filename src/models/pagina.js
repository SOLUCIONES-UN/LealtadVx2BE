const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { permisoUsuario } = require('./permisoUsuario');

//Creacion de tabla y declaracion de sus atributos correspondientes
const Pagina = sequelize.define('pagina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    path: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    icono: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
},{timestamps: false});

Pagina.hasMany(permisoUsuario, {
    foreignKey: 'idPagina',
    sourceKey: 'id',
});

permisoUsuario.belongsTo(Pagina, {
    foreignKey: 'idPagina',
    targetId: 'id',
});


// (async () => {
//     try{ 
//     await Pagina.sync({ alter: true });
//     console.log("Se cargo correctamente");
    

//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

module.exports = {Pagina}