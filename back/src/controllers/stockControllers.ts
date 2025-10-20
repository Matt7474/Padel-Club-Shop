import type { Request, Response } from "express";
import { Article } from "../models/article"; // ✅ ton modèle Sequelize

export const checkStockBeforePayment = async (req: Request, res: Response) => {
	try {
		const { cart } = req.body;
		if (!Array.isArray(cart)) {
			return res
				.status(400)
				.json({ status: "error", message: "Panier invalide" });
		}

		const updates: {
			id: number;
			name: string;
			newQuantity: number;
		}[] = [];

		for (const item of cart) {
			const article = await Article.findByPk(item.id, {
				attributes: ["stock_quantity", "name"],
			});

			if (!article) {
				updates.push({
					id: item.id,
					name: item.name ?? "Article inconnu",
					newQuantity: 0,
				});
				continue;
			}

			const dbStock = article.stock_quantity ?? 0;

			if (dbStock <= 0) {
				updates.push({
					id: item.id,
					name: article.name,
					newQuantity: 0,
				});
			} else if (item.quantity > dbStock) {
				updates.push({
					id: item.id,
					name: article.name,
					newQuantity: dbStock,
				});
			}
		}

		if (updates.length > 0) {
			return res.status(200).json({ status: "error", updates });
		}

		return res.status(200).json({ status: "ok" });
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur vérification stock :", err.message);
		} else {
			console.error("Erreur inconnue vérification stock :", err);
		}
		return res.status(500).json({
			status: "error",
			message: "Erreur serveur lors de la vérification du stock",
		});
	}
};

export const updateStockAfterPayment = async (req: Request, res: Response) => {
	try {
		const { cart } = req.body;

		if (!Array.isArray(cart) || cart.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "Panier vide ou invalide",
			});
		}

		for (const item of cart) {
			const article = await Article.findByPk(item.id, {
				attributes: ["article_id", "name", "stock_quantity"],
			});

			if (!article) continue;

			const newQuantity = Math.max(0, article.stock_quantity - item.quantity);

			await article.update({
				stock_quantity: newQuantity,
				updated_at: new Date(),
			});
		}

		return res.status(200).json({
			status: "ok",
			message: "Stock mis à jour avec succès après paiement",
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur mise à jour du stock :", err.message);
		} else {
			console.error("Erreur inconnue mise à jour du stock :", err);
		}
		return res.status(500).json({
			status: "error",
			message: "Erreur serveur lors de la mise à jour du stock",
		});
	}
};
