
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dbepco7agwmwba", "devusr","efHBxdcV",
    {
        // host: "34.174.109.166",
        host: "172.16.50.27",
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