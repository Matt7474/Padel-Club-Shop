"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class OrderItem extends sequelize_1.Model {
}
exports.OrderItem = OrderItem;
OrderItem.init({
    order_line_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "order_line_id",
    },
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "order_id",
    },
    article_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "article_id",
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "quantity",
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "price",
    },
    size: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "size",
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "order_lines",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
