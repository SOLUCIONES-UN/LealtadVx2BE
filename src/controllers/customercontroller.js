const { Customer } = require('../models'); // Importa el modelo Customer

const getCustomers = async (req, res) => {
  try {
    // Utiliza el método findAll() de Sequelize para obtener todos los clientes
    const customers = await Customer.findAll();

    // Envía los clientes como respuesta en formato JSON
    res.json(customers);
  } catch (error) {
    // Manejo de errores: envía un mensaje de error si ocurrió algún problema
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener los clientes.' });
  }
};

module.exports = { getCustomers };
