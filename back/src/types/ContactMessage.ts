import type { Optional } from "sequelize";

export interface ContactMessageAttributes {
	id: number;
	user_id?: number | null;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string | null;
	subject:
		| "general"
		| "order"
		| "product"
		| "complaint"
		| "partnership"
		| "other";
	order_number?: string | null;
	message: string;
	response?: string | null;
	status: "new" | "in_progress" | "resolved" | "closed";
	is_read: boolean;
	is_deleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ContactMessageCreationAttributes
	extends Optional<
		ContactMessageAttributes,
		| "id"
		| "user_id"
		| "phone"
		| "order_number"
		| "response"
		| "created_at"
		| "updated_at"
	> {}
