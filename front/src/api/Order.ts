import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { CartItem } from "../types/Cart";
import type { getMyOrdersProps, Order } from "../types/Order";

const API_URL = import.meta.env.VITE_API_URL;
const userId = useAuthStore.getState().user?.id;

export async function createOrderAndUpdateStock(
	cart: CartItem[],
	paymentIntentId: string,
) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		if (!userId) throw new Error("Utilisateur non identifié");

		const res = await api.post(
			`${API_URL}/order/create`,
			{ cart, userId, paymentIntentId },
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

export async function getOrders(): Promise<Order[]> {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer les commandes");
	try {
		const res = await api.get(`${API_URL}/order/orders`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});

		return res.data.orders as Order[];
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Erreur récupération commandes :", error.message);
		} else {
			console.error("Erreur inconnue récupération commandes :", error);
		}
		throw error;
	}
}

export async function getMyOrders(): Promise<getMyOrdersProps[]> {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		if (!userId) throw new Error("Utilisateur non identifié");

		const res = await api.get(`${API_URL}/order/my-orders`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
			params: { userId },
		});
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

export async function deleteOrder(id: number) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		if (!id) throw new Error("Commande non identifié");

		const res = await api.delete(`${API_URL}/order/delete/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
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

export async function updateOrderStatus(id: number, status: string) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	if (!id) throw new Error("Commande non identifiée");

	try {
		const res = await api.patch(
			`${API_URL}/order/${id}/status`,
			{ status },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);

		// On retourne la commande mise à jour
		return res.data.order;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Erreur mise à jour commande :", error.message);
		} else {
			console.error("Erreur inconnue mise à jour commande :", error);
		}
		throw error;
	}
}

export async function refundOrder(id: number) {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	if (!id) throw new Error("Commande non identifiée");

	try {
		const res = await api.post(
			`${API_URL}/order/refund/${id}`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);
		return res.data.order;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Erreur mise à jour commande :", error.message);
		} else {
			console.error("Erreur inconnue mise à jour commande :", error);
		}
		throw error;
	}
}
