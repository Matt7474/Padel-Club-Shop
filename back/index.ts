import dotenv from "dotenv";
const envFile =
	process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
dotenv.config({ path: envFile });

import path from "node:path";
import cors from "cors";
import http from "node:http";
import express from "express";
import bodyParser from "body-parser";

import { initWebSocketServer } from "./src/wsServer";
import { sequelize } from "./src/database/db";
import { router } from "./src/router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);

initWebSocketServer(server);

server.listen(PORT, async () => {
	console.log(`Server running on http://localhost:${PORT}`);
	try {
		await sequelize.authenticate();
		console.log("✅ DB connection OK");
	} catch (err) {
		console.error("❌ DB connection failed:", err);
	}
});
