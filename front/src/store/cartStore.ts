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
	size?: string | undefined;
};

// Typage du store
type CartStore = {
	cart: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string, size?: string) => void;
	updateQuantity: (id: string, quantity: number, size?: string) => void;
	clearCart: () => void;
};

// Création du store avec persistance (localStorage)
export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			cart: [],

			addToCart: (item) => {
				set((state) => {
					const existing = state.cart.find(
						(p) => p.id === item.id && p.size === item.size,
					);

					if (existing) {
						return {
							cart: state.cart.map((p) =>
								p.id === item.id && p.size === item.size
									? { ...p, quantity: p.quantity + item.quantity }
									: p,
							),
						};
					}

					return { cart: [...state.cart, item] };
				});
			},

			removeFromCart: (id, size) => {
				set((state) => ({
					cart: state.cart.filter(
						(item) => !(item.id === id && item.size === size),
					),
				}));
			},

			updateQuantity: (id, quantity, size) => {
				if (quantity <= 0) {
					get().removeFromCart(id, size);
					return;
				}
				set((state) => ({
					cart: state.cart.map((item) =>
						item.id === id && item.size === size ? { ...item, quantity } : item,
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
