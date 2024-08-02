const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const {CampaniaInternoNumber} = require('../models/campaniaInternaNumber');
const {Premio} = require('../models/premio');

const CampaniaInterna = sequelize.define('campanias_internas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tituloNotificacion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    descripcionNotificacion: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    imgCampania: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    imgNotificacion: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    tipoCampania: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    esArchivada: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    
}, { timestamps: false });

CampaniaInterna.hasMany(CampaniaInternoNumber,{
    foreignKey: 'idCampaniaInterna',
    sourceKey: 'id'
});

CampaniaInternoNumber.belongsTo(CampaniaInterna, {
    foreignKey: 'idCampaniaInterna',
    targetId: 'id',
});
// Campania.belongsTo(Usuario, { foreignKey: 'tipoUsuario' });

// Campania.hasMany(Configuraciones, {
//     foreignKey: 'idCampania',
//     sourceKey: 'id'
// });

// Configuraciones.belongsTo(Campania, {
//     foreignKey: 'idCampania',
//     targetId: 'id',
// });


// Campania.sync({ alter: true }).then(() => {
//     console.log('tabla campania creada');
// });

// Configuraciones.sync({ alter: true }).then(() => {
//     console.log('Tabla Configuraciones creada o actualizada correctamente');
// });

// Etapa.sync({ alter: true }).then(() => {
//     console.log('tabla Campania creada');
// });


// Participacion.sync({ alter: true }).then(() => {
//     console.log('tabla Participacion creada');
// });


// FailTransaccion.sync({ alter: true }).then(() => {
//     console.log('tabla failTransaccion creada');
// });


// CampaniaValidation.sync({ alter: true }).then(() => {
//     console.log('tabla Configurevalidation creada');
// });


// (async () => {
//     await CampaniaInternoNumber.sync({ alter: true });
//     // Code here
//  })();



module.exports = { CampaniaInterna };