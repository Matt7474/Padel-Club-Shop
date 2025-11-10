"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
dotenv_1.default.config({ path: envFile });
// dotenv.config({ path: ".env.production" });
require("./src/models/associations");
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const wsServer_1 = require("./src/wsServer");
const db_1 = require("./src/database/db");
const router_1 = require("./src/router");
// import swaggerRouter from "./src/swagger/swagger";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
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
}));
// const swaggerPath = path.resolve(__dirname, "src/swagger/swagger.yaml");
// const swaggerDocument = YAML.load(swaggerPath);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// app.use(swaggerRouter);
app.use(router_1.router);
if (process.env.NODE_ENV === "production") {
    app.use("/uploads", express_1.default.static(node_path_1.default.join(__dirname, "..", "uploads")));
}
else {
    app.use("/uploads", express_1.default.static(node_path_1.default.join(__dirname, "uploads")));
}
const server = node_http_1.default.createServer(app);
(0, wsServer_1.initWebSocketServer)(server);
server.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        await db_1.sequelize.authenticate();
        console.log("✅ DB connection OK");
    }
    catch (err) {
        console.error("❌ DB connection failed:", err);
    }
});
