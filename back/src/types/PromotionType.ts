export type DiscountType = "amount" | "%";

export interface PromotionAttributes {
	promo_id?: number;
	article_id: number;
	description?: string | null;
	name?: string | null;
	discount_type: DiscountType;
	discount_value: number;
	start_date: string | Date;
	end_date: string | Date;
	status?: "active" | "upcoming" | "expired";
}

// Champs facultatifs à la création
export interface PromotionCreationAttributes
	extends Omit<
		PromotionAttributes,
		"promo_id" | "status" | "name" | "description"
	> {
	promo_id?: number;
	status?: "active" | "upcoming" | "expired";
	name?: string | null;
	description?: string | null;
}
