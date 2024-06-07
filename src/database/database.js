
const { Sequelize } = require("sequelize");



const sequelize = new Sequelize(
    "dbepco7agwmwba",
    "uhxm0qdfefvou",
    "DesaSolUn",
    {
        host: "34.174.109.166",
        host: "34.174.109.166",
        dialect: "mysql",
    }
);


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