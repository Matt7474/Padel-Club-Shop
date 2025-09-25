import type { Request, Response } from "express";
import { Promotion } from "../models/promotion";

// Création d'une promotion pour un article
export const createPromo = async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params;
		const {
			name,
			description,
			discount_type,
			discount_value,
			start_date,
			end_date,
		} = req.body;

		// Validation minimale
		if (!discount_value || !start_date || !end_date) {
			return res.status(400).json({ message: "Champs obligatoires manquants" });
		}

		const now = new Date();
		let status: "active" | "upcoming" | "expired" = "upcoming";
		const startDate = new Date(start_date);
		const endDate = new Date(end_date);

		if (startDate <= now && endDate >= now) status = "active";
		else if (endDate < now) status = "expired";

		// Création de la promotion
		const promo = await Promotion.create({
			article_id: Number(articleId),
			name: name ?? null,
			description: description ?? null,
			discount_type: discount_type ?? "%",
			discount_value,
			start_date: startDate,
			end_date: endDate,
			status,
		});

		res.status(201).json(promo);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la création de la promotion" });
	}
};

// Récupération des promotions d'un article
export const getPromos = async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params;
		const promos = await Promotion.findAll({
			where: { article_id: Number(articleId) },
		});
		res.json(promos);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des promotions" });
	}
};
