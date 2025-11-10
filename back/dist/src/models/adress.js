"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Address extends sequelize_1.Model {
}
exports.Address = Address;
Address.init({
    address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
    },
    type: {
        type: sequelize_1.DataTypes.TEXT,
        validate: { isIn: [["shipping", "billing"]] },
    },
    street_number: sequelize_1.DataTypes.TEXT,
    street_name: sequelize_1.DataTypes.TEXT,
    complement: sequelize_1.DataTypes.TEXT,
    zip_code: sequelize_1.DataTypes.TEXT,
    city: sequelize_1.DataTypes.TEXT,
    country: sequelize_1.DataTypes.TEXT,
    is_default: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
}, {
    sequelize: db_1.sequelize,
    tableName: "addresses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
