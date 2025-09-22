import type { Request, Response } from "express";
import type { Includeable, WhereOptions } from "sequelize";
import { Article } from "../models/Article";
import { Brand } from "../models/Brand";
import Promotion from "../models/Promotion";

export async function getAllArticles(_req: Request, res: Response) {
	try {
		const articles = await Article.findAll({
			where: { is_deleted: false },
		});
		res.json(articles);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function getOneArticle(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const article = await Article.findOne({
			where: { article_id: id },
		});

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		res.json(article);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function getArticlesByType(req: Request, res: Response) {
	try {
		const { type } = req.params;

		const whereClause: WhereOptions<Article> = { is_deleted: false };
		if (type) whereClause.type = type;

		const articles = await Article.findAll({
			where: whereClause,
			include: [
				{
					model: Brand,
					as: "brand",
					attributes: ["brand_id", "name"],
				} as Includeable,
			],
		});

		res.json(articles);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function createArticle(req: Request, res: Response) {
	try {
		const {
			type,
			name,
			description,
			reference,
			brand_id,
			price_ttc,
			stock_quantity,
			status,
			shipping_cost,
			tech_characteristics,
			promotions,
		} = req.body;

		console.log(req.body);

		if (!name || !price_ttc || !brand_id) {
			return res.status(400).json({
				error: "Champs obligatoires manquants (name, price_ttc, brand_id)",
			});
		}

		if (promotions && promotions.length > 0) {
			await Promotion.bulkCreate(
				promotions.map((promo: Promotion) => ({
					...promo,
					article_id: article.article_id,
				})),
			);
		}

		const brand = await Brand.findByPk(brand_id);
		if (!brand) {
			return res.status(404).json({ error: "Marque introuvable" });
		}

		const article = await Article.create({
			type,
			name,
			description,
			reference,
			brand_id,
			price_ttc,
			stock_quantity,
			status,
			shipping_cost,
			tech_characteristics,
			is_deleted: false,
		});

		const articleWithBrand = await Article.findByPk(article.article_id, {
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name"] },
			],
		});

		res.status(201).json(articleWithBrand);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Erreur interne lors de la création" });
	}
}

export async function updateArticle(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const article = await Article.findByPk(id);
		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		await article.update(req.body);

		return res.json({ message: "Article updated successfully", article });
	} catch (err) {
		console.error("❌ Error updating article:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function archiveArticle(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const article = await Article.findByPk(id);
		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		article.is_deleted = true;
		await article.save();

		return res.json({ message: "Article archivé avec success" });
	} catch (err) {
		console.error("❌ Error archiving article:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function restoreArticle(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const article = await Article.findByPk(id);

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		article.is_deleted = false;
		await article.save();

		return res.json({ message: "Article restauré avec succès" });
	} catch (err) {
		console.error("❌ Error restoring article:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
