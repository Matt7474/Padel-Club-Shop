import axios from "axios";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import type { AuthResponse } from "../types/AuthResponse";
import type { CreateUser, User, UserApiResponse } from "../types/User";

const API_URL = import.meta.env.VITE_API_URL;
const authToken = useAuthStore.getState().token;

interface requestPasswordProps {
	email: string;
	password: string;
	token: string;
}

// registerUser
export async function createUser(newUser: CreateUser): Promise<User> {
	try {
		console.log("🚀 Body envoyé au serveur :", newUser);

		const res = await api.post(`${API_URL}/user/register`, newUser, {
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
		const res = await api.post<AuthResponse>(`${API_URL}/user/login`, user, {
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

// 1. Requete pour le changement de mot de passe
export async function requestResetPassword(payload: { email: string }) {
	try {
		const res = await api.post(
			`${API_URL}/user/request-reset-password`,
			payload,
			{
				headers: { "Content-Type": "application/json" },
			},
		);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.error;
			const message = backendMessage || err.message || "Erreur inconnue";
			throw new Error(message);
		} else {
			throw new Error("Erreur inattendue côté client");
		}
	}
}
// 2. Requete pour le changement de mot de passe
export async function requestPassword({
	email,
	password,
	token,
}: requestPasswordProps) {
	try {
		const res = await api.post(
			`${API_URL}/user/reset-password`,
			{ email, password, token },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			const backendMessage = err.response?.data?.message;
			const message = backendMessage || err.message || "Erreur inconnue";
			throw new Error(message);
		} else {
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// getUserById
export async function getUserById(
	id: number,
	token?: string,
): Promise<UserApiResponse> {
	const authToken = token || useAuthStore.getState().token;
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");

	try {
		const res = await api.get<UserApiResponse>(`${API_URL}/user/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
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

// getAllUsers
export async function getAllUsers(): Promise<UserApiResponse[]> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.get<UserApiResponse[]>(`${API_URL}/user/`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
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
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.patch<User>(`${API_URL}/user/${id}`, updatedData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
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

// updateUserRole
export async function updateUserRole(userId: number, roleId: number) {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		const res = await api.patch(
			`${API_URL}/user/role/${userId}`,
			{ roleId },
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
			const backendMessage = err.response?.data?.error || err.message;
			throw new Error(backendMessage);
		} else {
			throw new Error("Erreur inattendue côté client");
		}
	}
}

// deleteUser
export async function deleteUser(id: number): Promise<void> {
	if (!authToken)
		throw new Error("Token manquant pour récupérer l'utilisateur");
	try {
		await api.delete(`${API_URL}/user/${id}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
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
