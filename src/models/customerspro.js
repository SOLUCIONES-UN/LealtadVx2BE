const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia de Sequelize ya configurada

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_userid: {
    type: DataTypes.INTEGER
  },
  customer_number: {
    type: DataTypes.STRING
  },
  customer_reference: {
    type: DataTypes.STRING
  },
  balance: {
    type: DataTypes.FLOAT
  },
  limit_balance_diary: {
    type: DataTypes.FLOAT
  },
  telno: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  municipality: {
    type: DataTypes.STRING
  },
  profession: {
    type: DataTypes.STRING
  },
  income: {
    type: DataTypes.STRING
  },
  expenses: {
    type: DataTypes.STRING
  },
  economic_activity: {
    type: DataTypes.STRING
  },
  date_updated: {
    type: DataTypes.DATE
  },
  dpi: {
    type: DataTypes.STRING
  },
  nit: {
    type: DataTypes.STRING
  },
  firebase_refid: {
    type: DataTypes.STRING
  },
  language: {
    type: DataTypes.STRING
  },
  dpi_url: {
    type: DataTypes.STRING
  },
  // Continúa definiendo los campos restantes según tu estructura
}, {
  tableName: 'tbl_customer', // Nombre de la tabla en la base de datos
  timestamps: false // Indica que la tabla no tiene timestamps created_at y updated_at
});

// (async () => {
//     await Campania.sync({ alter: true });
//  })();

module.exports = {Customer};
