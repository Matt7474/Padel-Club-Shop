import axios from "axios";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { Promo } from "../types/Promotions";

const API_URL = import.meta.env.VITE_API_URL;
const authToken = useAuthStore.getState().token;

export async function getPromotion(): Promise<Promo[]> {
	try {
		const res = await api.get(`${API_URL}/promotions/promotion`);

		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la requête");
	}
}

export async function createPromo(promo: {
	name?: string;
	description?: string;
	start_date: string;
	end_date: string;
}): Promise<Promo> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.post(`${API_URL}/promotions/promotion`, promo, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText} - ${err.response?.data?.message}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la requête");
	}
}

export async function updatePromo(
	promoId: number,
	promo: {
		name?: string;
		description?: string;
		start_date: string;
		end_date: string;
	},
): Promise<Promo> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.patch(
			`${API_URL}/promotions/promotion/${promoId}`,
			promo,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText} - ${err.response?.data?.message}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la requête");
	}
}

export async function deletePromoById(id: number) {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.delete(`${API_URL}/promotions/promotion/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText} - ${err.response?.data?.message}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la requête");
	}
}
