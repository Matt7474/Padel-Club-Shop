"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Message extends sequelize_1.Model {
}
exports.Message = Message;
Message.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: sequelize_1.DataTypes.BOOLEAN,
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
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
