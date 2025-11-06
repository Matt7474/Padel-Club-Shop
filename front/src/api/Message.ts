import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { Message } from "../types/Messages";

const API_URL = import.meta.env.VITE_API_URL;
const authToken = useAuthStore.getState().token;
const api = axios.create({
	withCredentials: true,
});

// ---------------- Messages des utilisateurs ----------------
export async function getAllUserMessages(): Promise<Message[]> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");

	try {
		const response = await api.get(`${API_URL}/message/all`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la récupération des messages",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

// ---------------- Passage de "is_read" a true ----------------
export const markMessagesAsRead = async (userId: number) => {
	if (!authToken)
		throw new Error("Token manquant pour marquer les messages comme lus");

	try {
		const response = await axios.patch(
			`${API_URL}/message/mark-read/${userId}`,
			{}, // corps vide
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors du marquage des messages comme lus",
			);
		}
		throw new Error("Erreur inconnue");
	}
};

// ---------------- Passage de "is_read" receiver a true ----------------
export const markMessagesReceiverAsRead = async (userId: number) => {
	if (!authToken)
		throw new Error("Token manquant pour marquer les messages comme lus");

	try {
		const response = await axios.patch(
			`${API_URL}/message/mark-read-r/${userId}`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors du marquage des messages comme lus",
			);
		}
		throw new Error("Erreur inconnue");
	}
};

// ---------------- Messages d'un utilisateur ----------------
export async function getUserMessages(userId: number): Promise<Message[]> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");

	try {
		const response = await api.get(`${API_URL}/message/${userId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la récupération des messages",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

// ---------------- Envoyer un message utilisateur → admins ----------------
export async function sendUserMessage(payload: {
	sender_id: number;
	content: string;
}): Promise<Message[]> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.post(`${API_URL}/message/user`, payload, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de l'envoi du message",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

// ---------------- Envoyer un message admin → utilisateur ----------------
export async function sendAdminMessage(payload: {
	admin_id: number;
	user_id: number;
	content: string;
}): Promise<Message> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.post(`${API_URL}/message/admin`, payload, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de l'envoi du message",
			);
		}
		throw new Error("Erreur inconnue");
	}
}
