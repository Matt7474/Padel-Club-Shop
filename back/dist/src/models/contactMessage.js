"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessage = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class ContactMessage extends sequelize_1.Model {
}
exports.ContactMessage = ContactMessage;
// Définition du modèle Sequelize
ContactMessage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    subject: {
        type: sequelize_1.DataTypes.ENUM("general", "order", "product", "complaint", "partnership", "other"),
        allowNull: false,
    },
    order_number: {
        type: sequelize_1.DataTypes.STRING(17),
        allowNull: true,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    response: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("new", "in_progress", "resolved", "closed"),
        allowNull: false,
        defaultValue: "new",
    },
    is_read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "contact_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
