import axios from "axios";

interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function sendContactForm(data: ContactFormData) {
	try {
		// Transformation des données camelCase vers snake_case
		const transformedData = {
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
			phone: data.phone,
			subject: data.subject,
			message: data.message,
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
