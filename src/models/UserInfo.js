// const { DataTypes } = require('sequelize');
// const { pronet } = require('../database/database');

// const tblUserInfo = pronet.define('tblUserInfo', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     fk_userid: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
//     username: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     password: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//         charset: 'latin1',
//     },
//     status: {
//         type: DataTypes.ENUM(
//             'ACTIVE',
//             'STAND_BY',
//             'REJECTED',
//             'BLOCK',
//             'BLOCK_LOGIN',
//             'CANCELLED',
//             'INACTIVE'
//         ),
//         allowNull: false,
//     },
//     ipadd: {
//         type: DataTypes.STRING(100),
//         allowNull: true,
//         charset: 'latin1',
//     },
//     reset_password: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
//     processManual: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     date_entermanual: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     rejected_activated: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     lastResetPasword2: {
//         type: DataTypes.TIMESTAMP,
//         allowNull: true,
//         defaultValue: DataTypes.NOW,
//     },
//     lastResetPasword: {
//         type: DataTypes.TIMESTAMP,
//         allowNull: true,
//         defaultValue: DataTypes.NOW,
//     },
//     login_attempts: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
// }, {
//     tableName: 'tblUserInfo',
//     timestamps: false
// });

// module.exports = { tblUserInfo };
