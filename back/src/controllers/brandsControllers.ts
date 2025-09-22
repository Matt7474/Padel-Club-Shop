import type { Request, Response } from "express";
import { Brand } from "../models/Brand";

export async function getAllBrands(_req: Request, res: Response) {
	try {
		const brands = await Brand.findAll();
		res.json(brands);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
