import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	// 🕵️ LOGS DÉTAILLÉS
	// console.log("🔹 Requête :", req.method, req.originalUrl);
	// console.log("🔹 Authorization header :", authHeader);

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
		const payload = jwt.verify(token, secret) as jwt.JwtPayload;
		(req as Request & { user?: jwt.JwtPayload }).user = payload;
		next();
	} catch (err: unknown) {
		if (err instanceof Error) {
			// console.error("❌ Token invalide :", err.message);
			// console.error("🔸 Route concernée :", req.method, req.originalUrl);
			// console.error("🔸 Token reçu :", token);
			return res.status(401).json({ message: "Token invalide ou expiré" });
		}
		return res.status(401).json({ message: "Token invalide ou expiré" });
	}
};
