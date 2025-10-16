import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { AuthResponse } from "../types/AuthResponse";
import type { CreateUser, User, UserApiResponse } from "../types/User";

const API_URL = import.meta.env.VITE_API_URL;

// registerUser
export async function createUser(newUser: CreateUser): Promise<User> {
	try {
		console.log("🚀 Body envoyé au serveur :", newUser);

		const res = await axios.post(`${API_URL}/user/register`, newUser, {
			headers: { "Content-Type": "application/json" },
		});

		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			// Message du backend (ex: "Cette adresse e-mail est déjà enregistrée.")
			const backendMessage = err.response?.data?.error;

			// Message de fallback s'il n'y a rien dans la réponse
			const message =
				backendMessage ||
				err.message ||
				"Erreur inconnue lors de la création du compte";

			console.error("❌ Erreur création utilisateur:", message);
			throw new Error(message);
		} else {
			console.error("❌ Erreur inattendue:", err);
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// loginUser
export async function loginUser(user: {
	email: string;
	password: string;
}): Promise<AuthResponse> {
	try {
		const res = await axios.post<AuthResponse>(`${API_URL}/user/login`, user, {
			headers: { "Content-Type": "application/json" },
		});

		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.error;
			const message =
				backendMessage ||
				err.message ||
				"Erreur inconnue lors de la connexion au compte";
			console.error("❌ Erreur connexion utilisateur:", message);
			throw new Error(message);
		} else {
			console.error("❌ Erreur inattendue:", err);
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// getUserById
export async function getUserById(id: number): Promise<UserApiResponse> {
	const token = useAuthStore.getState().token;
	console.log("getUserById", id);

	try {
		const res = await axios.get<UserApiResponse>(`${API_URL}/user/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.error;
			const message =
				backendMessage ||
				err.message ||
				"Erreur inconnue lors de la connexion au compte";
			console.error("❌ Erreur connexion utilisateur:", message);
			throw new Error(message);
		} else {
			console.error("❌ Erreur inattendue:", err);
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// updateUser
export async function updateUser(
	id: number,
	updatedData: Partial<User>,
): Promise<User> {
	const token = useAuthStore.getState().token;

	try {
		const res = await axios.patch<User>(`${API_URL}/user/${id}`, updatedData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.error || err.message;
			throw new Error(backendMessage);
		} else {
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// deleteUser
export async function deleteUser(id: number): Promise<void> {
	const token = useAuthStore.getState().token;

	try {
		await axios.delete(`${API_URL}/user/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.error || err.message;
			throw new Error(backendMessage);
		} else {
			throw new Error("Erreur inattendue lors de la suppression du compte.");
		}
	}
}
