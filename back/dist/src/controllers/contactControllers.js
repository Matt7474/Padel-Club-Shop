"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusContactMessageById = exports.restoreContactMessageById = exports.deleteContactMessageById = exports.responseMessage = exports.markMessageAsRead = exports.getMessages = exports.createContactMessage = void 0;
const contactMessage_1 = require("../models/contactMessage");
const user_1 = require("../models/user");
const contactFormSchema_1 = require("../schemas/contactFormSchema");
const mailer_1 = require("../services/mailer");
const sanitize_1 = require("../utils/sanitize");
const createContactMessage = async (req, res) => {
    try {
        console.log("🧩 Données reçues :", req.body);
        // 1. Validation Joi
        const { error, value } = contactFormSchema_1.contactFormSchema.validate(req.body, {
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
            first_name: (0, sanitize_1.sanitizeInput)(value.first_name),
            last_name: (0, sanitize_1.sanitizeInput)(value.last_name),
            email: (0, sanitize_1.sanitizeInput)(value.email),
            phone: value.phone ? (0, sanitize_1.sanitizeInput)(value.phone) : null,
            subject: (0, sanitize_1.sanitizeInput)(value.subject),
            order_number: value.order_number
                ? (0, sanitize_1.sanitizeInput)(value.order_number)
                : null,
            message: (0, sanitize_1.sanitizeInput)(value.message),
        };
        console.log("✅ Données validées & nettoyées :", sanitizedData);
        // 3. Insertion
        const newMessage = await contactMessage_1.ContactMessage.create({
            ...sanitizedData,
            user_id: req.body.user_id ?? null,
            status: "new",
            is_read: false,
            is_deleted: false,
        });
        // 4. Envoi du mail
        await (0, mailer_1.sendMail)({
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
    }
    catch (err) {
        console.error("💥 Erreur dans createContactMessage :", err);
        return res.status(500).json({
            message: "Erreur lors de la création du message",
        });
    }
};
exports.createContactMessage = createContactMessage;
const getMessages = async (_req, res) => {
    try {
        const contacts = await contactMessage_1.ContactMessage.findAll({
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: user_1.User,
                    as: "user",
                    attributes: ["user_id", "first_name", "last_name", "email"],
                    required: false,
                },
            ],
        });
        return res.status(200).json({ data: contacts });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erreur inconnue" });
    }
};
exports.getMessages = getMessages;
const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: "ID du message requis" });
        const [updatedRows, [updatedMessage]] = await contactMessage_1.ContactMessage.update({ is_read: true }, {
            where: { id: Number(id) },
            returning: true,
        });
        if (updatedRows === 0) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        res.json({
            success: true,
            message: "Message marqué comme lu",
            data: updatedMessage,
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error)
            res.status(500).json({ error: err.message });
        else
            res.status(500).json({ error: "Erreur serveur inconnue" });
    }
};
exports.markMessageAsRead = markMessageAsRead;
const responseMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        if (!response || response.trim() === "") {
            return res
                .status(400)
                .json({ message: "La réponse ne peut pas être vide" });
        }
        // Récupération du message d'origine
        const message = await contactMessage_1.ContactMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ message: "Message non trouvé" });
        }
        // Mise à jour en base
        message.response = response;
        message.status = "resolved"; // tu peux adapter selon ta logique
        await message.save();
        // Envoi du mail de réponse
        await (0, mailer_1.sendMail)({
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
    }
    catch (error) {
        console.error("Erreur lors de l'envoi de la réponse :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.responseMessage = responseMessage;
const deleteContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactMessage_1.ContactMessage.findByPk(id);
        if (!message)
            return res.status(404).json({ message: "Message non trouvé" });
        message.is_deleted = true;
        await message.save();
        return res.status(200).json({ message: "Message archivé avec succès" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Erreur lors de l'archivage du message" });
    }
};
exports.deleteContactMessageById = deleteContactMessageById;
const restoreContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactMessage_1.ContactMessage.findByPk(id);
        if (!message)
            return res.status(404).json({ message: "Message non trouvé" });
        message.is_deleted = false;
        await message.save();
        return res.status(200).json({ message: "Message restauré avec succès" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la restauration du message" });
    }
};
exports.restoreContactMessageById = restoreContactMessageById;
const updateStatusContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["new", "in_progress", "resolved", "closed"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }
        const message = await contactMessage_1.ContactMessage.findByPk(id);
        if (!message)
            return res.status(404).json({ message: "Message non trouvé" });
        message.status = status;
        await message.save();
        return res.status(200).json({
            message: "Statut mis à jour avec succès",
            updatedStatus: status,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la mise à jour du statut" });
    }
};
exports.updateStatusContactMessageById = updateStatusContactMessageById;
