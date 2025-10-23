import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

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

const API_URL = import.meta.env.VITE_API_URL;

export async function sendContactForm(data: ContactFormData) {
	try {
		// Transformation des données camelCase vers snake_case
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

		const response = await axios.post(
			`${API_URL}/contact/contact`,
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

export async function getClientMessages() {
	try {
		const authToken = useAuthStore.getState().token;
		const response = await axios.get(
			`${API_URL}/contact/messages`,

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
				error.response?.data?.message || "Erreur lors de l'envoi",
			);
		}
		throw new Error("Erreur inconnue");
	}
}

export async function markMessageAsRead(id: number) {
	try {
		const authToken = useAuthStore.getState().token;

		if (!authToken)
			throw new Error("Token manquant pour récupérer l'utilisateur");

		const res = await axios.patch(
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
	try {
		const authToken = useAuthStore.getState().token;

		if (!authToken)
			throw new Error("Token manquant pour récupérer l'utilisateur");

		const res = await axios.patch(
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

export async function getMyMessages(email: string) {
	try {
		const authToken = useAuthStore.getState().token;
		const response = await axios.get(
			`${API_URL}/contact/messages/${encodeURIComponent(email)}`,

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
