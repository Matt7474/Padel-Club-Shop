import api from "../api/api";
import type { CartItem } from "../types/Cart";

const API_URL = import.meta.env.VITE_API_URL;
// Crée la session de paiement Stripe
export const createPaymentIntent = async (cartItems: CartItem[]) => {
	try {
		const response = await api.post(`${API_URL}/stripe/create-payment-intent`, {
			items: cartItems,
		});
		return response.data;
	} catch (error) {
		console.error("Erreur lors de la création du paiement :", error);
		throw error;
	}
};
