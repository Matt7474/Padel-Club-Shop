import type { Request, Response } from "express";
import { ContactMessage } from "../models/contactMessage";
import { User } from "../models/user";
import { contactFormSchema } from "../schemas/contactFormSchema";
import { sendMail } from "../services/mailer";
import { sanitizeInput } from "../utils/sanitize";

export const createContactMessage = async (req: Request, res: Response) => {
	try {
		console.log("🧩 Données reçues :", req.body);

		// 1. Validation Joi
		const { error, value } = contactFormSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			console.log("❌ Erreurs Joi :", error.details);
			return res.status(400).json({
				message: "Données invalides",
				details: error.details.map((d) => d.message),
			});
		}

		// 2. Nettoyage
		const sanitizedData = {
			...value,
			first_name: sanitizeInput(value.first_name),
			last_name: sanitizeInput(value.last_name),
			email: sanitizeInput(value.email),
			phone: value.phone ? sanitizeInput(value.phone) : null,
			subject: sanitizeInput(value.subject),
			order_number: value.order_number
				? sanitizeInput(value.order_number)
				: null,
			message: sanitizeInput(value.message),
		};

		console.log("✅ Données validées & nettoyées :", sanitizedData);

		// 3. Insertion
		const newMessage = await ContactMessage.create({
			...sanitizedData,
			user_id: req.body.user_id ?? null,
			status: "new",
			is_read: false,
			is_deleted: false,
		});

		// 4. Envoi du mail
		await sendMail({
			to: "dimier.matt.dev@gmail.com",
			subject: `📩 Nouveau message : ${sanitizedData.subject}`,
			html: `
				<p><strong>Nom :</strong> ${sanitizedData.first_name} ${sanitizedData.last_name}</p>
				<p><strong>Email :</strong> ${sanitizedData.email}</p>
				${sanitizedData.phone ? `<p><strong>Téléphone :</strong> ${sanitizedData.phone}</p>` : ""}
				<p><strong>Sujet :</strong> ${sanitizedData.subject}</p>
				<p><strong>Message :</strong></p>
				<p>${sanitizedData.message}</p>
			`,
		});

		return res.status(201).json(newMessage);
	} catch (err) {
		console.error("💥 Erreur dans createContactMessage :", err);
		return res.status(500).json({
			message: "Erreur lors de la création du message",
		});
	}
};

export const getMessages = async (_req: Request, res: Response) => {
	try {
		const contacts = await ContactMessage.findAll({
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

export const markMessageAsRead = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ error: "ID du message requis" });

		const [updatedRows, [updatedMessage]] = await ContactMessage.update(
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

export const responseMessage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { response } = req.body;

		if (!response || response.trim() === "") {
			return res
				.status(400)
				.json({ message: "La réponse ne peut pas être vide" });
		}

		// Récupération du message d'origine
		const message = await ContactMessage.findByPk(id);
		if (!message) {
			return res.status(404).json({ message: "Message non trouvé" });
		}

		// Mise à jour en base
		message.response = response;
		message.status = "resolved"; // tu peux adapter selon ta logique
		await message.save();

		// Envoi du mail de réponse
		await sendMail({
			to: message.email,
			subject: `💬 Réponse à votre message "${message.subject}"`,
			html: `
				<!DOCTYPE html>
				<html lang="fr">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Réponse à votre message</title>
				</head>
				<body style="font-family: Arial, sans-serif; margin:0; padding:0; background-color:#f5f7fa;">
					<table width="100%" cellpadding="0" cellspacing="0">
						<tr>
							<td align="center">
								<table width="600" cellpadding="20" cellspacing="0" style="background-color:#ffffff; margin:20px 0; border-radius:10px; box-shadow:0 3px 8px rgba(0,0,0,0.1);">
									<tr>
										<td align="center" style="border-bottom:2px solid #0ea5e9;">
											<h2 style="color:#0ea5e9; margin:0;">💬 Réponse à votre message</h2>
										</td>
									</tr>
									<tr>
										<td style="font-size:16px; color:#333;">
											<p>Bonjour ${message.first_name},</p>
											<p>Vous avez récemment contacté notre équipe au sujet de :</p>
											<p style="background:#f9fafb; padding:10px 15px; border-radius:8px; border:1px solid #eee;">
												${message.message}
											</p>
											<hr style="margin:20px 0; border:none; border-top:1px solid #ddd;" />
											<p><strong>Notre réponse :</strong></p>
											<p style="white-space: pre-line; background:#f0fdfa; padding:10px 15px; border-radius:8px; border:1px solid #bee3f8;">
												${response}
											</p>
										</td>
									</tr>
									<p>Merci de ne pas répondre a ce mail, pour continuer la discussion veuillez passer par le formulaire de contact ou inscivez vous pour acceder au systeme de messagerie.</p>
									<tr>
										<td align="center" style="font-size:12px; color:#888; border-top:1px solid #eee;">
											<p>📅 Envoyé le ${new Date().toLocaleDateString("fr-FR", {
												day: "2-digit",
												month: "2-digit",
												year: "2-digit",
												hour: "2-digit",
												minute: "2-digit",
											})}</p>
											<p>© ${new Date().getFullYear()} PCS - Support client</p>
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
			.status(200)
			.json({ message: "Réponse enregistrée et envoyée avec succès" });
	} catch (error: unknown) {
		console.error("Erreur lors de l'envoi de la réponse :", error);
		return res.status(500).json({ message: "Erreur interne du serveur" });
	}
};

export const deleteContactMessageById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const message = await ContactMessage.findByPk(id);
		if (!message)
			return res.status(404).json({ message: "Message non trouvé" });

		message.is_deleted = true;
		await message.save();

		return res.status(200).json({ message: "Message archivé avec succès" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Erreur lors de l'archivage du message" });
	}
};

export const restoreContactMessageById = async (
	req: Request,
	res: Response,
) => {
	try {
		const { id } = req.params;

		const message = await ContactMessage.findByPk(id);
		if (!message)
			return res.status(404).json({ message: "Message non trouvé" });

		message.is_deleted = false;
		await message.save();

		return res.status(200).json({ message: "Message restauré avec succès" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Erreur lors de la restauration du message" });
	}
};

export const updateStatusContactMessageById = async (
	req: Request,
	res: Response,
) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!["new", "in_progress", "resolved", "closed"].includes(status)) {
			return res.status(400).json({ message: "Statut invalide" });
		}

		const message = await ContactMessage.findByPk(id);
		if (!message)
			return res.status(404).json({ message: "Message non trouvé" });

		message.status = status;
		await message.save();

		return res.status(200).json({
			message: "Statut mis à jour avec succès",
			updatedStatus: status,
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Erreur lors de la mise à jour du statut" });
	}
};
