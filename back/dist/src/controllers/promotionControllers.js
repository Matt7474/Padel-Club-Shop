"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromo = exports.updatePromo = exports.createPromo = exports.getPromo = void 0;
const promotion_1 = require("../models/promotion");
const promoFormSchema_1 = require("../schemas/promoFormSchema");
const sanitize_1 = require("../utils/sanitize");
///////////////////////////////////////////////
// Promotions de   *** pré-remplissage ***   //
///////////////////////////////////////////////
const getPromo = async (_req, res) => {
    try {
        const promos = await promotion_1.Promotion.findAll({});
        res.json(promos);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erreur lors de la récupération des promotions" });
    }
};
exports.getPromo = getPromo;
const createPromo = async (req, res) => {
    console.log("dans createPromo");
    try {
        // 1️⃣ Valider les inputs avec Joi
        const { error, value } = promoFormSchema_1.promoFormSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const messages = error.details.map((d) => d.message);
            return res.status(400).json({ errors: messages });
        }
        // 2️⃣ Récupérer et sanitize les valeurs
        const name = (0, sanitize_1.sanitizeInput)(value.name);
        const description = value.description
            ? (0, sanitize_1.sanitizeInput)(value.description)
            : null;
        const startDate = new Date(value.start_date);
        const endDate = new Date(value.end_date);
        // 3️⃣ Déterminer le status
        const now = new Date();
        let status = "upcoming";
        if (startDate <= now && endDate >= now)
            status = "active";
        else if (endDate < now)
            status = "expired";
        // 4️⃣ Création de la promotion
        const promo = await promotion_1.Promotion.create({
            name,
            description,
            start_date: startDate,
            end_date: endDate,
            status,
        });
        res.status(201).json(promo);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Erreur lors de la création de la promotion" });
    }
};
exports.createPromo = createPromo;
// export const createPromo = async (req: Request, res: Response) => {
// 	console.log("dans createPromo");
// 	try {
// 		const { name, description, start_date, end_date } = req.body;
// 		const now = new Date();
// 		let status: "active" | "upcoming" | "expired" = "upcoming";
// 		const startDate = new Date(start_date);
// 		const endDate = new Date(end_date);
// 		if (startDate <= now && endDate >= now) status = "active";
// 		else if (endDate < now) status = "expired";
// 		// Création de la promotion
// 		const promo = await Promotion.create({
// 			name: name ?? null,
// 			description: description ?? null,
// 			start_date: startDate,
// 			end_date: endDate,
// 			status,
// 		});
// 		res.status(201).json(promo);
// 	} catch (error) {
// 		console.error(error);
// 		res
// 			.status(500)
// 			.json({ message: "Erreur lors de la création de la promotion" });
// 	}
// };
const updatePromo = async (req, res) => {
    console.log("dans updatePromo");
    try {
        const { name, description, start_date, end_date } = req.body;
        const { promoId } = req.params;
        console.log(name, description, start_date, end_date);
        console.log(promoId);
        // Chercher la promo existante
        const promo = await promotion_1.Promotion.findByPk(promoId);
        if (!promo) {
            return res.status(404).json({ message: "Promotion introuvable" });
        }
        // Calculer le nouveau status selon les dates
        const now = new Date();
        const startDate = start_date ? new Date(start_date) : promo.start_date;
        const endDate = end_date ? new Date(end_date) : promo.end_date;
        let status = "upcoming";
        if (startDate <= now && endDate >= now)
            status = "active";
        else if (endDate < now)
            status = "expired";
        // Mettre à jour les champs
        await promo.update({
            name: name ?? promo.name,
            description: description ?? promo.description,
            start_date: startDate,
            end_date: endDate,
            status,
        });
        res.status(200).json(promo);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erreur lors de la mise à jour de la promotion" });
    }
};
exports.updatePromo = updatePromo;
const deletePromo = async (req, res) => {
    console.log("🗑️ Dans deletePromo");
    try {
        const { promoId } = req.params;
        console.log("promoId :", promoId);
        // Suppression de la promo
        const deletedCount = await promotion_1.Promotion.destroy({
            where: { promo_id: promoId },
        });
        if (deletedCount === 0) {
            return res.status(404).json({ message: "Promotion introuvable" });
        }
        res.status(200).json({ message: "✅ Promotion supprimée avec succès" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "❌ Erreur lors de la suppression de la promotion" });
    }
};
exports.deletePromo = deletePromo;
