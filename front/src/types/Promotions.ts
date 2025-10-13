export interface Promotion {
	promo_id: number;
	article_id: number;
	label?: string | null;
	discount_percent: number;
	start_date: string;
	end_date: string;
	status?: "active" | "upcoming" | "expired";
}

export interface Promo {
	promo_id: number;
	name: string | null;
	description: string;
	start_date: string;
	end_date: string;
	status?: "active" | "upcoming" | "expired";
}
