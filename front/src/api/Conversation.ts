// import axios from "axios";
// import { useAuthStore } from "../store/useAuthStore";
// import type {
// 	Conversation,
// 	Message,
// 	NewConversationPayload,
// 	NewMessagePayload,
// } from "../types/Conversation";

// const API_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
// 	withCredentials: true,
// });

// // ---------------- Conversation ----------------
// export async function getAllConversations(): Promise<Conversation[]> {
// 	const authToken = useAuthStore.getState().token;
// 	if (!authToken)
// 		throw new Error("Token manquant pour récupérer l'utilisateur");

// 	try {
// 		const response = await api.get(`${API_URL}/conversation/conversations`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${authToken}`,
// 			},
// 		});
// 		return response.data;
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.message ||
// 					"Erreur lors de la récupération des conversations",
// 			);
// 		}
// 		throw new Error("Erreur inconnue");
// 	}
// }

// export async function getConversationById(
// 	conversationId: number,
// ): Promise<Conversation> {
// 	const authToken = useAuthStore.getState().token;
// 	if (!authToken)
// 		throw new Error("Token manquant pour récupérer l'utilisateur");
// 	try {
// 		const response = await api.get(
// 			`${API_URL}/conversation/${conversationId}`,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${authToken}`,
// 				},
// 			},
// 		);
// 		return response.data;
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.message ||
// 					"Erreur lors de la récupération de la conversation",
// 			);
// 		}
// 		throw new Error("Erreur inconnue");
// 	}
// }

// export async function createNewConversation(
// 	payload: NewConversationPayload,
// ): Promise<Conversation> {
// 	const authToken = useAuthStore.getState().token;
// 	if (!authToken)
// 		throw new Error("Token manquant pour récupérer l'utilisateur");
// 	try {
// 		const transformedData = {
// 			title: payload.title ?? null,
// 			isGroup: payload.isGroup,
// 			userIds: payload.userIds,
// 		};
// 		const response = await api.post(
// 			`${API_URL}/conversation/conversations`,
// 			transformedData,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${authToken}`,
// 				},
// 			},
// 		);
// 		return response.data;
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.message ||
// 					"Erreur lors de la création de la conversation",
// 			);
// 		}
// 		throw new Error("Erreur inconnue");
// 	}
// }

// // ---------------- Messages ----------------
// export async function getAllMessagesFromConversation(
// 	conversationId: number,
// ): Promise<Message[]> {
// 	const authToken = useAuthStore.getState().token;
// 	if (!authToken)
// 		throw new Error("Token manquant pour récupérer l'utilisateur");
// 	try {
// 		const response = await api.get(`${API_URL}/messages/${conversationId}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${authToken}`,
// 			},
// 		});
// 		return response.data;
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.message ||
// 					"Erreur lors de la récupération des messages",
// 			);
// 		}
// 		throw new Error("Erreur inconnue");
// 	}
// }

// export async function createMessage(
// 	payload: NewMessagePayload,
// ): Promise<Message> {
// 	const authToken = useAuthStore.getState().token;
// 	if (!authToken)
// 		throw new Error("Token manquant pour récupérer l'utilisateur");
// 	try {
// 		const transformedData = {
// 			conversationId: payload.conversationId,
// 			content: payload.content,
// 		};
// 		const response = await api.post(`${API_URL}/messages`, transformedData);
// 		return response.data;
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.message || "Erreur lors de l'envoi du message",
// 			);
// 		}
// 		throw new Error("Erreur inconnue");
// 	}
// }
