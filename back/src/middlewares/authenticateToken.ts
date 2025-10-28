import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserPayload } from "../types/express";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
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
		const payload = jwt.verify(token, secret) as UserPayload;
		req.user = payload;
		next();
	} catch (err: unknown) {
		if (err instanceof Error) {
			return res.status(401).json({ message: "Token invalide ou expiré" });
		}
		return res.status(401).json({ message: "Token invalide ou expiré" });
	}
};
