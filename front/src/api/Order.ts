import axios from "axios";
import type { CartItem } from "../store/cartStore";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

export async function createOrderAndUpdateStock(cart: CartItem[]) {
	try {
		const authToken = useAuthStore.getState().token;
		const userId = useAuthStore.getState().user?.id;

		if (!authToken)
			throw new Error("Token manquant pour récupérer l'utilisateur");
		if (!userId) throw new Error("Utilisateur non identifié");

		const res = await axios.post(
			`${API_URL}/order/create`,
			{ cart, userId },
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
				"Erreur lors de la création de la commande :",
				error.message,
			);
		} else {
			console.error(
				"Erreur inconnue lors de la création de la commande :",
				error,
			);
		}
		throw error;
	}
}
