// store/useToastStore.ts
import { create } from "zustand";

interface Toast {
	id: number;
	text: string;
	bg: string;
	duration?: number;
}

interface ToastStore {
	toasts: Toast[];
	addToast: (text: string, bg?: string, duration?: number) => void;
	removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	addToast: (text, bg = "bg-green-600", duration = 3000) =>
		set((state) => ({
			toasts: [...state.toasts, { id: Date.now(), text, bg, duration }],
		})),
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id),
		})),
}));
