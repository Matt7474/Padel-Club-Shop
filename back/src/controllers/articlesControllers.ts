import type { Request, Response } from "express";
import type { WhereOptions } from "sequelize";
import { Article } from "../models/article";
import { ArticleImage } from "../models/articleImage";
import { ArticleRatings } from "../models/articleRatings";
import { Brand } from "../models/brand";
import { Promotions } from "../models/promotions";
import type { PromotionsCreationAttributes } from "../types/PromotionType";

export async function getAllArticles(_req: Request, res: Response) {
	try {
		const articles = await Article.findAll({
			where: { is_deleted: false },
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
				{ model: Promotions, as: "promotions" },
				{ model: ArticleImage, as: "images" },
				{ model: ArticleRatings, as: "ratings" },
			],
		});
		res.json(articles);
		console.log(articles);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function getOneArticle(req: Request, res: Response) {
	try {
		const { id } = req.params;
		console.log("hello");

		const article = await Article.findOne({
			where: { article_id: id },
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
				{ model: Promotions, as: "promotions" },
				{ model: ArticleImage, as: "images" },
				{ model: ArticleRatings, as: "ratings" },
			],
		});

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		const articleJson = article.toJSON();
		articleJson.images = (articleJson.images as ArticleImage[]).map(
			(img) => img.url,
		);

		res.json(articleJson);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function getOneArticleByName(req: Request, res: Response) {
	try {
		const { name } = req.params;

		const article = await Article.findOne({
			where: { name },
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
				{ model: Promotions, as: "promotions" },
				{ model: ArticleImage, as: "images" },
				{ model: ArticleRatings, as: "ratings" },
			],
		});

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		console.log(article);

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
				{ model: Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
				{ model: Promotions, as: "promotions" },
				{ model: ArticleImage, as: "images" },
				{ model: ArticleRatings, as: "ratings" },
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
			// reference,
			brand_id,
			price_ttc,
			stock_quantity,
			status,
			shipping_cost,
			tech_characteristics,
			promotions,
		} = req.body;

		// console.log("🟢 createArticle reçu avec ref:", reference);

		// Vérification des champs obligatoires
		if (!name || !price_ttc || !brand_id) {
			return res.status(400).json({
				error: "Champs obligatoires manquants (name, price_ttc, brand_id)",
			});
		}

		// Vérification de la marque
		const brand = await Brand.findByPk(brand_id);
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
		while (await Article.findOne({ where: { reference: uniqueReference } })) {
			uniqueReference = `REF-${Math.floor(Math.random() * 1000000)}`;
		}

		// 1️⃣ Créer l'article
		const article = await Article.create({
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
				const existingPromo = await Promotions.findOne({
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
				} else {
					await Promotions.create({
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
		const articleWithRelations = await Article.findByPk(article.article_id, {
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name"] },
				{ model: Promotions, as: "promotions" },
			],
		});

		res.status(201).json(articleWithRelations);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Erreur interne lors de la création" });
	}
}

export async function addImagesArticle(req: Request, res: Response) {
	const { id } = req.params;
	const files = req.files as Express.Multer.File[];

	if (!files || files.length === 0) {
		return res.status(400).json({ message: "Aucune image reçue" });
	}

	try {
		const images = await Promise.all(
			files.map((file) =>
				ArticleImage.create({
					article_id: parseInt(id, 10),
					url: `/uploads/${file.filename}`,
				}),
			),
		);

		res.json({
			message: "✅ Images ajoutées avec succès",
			images,
		});
	} catch (err) {
		console.error("❌ Erreur ajout images :", err);
		res.status(500).json({
			message: "Erreur serveur lors de l'ajout des images",
		});
	}
}

export const createTechRatings = async (req: Request, res: Response) => {
	try {
		const articleId = Number(req.params.id);
		const ratings = req.body;

		const result = await ArticleRatings.create({
			article_id: articleId,
			...ratings,
		});
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ error: "Erreur lors de la création des TechRatings" });
	}
};

export const updateTechRatings = async (req: Request, res: Response) => {
	try {
		const articleId = Number(req.params.id);
		const ratings = req.body;

		const result = await ArticleRatings.update(
			{ ...ratings },
			{ where: { article_id: articleId } },
		);
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ error: "Erreur lors de la création des TechRatings" });
	}
};

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
		console.log("controller archive", id);
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
		console.log("controller restore", id);
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

export async function getAllArticlesDeleted(_req: Request, res: Response) {
	try {
		const articles = await Article.findAll({
			where: { is_deleted: true },
			include: [
				{ model: Brand, as: "brand", attributes: ["brand_id", "name", "logo"] },
				{ model: Promotions, as: "promotions" },
				{ model: ArticleImage, as: "images" },
				{ model: ArticleRatings, as: "ratings" },
			],
		});
		res.json(articles);
		console.log(articles);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
