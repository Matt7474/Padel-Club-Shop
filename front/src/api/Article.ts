import axios from "axios";
import type Article from "../types/Article";
import type { NewArticle } from "../types/Article";

const API_URL = import.meta.env.VITE_API_URL;

export async function getArticles(): Promise<Article[]> {
	try {
		// const token = getAuthToken();
		const res = await axios.get(`${API_URL}/articles/`);

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

export async function getArticlesType(type?: string): Promise<Article[]> {
	try {
		const url = `${API_URL}/articles/type/${type}`;

		const res = await axios.get(url);
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

export async function addArticle(article: NewArticle): Promise<Article> {
	try {
		console.log("🚀 Body envoyé au serveur :", article);

		const res = await axios.post(`${API_URL}/articles`, article, {
			headers: { "Content-Type": "application/json" },
		});

		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			console.error("❌ Erreur Axios:", err.response?.data || err.message);
		} else {
			console.error("❌ Erreur inconnue:", err);
		}
		throw err;
	}
}
