import { create } from "zustand";
import type {} from "../types/AuthResponse";
import type { AuthUser } from "../types/User";

interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
	token?: string;
	login: (userData: AuthUser, token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	token: undefined,
	login: (userData, token) =>
		set({ user: userData, isAuthenticated: true, token }),
	logout: () => set({ user: null, isAuthenticated: false, token: undefined }),
}));
