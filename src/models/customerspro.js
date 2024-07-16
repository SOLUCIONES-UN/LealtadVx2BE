const { DataTypes } = require('sequelize');
const { pronet } = require('../database/database');

const Customer = pronet.define('tbl_customer', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fk_userid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    customer_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customer_reference: {
        type: DataTypes.STRING,
        allowNull: true
    },
    balance: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 100.00
    },
    limit_balance_diary: {
        type: DataTypes.DOUBLE(14, 2),
        defaultValue: 10000.00,
        comment: 'Limite de Saldo'
    },
    telno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    municipality: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true
    },
    income: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expenses: {
        type: DataTypes.STRING,
        allowNull: true
    },
    economic_activity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_updated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dpi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nit: {
        type: DataTypes.STRING,
        defaultValue: 'CF'
    },
    firebase_refid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    language: {
        type: DataTypes.STRING(10),
        defaultValue: 'en'
    },
    dpi_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selfie_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reverse_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dpi_result: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    dpi_reverse: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pronet_customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_finish_registration: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    genesis_finish_registration: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    genesis_link_account: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    genesis_userid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    genesis_reg_step: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kyc_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    kyc_egresos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_customerchant: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    has_commerce: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    income_sources: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currently_working: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    fk_medio: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    has_life_validate: {
        type: DataTypes.STRING(1),
        defaultValue: '0'
    },
    has_complete_profile: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    has_infornet: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    has_validate_dpi: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    en_verification: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    disable_notifications: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    view_kresco: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    monthly_income: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: true
    },
    monthly_expenses: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0.00,
        comment: '-- gasto aprox mensual Q'
    },
    profile_type: {
        type: DataTypes.STRING(3),
        defaultValue: '',
        comment: 'Tipo de Perfil de Usuario, CDD = Caja Desarrollo'
    },
    inmigration_status: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    sign_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    view_refers: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    has_sign: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    faceMatching: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0.00
    },
    has_campain: {
        type: DataTypes.STRING(1),
        defaultValue: '0',
        comment: 'condicional para saber si tiene campaña asignada (banner)'
    },
    code_autopay: {
        type: DataTypes.STRING(6),
        allowNull: true
    },
    has_info_to_update: {
        type: DataTypes.INTEGER(4),
        defaultValue: 0
    },
    change_device: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    change_device_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    review_needed: {
        type: DataTypes.STRING(1),
        defaultValue: '0'
    },
    life_validate_rejected: {
        type: DataTypes.STRING(1),
        defaultValue: '0'
    },
    bpc_customer_number: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    bpc_account_number: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    show_banner: {
        type: DataTypes.STRING(1),
        defaultValue: '0'
    }
}, {
    tableName: 'tbl_customer',
    timestamps: false
});

module.exports = { Customer };
