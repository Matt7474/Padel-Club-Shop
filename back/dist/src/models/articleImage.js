"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleImage = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class ArticleImage extends sequelize_1.Model {
}
exports.ArticleImage = ArticleImage;
ArticleImage.init({
    image_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    article_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    is_main: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "article_images",
    timestamps: true,
    underscored: true,
});
