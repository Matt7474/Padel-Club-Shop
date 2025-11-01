import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Message } from "../models/message";
import { User } from "../models/user";

// ---------------- Messages d'un utilisateur ----------------
export const getAllUserMessages = async (_req: Request, res: Response) => {
	try {
		const messages = await Message.findAll({
			order: [["created_at", "ASC"]],
			include: [
				{
					model: User,
					as: "sender",
					attributes: [
						["user_id", "id"],
						"first_name",
						"last_name",
						"email",
						"role_id",
					],
				},
				{
					model: User,
					as: "receiver",
					attributes: [
						["user_id", "id"],
						"first_name",
						"last_name",
						"email",
						"role_id",
					],
					required: false,
				},
			],
		});

		await Message.update(
			{ is_read: false },
			{
				where: {
					is_read: false,
				},
			},
		);

		return res.status(200).json(messages);
	} catch (err: unknown) {
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};

// ---------------- Messages d'un utilisateur ----------------
export const getUserMessages = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		if (!userId)
			return res.status(400).json({ message: "Utilisateur manquant" });

		const messages = await Message.findAll({
			where: {
				[Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
			},
			order: [["created_at", "ASC"]],
			include: [
				{
					model: User,
					as: "sender",
					attributes: [
						["user_id", "id"],
						"first_name",
						"last_name",
						"email",
						"role_id",
					],
				},
				{
					model: User,
					as: "receiver",
					attributes: [
						["user_id", "id"],
						"first_name",
						"last_name",
						"email",
						"role_id",
					],
					required: false,
				},
			],
		});

		await Message.update(
			{ is_read: true },
			{
				where: {
					receiver_id: userId,
					is_read: false,
				},
			},
		);

		return res.status(200).json(messages);
	} catch (err: unknown) {
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};

// ---------------- Marquer les messages comme lus ----------------
export const markMessagesAsRead = async (req: Request, res: Response) => {
	console.log("in");

	try {
		const { id } = req.params;
		const senderId = Number(id); // ← Renommé pour clarté

		console.log("senderId reçu:", senderId);

		if (Number.isNaN(senderId)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		const messagesToUpdate = await Message.findAll({
			where: { sender_id: senderId, is_read: false }, // ← Changé
		});

		console.log("Messages à mettre à jour :", messagesToUpdate.length);
		console.log(
			"Messages details:",
			messagesToUpdate.map((m) => ({
				id: m.id,
				sender_id: m.sender_id,
				is_read: m.is_read,
			})),
		);

		const [updatedCount] = await Message.update(
			{ is_read: true },
			{
				where: {
					sender_id: senderId, // ← Changé
					is_read: false,
				},
			},
		);

		console.log("updatedCount:", updatedCount);
		console.log("out");

		return res.status(200).json({
			message: `${updatedCount} message(s) marqué(s) comme lu(s)`,
			count: updatedCount,
		});
	} catch (err: unknown) {
		console.error("Erreur:", err);
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};

export const markMessagesReceiverAsRead = async (
	req: Request,
	res: Response,
) => {
	console.log("in");

	try {
		const { id } = req.params;
		const receiverId = Number(id); // ← Renommé pour clarté

		console.log("receiverId reçu:", receiverId);

		if (Number.isNaN(receiverId)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		const messagesToUpdate = await Message.findAll({
			where: { receiver_id: receiverId, is_read: false }, // ← Changé
		});

		console.log("Messages à mettre à jour :", messagesToUpdate.length);
		console.log(
			"Messages details:",
			messagesToUpdate.map((m) => ({
				id: m.id,
				receiver_id: m.receiver_id,
				is_read: m.is_read,
			})),
		);

		const [updatedCount] = await Message.update(
			{ is_read: true },
			{
				where: {
					receiver_id: receiverId, // ← Changé
					is_read: false,
				},
			},
		);

		console.log("updatedCount:", updatedCount);
		console.log("out");

		return res.status(200).json({
			message: `${updatedCount} message(s) marqué(s) comme lu(s)`,
			count: updatedCount,
		});
	} catch (err: unknown) {
		console.error("Erreur:", err);
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};

// ---------------- Envoyer un message utilisateur → admin ----------------
export const sendUserMessage = async (req: Request, res: Response) => {
	try {
		const { sender_id, content } = req.body;

		if (!sender_id || !content?.trim())
			return res
				.status(400)
				.json({ message: "Champs manquants ou message vide" });

		// Récupérer tous les admins
		const ADMIN_ROLE_IDS = [1, 2];
		const admins = await User.findAll({
			where: { role_id: ADMIN_ROLE_IDS },
		});

		// Créer un message pour chaque admin
		const messages = await Promise.all(
			admins.map((admin) =>
				Message.create({
					sender_id,
					receiver_id: admin.id,
					content,
					is_read: false,
				}),
			),
		);

		return res.status(201).json(messages); // renvoie un tableau de messages
	} catch (err: unknown) {
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};

// ---------------- Envoyer un message adminS → utilisateur ----------------
export const sendAdminMessage = async (req: Request, res: Response) => {
	try {
		const { admin_id, user_id, content } = req.body;

		if (!admin_id || !user_id || !content?.trim())
			return res
				.status(400)
				.json({ message: "Champs manquants ou message vide" });

		const message = await Message.create({
			sender_id: admin_id,
			receiver_id: user_id,
			content,
			is_read: false,
		});

		return res.status(201).json(message);
	} catch (err: unknown) {
		return res.status(500).json({
			message: err instanceof Error ? err.message : "Erreur inconnue",
		});
	}
};
