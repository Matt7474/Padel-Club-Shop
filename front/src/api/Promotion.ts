import axios from "axios";
import type { Promo } from "../types/Promotions";

const API_URL = import.meta.env.VITE_API_URL;

export async function getPromotion(): Promise<Promo[]> {
	try {
		const res = await axios.get(`${API_URL}/promotions/promotion`);

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
	try {
		const res = await axios.post(`${API_URL}/promotions/promotion`, promo);
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
	console.log(promoId);

	try {
		const res = await axios.patch(
			`${API_URL}/promotions/promotion/${promoId}`,
			promo,
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
	try {
		const res = await axios.delete(`${API_URL}/promotions/promotion/${id}`);
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
