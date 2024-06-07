const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');


const Parametro = sequelize.define('parametro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    limiteParticipacion: {
        type: DataTypes.INTEGER
    },
    idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipoTransaccion: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    ValorMinimo: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    },
    ValorMaximo: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    }, 
    valorAnterior : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    limiteDiario:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado : {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{timestamps: false});


/*(async () => {
await sequelize.sync({ force: false });
//     // Code here
})();*/

module.exports = {Parametro}