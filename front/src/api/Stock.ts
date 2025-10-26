import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { CartItem } from "../types/Cart";

const API_URL = import.meta.env.VITE_API_URL;

export async function verifyStockBeforePayment(cart: CartItem[]) {
	try {
		const authToken = useAuthStore.getState().token;

		if (!authToken) {
			throw new Error("Token manquant pour récupérer l'utilisateur");
		}

		const res = await api.post(
			`${API_URL}/stock/check-before-payment`,
			{ cart },
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
			console.error("Erreur lors de la vérification du stock :", error.message);
		} else {
			console.error(
				"Erreur inconnue lors de la vérification du stock :",
				error,
			);
		}
		throw error;
	}
}

export async function updateStockAfterPayment(cart: CartItem[]) {
	try {
		const authToken = useAuthStore.getState().token;

		if (!authToken) {
			throw new Error("Token manquant pour récupérer l'utilisateur");
		}

		const res = await api.post(
			`${API_URL}/stock/update-after-payment`,
			{ cart },
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
			console.error("Erreur lors de la mise a jour du stock :", error.message);
		} else {
			console.error("Erreur inconnue lors de la mise a jour du stock :", error);
		}
		throw error;
	}
}
