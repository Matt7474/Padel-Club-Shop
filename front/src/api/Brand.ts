import axios from "axios";
import type { Brand } from "../types/Article";

const API_URL = import.meta.env.VITE_API_URL;

export const createBrand = async (
	data: FormData | { brandName: string; image_url: string },
) => {
	try {
		if (data instanceof FormData) {
			const response = await axios.post(`${API_URL}/brands`, data, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		} else {
			const response = await axios.post(`${API_URL}/brands`, data, {
				headers: { "Content-Type": "application/json" },
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
		// const token = getAuthToken();
		const res = await axios.get(`${API_URL}/brands/`);

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
