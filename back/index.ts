import dotenv from "dotenv";
import path from "node:path";
import cors from "cors";

const envFile =
	process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
dotenv.config({ path: envFile });

import express from "express";
import { sequelize } from "./src/database/db";
import { router } from "./src/router";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
	try {
		await sequelize.authenticate();
		console.log("✅ DB connection OK");
	} catch (err) {
		console.error("❌ DB connection failed:", err);
	}
})();

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
