import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token manquant" });
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		console.error(
			"❌ JWT_SECRET non défini dans les variables d'environnement !",
		);
		return res
			.status(500)
			.json({ message: "Erreur serveur : JWT_SECRET non défini" });
	}

	try {
		const payload = jwt.verify(token, secret);
		(req as any).user = payload;
		next();
	} catch (err) {
		console.error("❌ Token invalide :", err);
		return res.status(403).json({ message: "Token invalide" });
	}
};
