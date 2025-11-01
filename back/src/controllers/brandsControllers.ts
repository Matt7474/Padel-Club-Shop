import type { Request, Response } from "express";
import { Brand } from "../models/brand";
import { brandsFormSchema } from "../schemas/brandsFormSchema";
import { sanitizeInput } from "../utils/sanitize";

export async function createBrand(req: Request, res: Response) {
	try {
		const { error, value } = brandsFormSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			const messages = error.details.map((d) => d.message);
			return res.status(400).json({ errors: messages });
		}

		let brandName = value.brandName;
		let imagePath: string | undefined;

		if (req.file) {
			imagePath = `/uploads/${req.file.filename}`;
		} else if (value.image_url) {
			imagePath = value.image_url;
		} else {
			return res.status(400).json({ error: "Aucune image fournie" });
		}

		brandName = sanitizeInput(brandName);

		const brand = await Brand.create({
			name: brandName,
			logo: imagePath,
		});

		res.status(201).json(brand);
	} catch (err: unknown) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function getAllBrands(_req: Request, res: Response) {
	try {
		const brands = await Brand.findAll();
		res.json(brands);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function updateBrand(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { name, logo } = req.body;
		if (!id) {
			return res.status(400).json({ error: "ID manquant" });
		}

		const [updated] = await Brand.update(
			{ name, logo },
			{ where: { brand_id: id } },
		);

		if (updated === 0) {
			return res.status(404).json({ error: "Marque non trouvée" });
		}

		res.json({ message: "✅ Marque modifiée avec succès" });
	} catch (err) {
		console.error("❌ Erreur updateBrand :", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function deleteBrand(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ error: "ID manquant" });
		}

		const deleted = await Brand.destroy({
			where: { brand_id: id },
		});

		if (deleted === 0) {
			return res.status(404).json({ error: "Marque non trouvée" });
		}

		res.json({ message: "✅ Marque supprimée avec succès" });
	} catch (err) {
		console.error("❌ Erreur deleteBrand :", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
