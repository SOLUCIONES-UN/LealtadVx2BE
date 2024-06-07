const { DataTypes } = require('sequelize');
const { pronet } = require('../database/database');
// const { Campania } = require('../models/campanias');

const EmuladorUsuario = pronet.define('tbl_customer', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_userid: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    customer_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    customer_reference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    limit_balance_diary: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    telno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    municipality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    income: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    expenses: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    economic_activity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_updated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    dpi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nit: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firebase_refid: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dpi_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    selfie_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reverse_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dpi_result: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dpi_reverse: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pronet_customer_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_finish_registration: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    genesis_finish_registration: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    genesis_link_account: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    genesis_userid: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    genesis_reg_step: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    kyc_ingreso: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    kyc_egresos: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    id_customerchant: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    has_commerce: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    income_sources: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currently_working: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    fk_medio: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    has_life_validate: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_complete_profile: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_infornet: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_validate_dpi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    en_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    disable_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    view_kresco: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    monthly_income: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    monthly_expenses: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    profile_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    inmigration_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sign_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    view_refers: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_sign: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    faceMatching: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_campain: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    code_autopay: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    has_info_to_update: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    change_device: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    change_device_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    review_needed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    life_validate_rejected: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    bpc_customer_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bpc_account_number: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
});

// EnviaPremio.belongsTo(Campania, { foreignKey: 'campania', as: 'campaign' });

module.exports = { EmuladorUsuario };
