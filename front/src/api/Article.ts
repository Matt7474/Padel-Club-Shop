import axios from "axios";
import type Article from "../types/Article";
import type {
	NewArticle,
	NewPromotion,
	Promotion,
	TechRatings,
} from "../types/Article";

const API_URL = import.meta.env.VITE_API_URL;

export async function getArticles(): Promise<Article[]> {
	const API_URL = import.meta.env.VITE_API_URL;
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

export async function getArticleById(id: number): Promise<Article> {
	try {
		const res = await axios.get(`${API_URL}/articles/id/${id}`);
		console.log("id", id);

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

export async function getArticleByName(name: string): Promise<Article> {
	try {
		const res = await axios.get(`${API_URL}/articles/name/${name}`);
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

// Ajouter les images liées à un article
export async function uploadArticleImages(
	articleId: number,
	images: { file: File }[],
): Promise<void> {
	try {
		const formData = new FormData();
		images.forEach((img) => {
			formData.append("images", img.file);
		});

		const res = await axios.post(
			`${API_URL}/articles/${articleId}/images`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			},
		);

		console.log("📸 Images uploadées :", res.data);
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			console.error(
				"❌ Erreur Axios upload images:",
				err.response?.data || err.message,
			);
		} else {
			console.error("❌ Erreur inconnue:", err);
		}
		throw err;
	}
}

// Créer les notes pour une raquette
export async function addTechRatings(articleId: number, ratings: TechRatings) {
	console.log("Test d'ajout de notes dans api", articleId);
	try {
		const res = await axios.post(
			`${API_URL}/articles/${articleId}/ratings`,
			ratings,
			{
				headers: { "Content-Type": "application/json" },
			},
		);
		console.log("🔢 Notes ajoutés :", res.data);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			console.error(
				"❌ Erreur Axios ajout notes (ratings)",
				err.response?.data || err.message,
			);
		} else {
			console.error("❌ Erreur inconnue:", err);
		}
		throw err;
	}
}

// Créer une promo pour un article
export async function addPromo(
	articleId: number,
	promo: NewPromotion,
): Promise<Promotion> {
	try {
		const res = await axios.post(
			`${API_URL}/promotions/article/${articleId}`,
			promo,
			{
				headers: { "Content-Type": "application/json" },
			},
		);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			console.error(
				"❌ Erreur Axios ajout promo",
				err.response?.data || err.message,
			);
		} else {
			console.error("❌ Erreur inconnue:", err);
		}
		throw err;
	}
}
