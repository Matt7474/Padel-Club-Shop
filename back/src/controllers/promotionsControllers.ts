import type { Request, Response } from "express";
import { Promotions } from "../models/promotions";

// Création d'une promotion pour un article
export const createPromos = async (req: Request, res: Response) => {
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
		const promo = await Promotions.create({
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

// Modification d'une promotion existante pour un article
export const updatePromo = async (req: Request, res: Response) => {
	console.log("✅ updatePromo - Params:", req.params, "Body:", req.body);

	try {
		const { articleId, promoId } = req.params;
		const {
			name,
			description,
			discount_type,
			discount_value,
			start_date,
			end_date,
		} = req.body;

		if (!discount_value || !start_date || !end_date) {
			return res.status(400).json({ message: "Champs obligatoires manquants" });
		}

		const now = new Date();
		let status: "active" | "upcoming" | "expired" = "upcoming";
		const startDate = new Date(start_date);
		const endDate = new Date(end_date);

		if (startDate <= now && endDate >= now) status = "active";
		else if (endDate < now) status = "expired";

		const [updatedCount] = await Promotions.update(
			{
				name: name ?? null,
				description: description ?? null,
				discount_type: discount_type ?? "%",
				discount_value,
				start_date: startDate,
				end_date: endDate,
				status,
			},
			{
				where: {
					promo_id: Number(promoId),
					article_id: Number(articleId),
				},
			},
		);

		if (updatedCount === 0) {
			return res.status(404).json({ message: "Promotion non trouvée" });
		}

		const updatedPromo = await Promotions.findOne({
			where: {
				promo_id: Number(promoId),
				article_id: Number(articleId),
			},
		});

		res.status(200).json(updatedPromo);
	} catch (error) {
		console.error("❌ Erreur updatePromo:", error);
		res
			.status(500)
			.json({ message: "Erreur lors de la modification de la promotion" });
	}
};

// Récupération des promotions d'un article
export const getPromos = async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params;
		const promos = await Promotions.findAll({
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

export const deletePromo = async (req: Request, res: Response) => {
	console.log("deletePromo");

	try {
		const { articleId, promoId } = req.params;

		const deletedCount = await Promotions.destroy({
			where: {
				article_id: Number(articleId),
				promo_id: Number(promoId),
			},
		});

		if (deletedCount === 0) {
			return res.status(404).json({ message: "Promotion non trouvée" });
		}

		res.json({ message: "Promotion supprimée avec succès" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression de la promotion" });
	}
};
