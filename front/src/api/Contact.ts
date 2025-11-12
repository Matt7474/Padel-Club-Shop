import axios from "axios";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

interface ContactFormData {
	user_id?: number | null;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	orderNumber: string;
}

export async function sendContactForm(data: ContactFormData) {
	try {
		const transformedData = {
			user_id: data.user_id ?? null,
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
			phone: data.phone,
			subject: data.subject,
			message: data.message,
			order_number: data.orderNumber,
		};

		const response = await api.post(
			`${API_URL}/contact/message`,
			transformedData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de l'envoi",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

export async function getMessagesForm() {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.get(`${API_URL}/contact/messages`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de l'envoi",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

export async function markMessageAsRead(id: number) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.patch(
			`${API_URL}/contact/messages/markMessageAsRead/${id}`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);

		return res.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(
				"Erreur lors de la modifiaction du marqueur",
				error.message,
			);
		} else {
			console.error(
				"Erreur inconnue lors de la modifiaction du marqueur",
				error,
			);
		}
		throw error;
	}
}

export async function responseMessage(id: number, response: string) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.patch(
			`${API_URL}/contact/messages/response/${id}`,
			{ response },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);

		return res.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(
				"Erreur lors de la modifiaction du marqueur",
				error.message,
			);
		} else {
			console.error(
				"Erreur inconnue lors de la modifiaction du marqueur",
				error,
			);
		}
		throw error;
	}
}

export async function deleteMessage(id: number) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.patch(
			`${API_URL}/contact/delete/${id}`,
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
					"Erreur lors de la récupération des messages",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

export async function restoreMessage(id: number) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.patch(
			`${API_URL}/contact/restore/${id}`,
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
					"Erreur lors de la récupération des messages",
			);
		}
		throw new Error("Erreur inconnue");
	}
}
