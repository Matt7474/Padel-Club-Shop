import dotenv from "dotenv";
const envFile =
	process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
dotenv.config({ path: envFile });
// dotenv.config({ path: ".env.production" });

import "./src/models/associations";

import path from "node:path";
import cors from "cors";
import http from "node:http";
import express from "express";
import bodyParser from "body-parser";
import { initWebSocketServer } from "./src/wsServer";
import { sequelize } from "./src/database/db";
import { router } from "./src/router";
// import swaggerRouter from "./src/swagger/swagger";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: [
			"https://www.pcs.matt-dev.fr",
			"https://pcs.matt-dev.fr",
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"http://localhost:5000",
			"http://127.0.0.1:5000",
		],
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// const swaggerPath = path.resolve(__dirname, "src/swagger/swagger.yaml");
// const swaggerDocument = YAML.load(swaggerPath);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(express.json());
// app.use(swaggerRouter);
app.use(router);

if (process.env.NODE_ENV === "production") {
	app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
} else {
	app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

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
