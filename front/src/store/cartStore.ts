import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/Cart";

// Typage du store
type CartStore = {
	cart: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string, size?: string) => void;
	updateQuantity: (id: string, quantity: number, size?: string) => void;
	clearCart: () => void;
	getTotalShipping: () => number;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			cart: [],

			addToCart: (item: CartItem) => {
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

			removeFromCart: (id: string, size?: string) => {
				set((state) => ({
					cart: state.cart.filter(
						(item) => !(item.id === id && item.size === size),
					),
				}));
			},

			updateQuantity: (id: string, quantity: number, size?: string) => {
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

			getTotalShipping: () => {
				const cart = get().cart;
				// On utilise un Set pour compter une seule fois les frais par produit+taille
				const seen = new Set<string>();
				return cart.reduce((total, item) => {
					const key = `${item.id}-${item.size ?? "no-size"}`;
					if (!seen.has(key)) {
						total += item.shipping_cost ?? 0;
						seen.add(key);
					}
					return total;
				}, 0);
			},

			clearCart: () => set({ cart: [] }),
		}),
		{
			name: "cart-storage",
		},
	),
);
