"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "order_id",
    },
    reference: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: "reference",
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
    },
    vat_rate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        defaultValue: 20,
        field: "vat_rate",
    },
    total_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: "total_amount",
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "paid", "processing", "ready", "shipped", "cancelled", "refund"),
        defaultValue: "paid",
        field: "status",
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_deleted",
    },
    payment_intent_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "payment_intent_id",
    },
    refund_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "refund_id",
    },
    refunded_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "refunded_at",
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
