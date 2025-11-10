"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotions = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Promotions extends sequelize_1.Model {
}
exports.Promotions = Promotions;
// Définition du modèle
Promotions.init({
    promo_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    article_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "articles",
            key: "article_id",
        },
        onDelete: "CASCADE",
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    discount_type: {
        type: sequelize_1.DataTypes.ENUM("amount", "percent"),
        allowNull: false,
        defaultValue: "percent",
    },
    discount_value: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("active", "upcoming", "expired"),
        allowNull: true,
    },
}, {
    tableName: "promotions",
    sequelize: db_1.sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
