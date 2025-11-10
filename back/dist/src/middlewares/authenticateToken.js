"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        console.warn("⚠️ Aucune Authorization header reçue !");
        return res.status(401).json({ message: "Token manquant" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("❌ JWT_SECRET non défini !");
        return res
            .status(500)
            .json({ message: "Erreur serveur : JWT_SECRET non défini" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
exports.authenticateToken = authenticateToken;
