"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTechRatings = exports.createTechRatings = void 0;
exports.getAllArticles = getAllArticles;
exports.getOneArticle = getOneArticle;
exports.getOneArticleByName = getOneArticleByName;
exports.getArticlesByType = getArticlesByType;
exports.createArticle = createArticle;
exports.addImagesArticle = addImagesArticle;
exports.updateArticle = updateArticle;
exports.archiveArticle = archiveArticle;
exports.restoreArticle = restoreArticle;
exports.getAllArticlesDeleted = getAllArticlesDeleted;
const article_1 = require("../models/article");
const articleImage_1 = require("../models/articleImage");
const articleRatings_1 = require("../models/articleRatings");
const brand_1 = require("../models/brand");
const promotions_1 = require("../models/promotions");
async function getAllArticles(_req, res) {
    try {
        const articles = await article_1.Article.findAll({
            where: { is_deleted: false },
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
                { model: promotions_1.Promotions, as: "promotions" },
                { model: articleImage_1.ArticleImage, as: "images" },
                { model: articleRatings_1.ArticleRatings, as: "ratings" },
            ],
        });
        res.json(articles);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getOneArticle(req, res) {
    try {
        const { id } = req.params;
        const article = await article_1.Article.findOne({
            where: { article_id: id },
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
                { model: promotions_1.Promotions, as: "promotions" },
                { model: articleImage_1.ArticleImage, as: "images" },
                { model: articleRatings_1.ArticleRatings, as: "ratings" },
            ],
        });
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        const articleJson = article.toJSON();
        articleJson.images = articleJson.images.map((img) => img.url);
        res.json(articleJson);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getOneArticleByName(req, res) {
    try {
        const { name } = req.params;
        const article = await article_1.Article.findOne({
            where: { name },
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
                { model: promotions_1.Promotions, as: "promotions" },
                { model: articleImage_1.ArticleImage, as: "images" },
                { model: articleRatings_1.ArticleRatings, as: "ratings" },
            ],
        });
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.json(article);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getArticlesByType(req, res) {
    try {
        const { type } = req.params;
        const whereClause = { is_deleted: false };
        if (type)
            whereClause.type = type;
        const articles = await article_1.Article.findAll({
            where: whereClause,
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
                { model: promotions_1.Promotions, as: "promotions" },
                { model: articleImage_1.ArticleImage, as: "images" },
                { model: articleRatings_1.ArticleRatings, as: "ratings" },
            ],
        });
        res.json(articles);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function createArticle(req, res) {
    try {
        const { type, name, description, 
        // reference,
        brand_id, price_ttc, stock_quantity, status, shipping_cost, tech_characteristics, promotions, } = req.body;
        // console.log("🟢 createArticle reçu avec ref:", reference);
        // Vérification des champs obligatoires
        if (!name || !price_ttc || !brand_id) {
            return res.status(400).json({
                error: "Champs obligatoires manquants (name, price_ttc, brand_id)",
            });
        }
        // Vérification de la marque
        const brand = await brand_1.Brand.findByPk(brand_id);
        if (!brand) {
            return res.status(404).json({ error: "Marque introuvable" });
        }
        // Vérification de tech_characteristics
        let parsedCharacteristics = null;
        if (tech_characteristics) {
            if (typeof tech_characteristics !== "object") {
                return res.status(400).json({
                    error: "tech_characteristics doit être un objet JSON",
                });
            }
            parsedCharacteristics = tech_characteristics;
        }
        // Générer une référence unique
        let uniqueReference = `REF-${Math.floor(Math.random() * 1000000)}`;
        while (await article_1.Article.findOne({ where: { reference: uniqueReference } })) {
            uniqueReference = `REF-${Math.floor(Math.random() * 1000000)}`;
        }
        // 1️⃣ Créer l'article
        const article = await article_1.Article.create({
            type,
            name,
            description,
            reference: uniqueReference,
            brand_id,
            price_ttc,
            stock_quantity,
            status,
            shipping_cost,
            tech_characteristics: parsedCharacteristics, // ✅ JSON direct
            is_deleted: false,
        });
        // 2️⃣ Créer les promotions si elles existent
        if (promotions && promotions.length > 0) {
            for (const promo of promotions) {
                const existingPromo = await promotions_1.Promotions.findOne({
                    where: { article_id: article.article_id },
                });
                if (existingPromo) {
                    await existingPromo.update({
                        name: promo.name ?? existingPromo.name,
                        description: promo.description ?? existingPromo.description,
                        discount_type: promo.discount_type ?? existingPromo.discount_type,
                        discount_value: promo.discount_value,
                        start_date: promo.start_date,
                        end_date: promo.end_date,
                        status: promo.status,
                    });
                }
                else {
                    await promotions_1.Promotions.create({
                        article_id: article.article_id,
                        name: promo.name ?? null,
                        description: promo.description ?? null,
                        discount_type: promo.discount_type ?? "%",
                        discount_value: promo.discount_value,
                        start_date: promo.start_date,
                        end_date: promo.end_date,
                        status: promo.status,
                    });
                }
            }
        }
        // Récupérer l'article avec sa marque et promotions
        const articleWithRelations = await article_1.Article.findByPk(article.article_id, {
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name"] },
                { model: promotions_1.Promotions, as: "promotions" },
            ],
        });
        res.status(201).json(articleWithRelations);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne lors de la création" });
    }
}
async function addImagesArticle(req, res) {
    const { id } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "Aucune image reçue" });
    }
    try {
        const images = await Promise.all(files.map((file) => articleImage_1.ArticleImage.create({
            article_id: parseInt(id, 10),
            url: `/uploads/${file.filename}`,
        })));
        res.json({
            message: "✅ Images ajoutées avec succès",
            images,
        });
    }
    catch (err) {
        console.error("❌ Erreur ajout images :", err);
        res.status(500).json({
            message: "Erreur serveur lors de l'ajout des images",
        });
    }
}
const createTechRatings = async (req, res) => {
    try {
        const articleId = Number(req.params.id);
        const ratings = req.body;
        const result = await articleRatings_1.ArticleRatings.create({
            article_id: articleId,
            ...ratings,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ error: "Erreur lors de la création des TechRatings" });
    }
};
exports.createTechRatings = createTechRatings;
const updateTechRatings = async (req, res) => {
    try {
        const articleId = Number(req.params.id);
        const ratings = req.body;
        const result = await articleRatings_1.ArticleRatings.update({ ...ratings }, { where: { article_id: articleId } });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ error: "Erreur lors de la création des TechRatings" });
    }
};
exports.updateTechRatings = updateTechRatings;
async function updateArticle(req, res) {
    try {
        const { id } = req.params;
        const article = await article_1.Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        await article.update(req.body);
        return res.json({ message: "Article updated successfully", article });
    }
    catch (err) {
        console.error("❌ Error updating article:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
async function archiveArticle(req, res) {
    try {
        const { id } = req.params;
        const article = await article_1.Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        article.is_deleted = true;
        await article.save();
        return res.json({ message: "Article archivé avec success" });
    }
    catch (err) {
        console.error("❌ Error archiving article:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
async function restoreArticle(req, res) {
    try {
        const { id } = req.params;
        const article = await article_1.Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        article.is_deleted = false;
        await article.save();
        return res.json({ message: "Article restauré avec succès" });
    }
    catch (err) {
        console.error("❌ Error restoring article:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getAllArticlesDeleted(_req, res) {
    try {
        const articles = await article_1.Article.findAll({
            where: { is_deleted: true },
            include: [
                { model: brand_1.Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
                { model: promotions_1.Promotions, as: "promotions" },
                { model: articleImage_1.ArticleImage, as: "images" },
                { model: articleRatings_1.ArticleRatings, as: "ratings" },
            ],
        });
        res.json(articles);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
