const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
// const { participacionReferidos } = require('./participacionReferidos');

//Creacion de tabla y declaracion de sus atributos correspondientes
const ConfigReferido = sequelize.define('configreferidos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    tipoDuracion : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    duracion : {
        type: DataTypes.INTEGER,            
        allowNull: false
    },
    fechaActualizacion : {
        type: DataTypes.DATEONLY,
        
    },
    urlApi : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    textoUrl : {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    iconoMostrar: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    iconoMostrar: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
},{timestamps: false});


// ConfigReferido.bel(participacionReferidos, {
//     foreignKey: 'configReferidoId', // Clave foránea en participacionReferidos
//     sourceKey: 'id' // Clave primaria en ConfigReferido
// });



//relacion entre tablas, menu tiene muchas paginas
/*Menu.hasMany(Pagina,{
    foreignKey: 'idMenu',
    sourceKey: 'id'
});*/


//   (async () => {
//     await ConfigReferido.sync({ alter: true });
//   })(); 


// (async () => {
//     try{ 
//     await ConfigReferido.sync({ alter: true });
//     console.log("Se cargo correctamente");
    

//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

module.exports = {ConfigReferido}