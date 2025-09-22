import axios from "axios";
import type { Brand } from "../types/Article";

const API_URL = import.meta.env.VITE_API_URL;

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
