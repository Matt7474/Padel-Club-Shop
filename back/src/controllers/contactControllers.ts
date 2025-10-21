import type { Request, Response } from "express";
import { Contact } from "../models/contact";

export const createContact = async (req: Request, res: Response) => {
	try {
		const { first_name, last_name, email, phone, subject, message } = req.body;

		if (!first_name || !last_name || !email || !subject || !message) {
			return res.status(400).json({
				message: "Tous les champs obligatoires doivent être remplis.",
			});
		}

		const newContact = await Contact.create({
			first_name,
			last_name,
			email,
			phone,
			subject,
			message,
		});

		return res
			.status(201)
			.json({ message: "Message envoyé avec succès", data: newContact });
	} catch (error: unknown) {
		console.error(error);
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erreur inconnue" });
	}
};

export const getContacts = async (_req: Request, res: Response) => {
	try {
		const contacts = await Contact.findAll({
			order: [["created_at", "DESC"]],
		});
		return res.status(200).json({ data: contacts });
	} catch (error: unknown) {
		console.error(error);
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erreur inconnue" });
	}
};
