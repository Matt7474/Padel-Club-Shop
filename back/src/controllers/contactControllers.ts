import type { Request, Response } from "express";
import { Contact } from "../models/contact";
import { User } from "../models/user";
import { sendMail } from "../services/mailer";

export const createContact = async (req: Request, res: Response) => {
	try {
		const {
			user_id,
			first_name,
			last_name,
			email,
			phone,
			subject,
			message,
			order_number,
		} = req.body;

		if (!first_name || !last_name || !email || !subject || !message) {
			return res.status(400).json({
				message: "Tous les champs obligatoires doivent être remplis.",
			});
		}

		const safeUserId =
			user_id && !Number.isNaN(Number(user_id)) ? Number(user_id) : null;

		const newContact = await Contact.create({
			user_id: safeUserId,
			first_name,
			last_name,
			email,
			phone,
			subject,
			message,
			order_number,
		});

		await sendMail({
			to: "dimier.matt.dev@gmail.com",
			subject: `📩 Nouveau message de contact : ${subject}`,
			html: `
				<!DOCTYPE html>
				<html lang="fr">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Nouveau message de contact</title>
				</head>
				<body style="font-family: Arial, sans-serif; margin:0; padding:0; background-color:#f5f7fa;">
					<table width="100%" cellpadding="0" cellspacing="0">
						<tr>
							<td align="center">
								<table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; margin:20px 0; border-radius: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
									<tr>
										<td align="center" style="border-bottom: 2px solid #0ea5e9;">
											<h2 style="color:#0ea5e9; margin:0;">📬 Nouveau message de contact</h2>
										</td>
									</tr>
									<tr>
										<td style="font-size:16px; color:#333;">
											<p><strong>Nom :</strong> ${first_name} ${last_name}</p>
											<p><strong>Email :</strong> ${email}</p>
											${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
											<hr style="margin:20px 0; border: none; border-top:1px solid #ddd;" />
											<p><strong>Sujet :</strong> ${subject}</p>
											<p><strong>Message :</strong></p>
											<p style="white-space: pre-line; background:#f9fafb; padding:10px 15px; border-radius:8px; border:1px solid #eee;">
												${message}
											</p>
										</td>
									</tr>
									<tr>
										<td align="center" style="font-size:12px; color:#888; border-top:1px solid #eee;">
											<p>📅 Reçu le ${new Date().toLocaleDateString("fr-FR", {
												day: "2-digit",
												month: "2-digit",
												year: "2-digit",
												hour: "2-digit",
												minute: "2-digit",
											})}</p>
											<p>© ${new Date().getFullYear()} PCS - Tous droits réservés</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>
			`,
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

export const getMessages = async (_req: Request, res: Response) => {
	try {
		const contacts = await Contact.findAll({
			order: [["created_at", "DESC"]],
			include: [
				{
					model: User,
					as: "user",
					attributes: ["user_id", "first_name", "last_name", "email"],
					required: false,
				},
			],
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
export const getMessagesByUserEmail = async (req: Request, res: Response) => {
	try {
		const { email } = req.params;

		if (!email) {
			return res.status(400).json({ message: "Email utilisateur manquant." });
		}

		const contacts = await Contact.findAll({
			where: { email },
			order: [["created_at", "DESC"]],
		});

		if (contacts.length === 0) {
			return res
				.status(404)
				.json({ message: "Aucun message trouvé pour cet utilisateur." });
		}

		return res.status(200).json({ data: contacts });
	} catch (error: unknown) {
		console.error("Erreur dans getMessagesByUserEmail :", error);
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}
		return res.status(500).json({ message: "Erreur inconnue." });
	}
};

export const markMessageAsRead = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ error: "ID du message requis" });

		const [updatedRows, [updatedMessage]] = await Contact.update(
			{ is_read: true },
			{
				where: { id: Number(id) },
				returning: true,
			},
		);

		if (updatedRows === 0) {
			return res.status(404).json({ error: "Message non trouvé" });
		}

		res.json({
			success: true,
			message: "Message marqué comme lu",
			data: updatedMessage,
		});
	} catch (err: unknown) {
		console.error(err);
		if (err instanceof Error) res.status(500).json({ error: err.message });
		else res.status(500).json({ error: "Erreur serveur inconnue" });
	}
};

export const addResponse = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { response } = req.body;

		console.log("id", id);
		console.log("1", response);

		if (!id) {
			return res.status(400).json({ error: "ID du message requis" });
		}

		if (!response || response.trim() === "") {
			return res.status(400).json({ error: "Réponse vide non autorisée" });
		}

		const [updatedRows, [updatedMessage]] = await Contact.update(
			{ response },
			{
				where: { id: Number(id) },
				returning: true,
			},
		);

		if (updatedRows === 0) {
			return res.status(404).json({ error: "Message non trouvé" });
		}

		res.json({
			success: true,
			message: "Réponse ajoutée avec succès",
			data: updatedMessage,
		});
	} catch (err: unknown) {
		console.error("Erreur dans addResponse :", err);
		if (err instanceof Error) {
			res.status(500).json({ error: err.message });
		} else {
			res.status(500).json({ error: "Erreur serveur inconnue" });
		}
	}
};
