import axios from "axios";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { Brand } from "../types/Article";

const API_URL = import.meta.env.VITE_API_URL;

export const createBrand = async (
	data: FormData | { brandName: string; image_url: string },
) => {
	const authToken = useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");

	try {
		if (data instanceof FormData) {
			const response = await axios.post(`${API_URL}/brands`, data, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});
			return response.data;
		} else {
			const response = await axios.post(`${API_URL}/brands`, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			});
			return response.data;
		}
	} catch (error) {
		console.error("Erreur lors de la création de la marque :", error);
		throw error;
	}
};

export async function getBrands(): Promise<Brand[]> {
	try {
		const res = await api.get(`${API_URL}/brands/`);

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

export async function updateBrand(id: number, brand: Partial<Brand>) {
	const authToken = useAuthStore.getState().token;
	try {
		const res = await api.patch(`${API_URL}/brands/${id}`, brand, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la mise à jour de la marque");
	}
}

export async function deleteBrands(brandId: number): Promise<void> {
	const authToken = useAuthStore.getState().token;
	try {
		await api.delete(`${API_URL}/brands/${brandId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		});
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				`❌ Erreur API: ${err.response?.status} ${err.response?.statusText}`,
			);
		}
		throw new Error("❌ Erreur inconnue lors de la suppression");
	}
}
