const { Sequelize } = require("sequelize");


// const sequelize = new Sequelize("lealtadV2", "DesaSolUn", "SolUn123", {
//   //host: '192.168.1.100',
//   host: "34.41.150.90",
//   dialect: "mysql", 
// });

// const sequelize = new Sequelize("lealtadV2", "root", "B@rilhas2003", {
//   //host: '192.168.1.100',
//   host: "localhost",
//   dialect: "mysql",
// });

const sequelize = new Sequelize("lealtadv2", "asofi", "Pruebas2024", {
  //host: '192.168.1.100',
  host: "127.0.0.1",
  dialect: "mysql",
});


const pronet = new Sequelize(
    "pronet",
    "devusr",
    "efHBxdcV", {
        host: "35.223.201.149",
        port: "3306",
        dialect: "mysql",
    }
)

module.exports = { sequelize, pronet };