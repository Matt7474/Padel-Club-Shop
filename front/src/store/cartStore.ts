// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Brand } from "../types/Article";

// Définition du type pour un article du panier
export type CartItem = {
	id: string;
	name: string;
	brand: Brand;
	price: number;
	image: string;
	quantity: number;
	type: string;
};

// Typage du store
type CartStore = {
	cart: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
};

// Création du store avec persistance (localStorage)
export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			cart: [],

			addToCart: (item) => {
				set((state) => {
					const existing = state.cart.find((p) => p.id === item.id);
					if (existing) {
						return {
							cart: state.cart.map((p) =>
								p.id === item.id
									? { ...p, quantity: p.quantity + item.quantity }
									: p,
							),
						};
					}
					return { cart: [...state.cart, item] };
				});
			},

			removeFromCart: (id) => {
				set((state) => ({
					cart: state.cart.filter((item) => item.id !== id),
				}));
			},

			updateQuantity: (id, quantity) => {
				if (quantity <= 0) {
					// si quantité <= 0, on supprime l'article
					get().removeFromCart(id);
					return;
				}
				set((state) => ({
					cart: state.cart.map((item) =>
						item.id === id ? { ...item, quantity } : item,
					),
				}));
			},

			clearCart: () => set({ cart: [] }),
		}),
		{
			name: "cart-storage", // clé dans localStorage
		},
	),
);
