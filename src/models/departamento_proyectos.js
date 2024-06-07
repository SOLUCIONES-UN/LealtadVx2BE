const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Departamento_Proyectos = sequelize.define(
  "departamento_proyectos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

//  (async () => {
//      await Departamento_Proyectos.sync({ alter: true });

//  })();

module.exports = { Departamento_Proyectos, sequelize };
