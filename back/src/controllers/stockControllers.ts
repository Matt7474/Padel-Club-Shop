import type { Request, Response } from "express";
import { Article } from "../models/article";

interface TechCharacteristics {
	fit?: string | Record<string, number>;
	[key: string]: unknown;
}

interface ArticleAttributes {
	name: string;
	stock_quantity: number | null;
	tech_characteristics: TechCharacteristics | null;
}

interface CartItem {
	id: number;
	name?: string;
	size?: string;
	quantity: number;
}

export const checkStockBeforePayment = async (req: Request, res: Response) => {
	try {
		const { cart } = req.body as { cart: CartItem[] };

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
			const article = (await Article.findByPk(item.id, {
				attributes: ["name", "stock_quantity", "tech_characteristics"],
				raw: true,
			})) as ArticleAttributes | null;

			if (!article) {
				updates.push({
					id: item.id,
					name: item.name ?? "Article inconnu",
					newQuantity: 0,
				});
				continue;
			}

			const { name, stock_quantity, tech_characteristics } = article;

			// --- 1️⃣ Cas : article AVEC tailles ---
			if (tech_characteristics?.fit && item.size) {
				let fitMap: Record<string, number> = {};

				if (typeof tech_characteristics.fit === "string") {
					tech_characteristics.fit.split(",").forEach((pair: string) => {
						const [label, stock] = pair.split(":");
						fitMap[label.trim()] = Number(stock);
					});
				} else if (typeof tech_characteristics.fit === "object") {
					fitMap = { ...tech_characteristics.fit };
				}

				const sizeStock = fitMap[item.size] ?? 0;

				if (item.quantity > sizeStock) {
					updates.push({
						id: item.id,
						name,
						size: item.size,
						newQuantity: sizeStock,
					});
				} else if (sizeStock <= 0) {
					updates.push({
						id: item.id,
						name,
						size: item.size,
						newQuantity: 0,
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
