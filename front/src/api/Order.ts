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

export interface getMyOrdersProps {
	order_id: number;
	reference: string;
	total_amount: number;
	status: "pending" | "paid" | "cancelled" | "shipped";
	created_at: string;
}

export async function getMyOrders(): Promise<getMyOrdersProps[]> {
	try {
		const authToken = useAuthStore.getState().token;
		const userId = useAuthStore.getState().user?.id;

		if (!authToken)
			throw new Error("Token manquant pour récupérer l'utilisateur");
		if (!userId) throw new Error("Utilisateur non identifié");

		const res = await axios.get(`${API_URL}/order/my-orders`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
			params: { userId },
		});
		console.log("COMMANDES RECUES :", res.data.orders);
		return res.data.orders;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Erreur récupération commandes :", error.message);
		} else {
			console.error("Erreur inconnue récupération commandes :", error);
		}
		throw error;
	}
}
