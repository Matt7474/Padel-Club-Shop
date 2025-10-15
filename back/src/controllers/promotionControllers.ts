import type { Request, Response } from "express";
import { Promotion } from "../models/promotion";

///////////////////////////////////////////////
// Promotions de   *** pré-remplissage ***   //
///////////////////////////////////////////////

export const getPromo = async (_req: Request, res: Response) => {
	try {
		const promos = await Promotion.findAll({});
		res.json(promos);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des promotions" });
	}
};

export const createPromo = async (req: Request, res: Response) => {
	console.log("dans createPromo");

	try {
		const { name, description, start_date, end_date } = req.body;

		const now = new Date();
		let status: "active" | "upcoming" | "expired" = "upcoming";
		const startDate = new Date(start_date);
		const endDate = new Date(end_date);

		if (startDate <= now && endDate >= now) status = "active";
		else if (endDate < now) status = "expired";

		// Création de la promotion
		const promo = await Promotion.create({
			name: name ?? null,
			description: description ?? null,
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

export const updatePromo = async (req: Request, res: Response) => {
	console.log("dans updatePromo");

	try {
		const { name, description, start_date, end_date } = req.body;
		const { promoId } = req.params;
		console.log(name, description, start_date, end_date);
		console.log(promoId);

		// Chercher la promo existante
		const promo = await Promotion.findByPk(promoId);
		if (!promo) {
			return res.status(404).json({ message: "Promotion introuvable" });
		}

		// Calculer le nouveau status selon les dates
		const now = new Date();
		const startDate = start_date ? new Date(start_date) : promo.start_date;
		const endDate = end_date ? new Date(end_date) : promo.end_date;

		let status: "active" | "upcoming" | "expired" = "upcoming";
		if (startDate <= now && endDate >= now) status = "active";
		else if (endDate < now) status = "expired";

		// Mettre à jour les champs
		await promo.update({
			name: name ?? promo.name,
			description: description ?? promo.description,
			start_date: startDate,
			end_date: endDate,
			status,
		});

		res.status(200).json(promo);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la mise à jour de la promotion" });
	}
};

export const deletePromo = async (req: Request, res: Response) => {
	console.log("🗑️ Dans deletePromo");

	try {
		const { promoId } = req.params;
		console.log("promoId :", promoId);

		// Suppression de la promo
		const deletedCount = await Promotion.destroy({
			where: { promo_id: promoId },
		});

		if (deletedCount === 0) {
			return res.status(404).json({ message: "Promotion introuvable" });
		}

		res.status(200).json({ message: "✅ Promotion supprimée avec succès" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "❌ Erreur lors de la suppression de la promotion" });
	}
};
