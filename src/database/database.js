const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//     "lealtadV2",
//     "DesaSolUn",
//     "SolUn123",
//     //   "root",
//     // "admin",
//     {
// <<<<<<< feature/campañas
//         host: "34.136.61.24",
// =======
//         host: "34.136.61.24",
// >>>>>>> staging

//         // host: 'localhost',
//         dialect: "mysql",
//     }
// );

// const sequelize = new Sequelize("lealtadv2", "asofi", "Pruebas2024", {
//     //host: '192.168.1.100',
//     host: "127.0.0.1",
//     dialect: "mysql",
//   });

const pronet = new Sequelize("pronet", "devusr", "efHBxdcV", {
    host: "172.16.50.27",
    port: "3306",
    dialect: "mysql",
});

const genesis = new Sequelize("genesis", "devusr", "efHBxdcV", {
    host: "172.16.50.27",
    port: "3306",
    dialect: "mysql",
});

module.exports = { sequelize, pronet, genesis };