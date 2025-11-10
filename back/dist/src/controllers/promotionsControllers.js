"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromo = exports.getPromos = exports.updatePromo = exports.createPromos = void 0;
const promotions_1 = require("../models/promotions");
// Création d'une promotion pour un article
const createPromos = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { name, description, discount_type, discount_value, start_date, end_date, } = req.body;
        // Validation minimale
        if (!discount_value || !start_date || !end_date) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }
        const now = new Date();
        let status = "upcoming";
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (startDate <= now && endDate >= now)
            status = "active";
        else if (endDate < now)
            status = "expired";
        // Création de la promotion
        const promo = await promotions_1.Promotions.create({
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erreur lors de la création de la promotion" });
    }
};
exports.createPromos = createPromos;
// Modification d'une promotion existante pour un article
const updatePromo = async (req, res) => {
    console.log("✅ updatePromo - Params:", req.params, "Body:", req.body);
    try {
        const { articleId, promoId } = req.params;
        const { name, description, discount_type, discount_value, start_date, end_date, } = req.body;
        if (!discount_value || !start_date || !end_date) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }
        const now = new Date();
        let status = "upcoming";
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (startDate <= now && endDate >= now)
            status = "active";
        else if (endDate < now)
            status = "expired";
        const [updatedCount] = await promotions_1.Promotions.update({
            name: name ?? null,
            description: description ?? null,
            discount_type: discount_type ?? "%",
            discount_value,
            start_date: startDate,
            end_date: endDate,
            status,
        }, {
            where: {
                promo_id: Number(promoId),
                article_id: Number(articleId),
            },
        });
        if (updatedCount === 0) {
            return res.status(404).json({ message: "Promotion non trouvée" });
        }
        const updatedPromo = await promotions_1.Promotions.findOne({
            where: {
                promo_id: Number(promoId),
                article_id: Number(articleId),
            },
        });
        res.status(200).json(updatedPromo);
    }
    catch (error) {
        console.error("❌ Erreur updatePromo:", error);
        res
            .status(500)
            .json({ message: "Erreur lors de la modification de la promotion" });
    }
};
exports.updatePromo = updatePromo;
// Récupération des promotions d'un article
const getPromos = async (req, res) => {
    try {
        const { articleId } = req.params;
        const promos = await promotions_1.Promotions.findAll({
            where: { article_id: Number(articleId) },
        });
        res.json(promos);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erreur lors de la récupération des promotions" });
    }
};
exports.getPromos = getPromos;
const deletePromo = async (req, res) => {
    console.log("deletePromo");
    try {
        const { articleId, promoId } = req.params;
        const deletedCount = await promotions_1.Promotions.destroy({
            where: {
                article_id: Number(articleId),
                promo_id: Number(promoId),
            },
        });
        if (deletedCount === 0) {
            return res.status(404).json({ message: "Promotion non trouvée" });
        }
        res.json({ message: "Promotion supprimée avec succès" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erreur lors de la suppression de la promotion" });
    }
};
exports.deletePromo = deletePromo;
