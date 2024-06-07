// const { DataTypes } = require('sequelize');
// const { genesis, sequelize } = require('../database/database');

// // Creación de la tabla y declaración de sus atributos correspondientes

// const Codigos_referidos = genesis.define('codigos_referidos', {
//   idCodigos_referidos: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   idUsuario: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   codigo: {
//     type: DataTypes.STRING(64),
//   },
//   tipoDuracion: {
//     type: DataTypes.INTEGER,
//   },
//   duracion: {
//     type: DataTypes.INTEGER,
//   },
//   fecha: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   idconfi_referidos: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
// });

// // (async () => {
// //     await Campania.sync({ alter: true });
// //  })();

// module.exports = {Codigos_referidos};
