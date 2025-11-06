import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { CartItem } from "../types/Cart";

const API_URL = import.meta.env.VITE_API_URL;
const authToken = useAuthStore.getState().token;

// Crée la session de paiement Stripe
export const createPaymentIntent = async (cartItems: CartItem[]) => {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const response = await api.post(
			`${API_URL}/stripe/create-payment-intent`,
			{ items: cartItems },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error("Erreur lors de la création du paiement :", error);
		throw error;
	}
};
