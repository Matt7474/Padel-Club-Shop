import type { Brand } from "./Article";

export interface CartItem {
	id: string;
	name: string;
	brand?: Brand;
	price: number;
	image?: string;
	quantity: number;
}
