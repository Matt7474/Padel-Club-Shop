"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "user_id",
    },
    last_name: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    first_name: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    phone: sequelize_1.DataTypes.TEXT,
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "roles", key: "role_id" },
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
