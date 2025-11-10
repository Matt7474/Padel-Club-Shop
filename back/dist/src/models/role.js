"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Role extends sequelize_1.Model {
}
exports.Role = Role;
Role.init({
    role_id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: sequelize_1.DataTypes.TEXT, allowNull: false, unique: true },
}, {
    sequelize: db_1.sequelize,
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
