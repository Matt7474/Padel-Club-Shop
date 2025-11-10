"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.db = db;
const sequelize_1 = require("sequelize");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
exports.sequelize = new sequelize_1.Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,
});
require("../models/article");
require("../models/brand");
require("../models/associations");
async function db() {
    try {
        await exports.sequelize.authenticate();
        console.log("Database connected!");
        await exports.sequelize.sync({ alter: true });
        console.log("Models synchronized!");
    }
    catch (err) {
        console.error("DB init failed:", err);
        process.exit(1);
    }
}
