const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Profecion = sequelize.define('profesiones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true

        
    }, proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});




// (async () => {
//     try{ 
//     await Profecion.sync({ alter: true });
//     console.log("Se cargo correctamente");
//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

module.exports = {Profecion}
