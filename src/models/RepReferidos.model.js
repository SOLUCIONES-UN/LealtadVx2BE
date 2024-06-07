const { DataTypes } = require('sequelize');
const { sequelize, pronet } = require('../database/database');

// Modelos para la primera base de datos
const ParticipanteCampana = sequelize.define('participante_campana', {
  fechaParticipacion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  idTransaccion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descTransaccion: {
    type: DataTypes.STRING
  },
  valorPremio: {
    type: DataTypes.FLOAT
  }
});

// Define el modelo para la tabla 'enc_campana'
const EncCampana = sequelize.define('enc_campana', {
  nombreCampana: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcionNotificacion: {
    type: DataTypes.STRING
  }
});

// Define el modelo para la tabla 'tblUserInformation'
const UserInformation = sequelize.define('tblUserInformation', {
  fname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userno: {
    type: DataTypes.INTEGER
  }
});

// Define el modelo para la tabla 'codigos_referidos'
const CodigosReferidos = sequelize.define('codigos_referidos', {
  codigo: {
    type: DataTypes.STRING
  }
});

// Define el modelo para la tabla 'confi_referidos'
const ConfiReferidos = sequelize.define('confi_referidos', {
  opcion: {
    type: DataTypes.STRING
  }

  // (async () => {
//     await Campania.sync({ alter: true });
//  })();

});