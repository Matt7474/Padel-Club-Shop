import axios from "axios";
import type { CartItem } from "../store/cartStore";

const API_URL = import.meta.env.VITE_API_URL;
// Crée la session de paiement Stripe
export const createPaymentIntent = async (cartItems: CartItem[]) => {
	try {
		const response = await axios.post(
			`${API_URL}/stripe/create-payment-intent`,
			{
				items: cartItems,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Erreur lors de la création du paiement :", error);
		throw error;
	}
};
