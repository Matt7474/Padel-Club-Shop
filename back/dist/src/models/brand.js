"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Brand extends sequelize_1.Model {
}
exports.Brand = Brand;
Brand.init({
    brand_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "brand_id",
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: "name",
    },
    logo: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "logo",
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "brands",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
