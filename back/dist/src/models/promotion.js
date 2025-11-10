"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotion = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Promotion extends sequelize_1.Model {
}
exports.Promotion = Promotion;
// Définition du modèle
Promotion.init({
    promo_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
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
    tableName: "promotion",
    sequelize: db_1.sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
