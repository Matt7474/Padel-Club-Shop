"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Article extends sequelize_1.Model {
}
exports.Article = Article;
Article.init({
    article_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "article_id",
    },
    type: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "type",
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: "name",
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "description",
    },
    reference: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        unique: true,
        field: "reference",
    },
    brand_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "brands",
            key: "brand_id",
        },
    },
    price_ttc: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "price_ttc",
    },
    stock_quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "stock_quantity",
    },
    status: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "status",
        validate: {
            isIn: [["available", "preorder", "out_of_stock"]],
        },
    },
    shipping_cost: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "shipping_cost",
    },
    tech_characteristics: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        field: "tech_characteristics",
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_deleted",
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "articles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
