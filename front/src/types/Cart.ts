import type { Brand } from "./Article";

export type CartItem = {
	id: string;
	name: string;
	brand: Brand;
	price: number;
	image: string;
	quantity: number;
	type: string;
	shipping_cost: number;
	size?: string;
};
