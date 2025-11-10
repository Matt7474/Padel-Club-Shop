"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// middlewares/upload.ts
const node_path_1 = __importDefault(require("node:path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/"); // dossier où tu stockes les images
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueSuffix + node_path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
