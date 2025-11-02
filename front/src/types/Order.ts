import type Article from "./Article";

// Une ligne de commande
export interface OrderLine {
	order_line_id: number;
	article: number;
	quantity: number;
	price: number;
}

// Le paiement
export interface Payment {
	payment_id: number;
	payment_method: string;
}

// La commande complète
export interface Order {
	total_amount: string;
	order_id: number;
	reference: string;
	user_id: number;
	order_lines: OrderLine[];
	payment: Payment;
	created_at: string;
	updated_at: string;
	total_ttc?: number;
	tva_rate?: number;
	status: "paid" | "processing" | "ready" | "shipped" | "cancelled" | "refund";
	is_delete: boolean;
	payment_intent_id: string;
	refund_id: string;
	refunded_at: Date;
	items: OrderItem[];
}

export interface OrderItem {
	article_id: number;
	name: string;
	price: number; // prix payé TTC
	original_price?: number; // prix catalogue ou prix avant promo
	quantity: number;
	size?: string | null;
	article?: Article;
	is_delete: boolean;
}

export interface getMyOrdersProps {
	order_id: number;
	reference: string;
	total_amount: number;
	status: "paid" | "processing" | "ready" | "shipped" | "cancelled";
	created_at: string;
}
