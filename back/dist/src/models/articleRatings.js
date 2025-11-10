"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRatings = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class ArticleRatings extends sequelize_1.Model {
}
exports.ArticleRatings = ArticleRatings;
ArticleRatings.init({
    rating_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    article_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "articles", key: "article_id" },
        onDelete: "CASCADE",
    },
    maneuverability: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    power: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    comfort: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    spin: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    tolerance: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    control: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
}, {
    sequelize: db_1.sequelize,
    tableName: "article_ratings",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
