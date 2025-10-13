import type { Request, Response } from "express";
import { Brand } from "../models/brand";

export async function createBrand(req: Request, res: Response) {
	try {
		let brandName: string | undefined;
		let imagePath: string | undefined;

		if (req.file) {
			brandName = req.body.brandName;
			imagePath = `/uploads/${req.file.filename}`;
		} else if (req.body.image_url) {
			brandName = req.body.brandName;
			imagePath = req.body.image_url;
		} else {
			return res.status(400).json({ error: "Aucune image fournie" });
		}

		if (!brandName) {
			return res.status(400).json({ error: "Nom de marque obligatoire" });
		}

		const brand = await Brand.create({
			name: brandName,
			logo: imagePath,
		});

		res.status(201).json(brand);
	} catch (err) {
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
