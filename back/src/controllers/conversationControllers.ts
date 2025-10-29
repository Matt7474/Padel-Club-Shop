// import type { Request, Response } from "express";
// import { Conversation } from "../models/conversation";
// import { ConversationUser } from "../models/conversationUser";
// import { Message } from "../models/message";
// import { User } from "../models/user";

// export const getAllConversations = async (req: Request, res: Response) => {
// 	try {
// 		const userId = req.user?.id;
// 		if (!userId)
// 			return res.status(401).json({ message: "Utilisateur non identifié" });

// 		const conversations = await Conversation.findAll({
// 			include: [
// 				{
// 					model: User,
// 					as: "users",
// 					attributes: ["user_id", "first_name", "last_name", "email"],
// 					through: { attributes: [] },
// 					where: { user_id: userId }, // correctement sur user_id
// 					required: true,
// 				},
// 				{
// 					model: Message,
// 					as: "messages",
// 					order: [["created_at", "ASC"]],
// 				},
// 			],
// 		});
// 		res.json(conversations);
// 	} catch (error) {
// 		console.error(error);
// 		res
// 			.status(500)
// 			.json({ message: "Erreur lors de la récupération des conversations" });
// 	}
// };

// // Récupérer une conversation par ID (détails + messages)
// export const getConversationById = async (req: Request, res: Response) => {
// 	try {
// 		const conversationId = Number(req.params.id);
// 		const conversation = await Conversation.findByPk(conversationId, {
// 			include: [
// 				{
// 					model: User,
// 					as: "users",
// 					through: { attributes: [] },
// 					attributes: ["id", "first_name", "last_name", "email"],
// 				},
// 				{
// 					model: Message,
// 					as: "messages",
// 					order: [["created_at", "ASC"]],
// 				},
// 			],
// 		});
// 		if (!conversation)
// 			return res.status(404).json({ message: "Conversation introuvable" });

// 		res.json(conversation);
// 	} catch (error) {
// 		console.error(error);
// 		res
// 			.status(500)
// 			.json({ message: "Erreur lors de la récupération de la conversation" });
// 	}
// };

// // Créer une nouvelle conversation
// export const createNewConversation = async (req: Request, res: Response) => {
// 	try {
// 		const { title, isGroup, userIds } = req.body;
// 		const conversation = await Conversation.create({
// 			title,
// 			is_group: isGroup,
// 		});

// 		await Promise.all(
// 			userIds.map((id: number) =>
// 				ConversationUser.create({
// 					conversation_id: conversation.id,
// 					user_id: id,
// 				}),
// 			),
// 		);

// 		res.status(201).json(conversation);
// 	} catch (error) {
// 		console.error(error);
// 		res
// 			.status(500)
// 			.json({ message: "Erreur lors de la création de la conversation" });
// 	}
// };

// // Récupérer tous les messages d'une conversation
// export const getAlleMessagesFronConversation = async (
// 	req: Request,
// 	res: Response,
// ) => {
// 	try {
// 		const conversationId = Number(req.params.conversationId);
// 		const messages = await Message.findAll({
// 			where: { conversation_id: conversationId },
// 			order: [["created_at", "ASC"]],
// 		});
// 		res.json(messages);
// 	} catch (error) {
// 		console.error(error);
// 		res
// 			.status(500)
// 			.json({ message: "Erreur lors de la récupération des messages" });
// 	}
// };

// // Créer un message
// export const createMessage = async (req: Request, res: Response) => {
// 	try {
// 		const { conversationId, content } = req.body;
// 		const senderId = req.user?.id;
// 		if (!senderId)
// 			return res.status(401).json({ message: "Utilisateur non identifié" });

// 		const message = await Message.create({
// 			conversation_id: conversationId,
// 			sender_id: senderId,
// 			content,
// 		});

// 		res.status(201).json(message);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Erreur lors de l'envoi du message" });
// 	}
// };
