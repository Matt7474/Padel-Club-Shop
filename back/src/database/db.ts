import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined in environment variables");
}

export const sequelize = new Sequelize(databaseUrl, {
	dialect: "postgres",
	logging: false,
});

import "../models/article";
import "../models/brand";
import "../models/associations";

export async function db() {
	try {
		await sequelize.authenticate();
		console.log("Database connected!");
		await sequelize.sync({ alter: true });
		console.log("Models synchronized!");
	} catch (err) {
		console.error("DB init failed:", err);
		process.exit(1);
	}
}
