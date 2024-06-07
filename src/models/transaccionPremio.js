const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const TransaccionPremio = sequelize.define('transaccionpremios', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    }
    
}, { timestamps: false });

// (async () => {
//     await TransaccionPremio.sync({ alter: true });
   
// })();

module.exports = { TransaccionPremio, sequelize }