const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const { CampaniaInterna} = require('../models/campaniasinterno');

const CampaniaInternoNumber = sequelize.define('numerosCampaniasInternas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    idCampaniaInterna: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, { timestamps: false });


// CampaniaInternoNumber.belongsTo(CampaniaInterna, {
//     foreignKey: 'idCampaniaInterna',
//     targetId: 'id',
// });

// CampaniaInterna.hasMany(CampaniaInternoNumber,{
//     foreignKey: 'idCampaniaInterna',
//     sourceKey: 'id'
// });

// CampaniaInternoNumber.belongsTo(CampaniaInterna, {
//     foreignKey: 'idCampaniaInterna',
//     targetId: 'id',
// });

// (async () => {
//     try{ 
//     await CampaniaInternoNumber.sync({ alter: true });
//     console.log("Se cargo correctamente");


//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

// CampaniaInterna.sync({ alter: true }).then(() => {
//     console.log('tabla CampaniaInternoNumber creada');
// });

// CampaniaInternoNumber.sync({ alter: true }).then(() => {
//     console.log('tabla failTransaccion creada');
// });

module.exports = { CampaniaInternoNumber };