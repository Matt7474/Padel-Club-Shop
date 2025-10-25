import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/Cart";

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

			getTotalShipping: () => {
				const cart = get().cart;

				const result = cart.reduce(
					(acc, item) => {
						const key = `${item.id}-${item.size ?? "no-size"}`;
						if (!acc.items.has(key)) {
							acc.total += item.shipping_cost || 0;
							acc.items.add(key);
						}
						return acc;
					},
					{ total: 0, items: new Set<string>() },
				);

				return result.total;
			},

			clearCart: () => set({ cart: [] }),
		}),
		{
			name: "cart-storage",
		},
	),
);
