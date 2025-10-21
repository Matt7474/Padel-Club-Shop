import type { Request, Response } from "express";
import { Article } from "../models/article";

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
			size?: string;
			newQuantity: number;
		}[] = [];

		for (const item of cart) {
			const article = await Article.findByPk(item.id, {
				attributes: ["name", "stock_quantity", "tech_characteristics"],
			});

			if (!article) {
				updates.push({
					id: item.id,
					name: item.name ?? "Article inconnu",
					newQuantity: 0,
				});
				continue;
			}

			const { name, stock_quantity, tech_characteristics } = article as any;

			// --- 1️⃣ Cas : article AVEC tailles ---
			if (tech_characteristics?.fit && item.size) {
				const fitString = tech_characteristics.fit as string;
				const sizePairs = fitString.split(",").map((pair: string) => {
					const [label, stock] = pair.split(":");
					return { label: label.trim(), stock: Number(stock) };
				});

				const sizeData = sizePairs.find((s) => s.label === item.size);

				if (!sizeData) {
					updates.push({
						id: item.id,
						name,
						size: item.size,
						newQuantity: 0,
					});
				} else if (item.quantity > sizeData.stock) {
					updates.push({
						id: item.id,
						name,
						size: item.size,
						newQuantity: sizeData.stock,
					});
				}
			}

			// --- 2️⃣ Cas : article SANS tailles ---
			else {
				const dbStock = stock_quantity ?? 0;

				if (dbStock <= 0) {
					updates.push({
						id: item.id,
						name,
						newQuantity: 0,
					});
				} else if (item.quantity > dbStock) {
					updates.push({
						id: item.id,
						name,
						newQuantity: dbStock,
					});
				}
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
