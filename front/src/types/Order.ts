// Une ligne de commande
export interface OrderLine {
	order_line_id: number;
	article: number;
	quantity: number;
}

// Le paiement
export interface Payment {
	payment_id: number;
	payment_method: string;
}

// La commande complète
export interface Order {
	order_id: number;
	reference: string;
	user_id: number;
	order_lines: OrderLine[];
	payment: Payment;
	created_at: string;
	total_ttc?: number;
	tva_rate?: number;
	status?: string;
}
