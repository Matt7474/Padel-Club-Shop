import { create } from "zustand";
import type { AuthUser } from "../types/User";

interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
	token?: string;
	login: (userData: AuthUser, token: string) => void;
	logout: () => void;
	updateUser: (userData: AuthUser) => void;
}

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthState>((set) => ({
	user: savedUser ? JSON.parse(savedUser) : null,
	isAuthenticated: !!savedToken,
	token: savedToken || undefined,

	login: (userData, token) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(userData));
		set({ user: userData, isAuthenticated: true, token });
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({ user: null, isAuthenticated: false, token: undefined });
	},

	updateUser: (userData) => {
		localStorage.setItem("user", JSON.stringify(userData));
		set({ user: userData });
	},
}));
