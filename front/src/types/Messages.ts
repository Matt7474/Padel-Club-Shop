export interface Imessages {
	id: number;
	user_id?: number;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
	response?: string;
	responded_at?: string;
	created_at?: string;
	order_number?: string;
	is_read?: boolean;
	is_deleted?: boolean;
	user: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
	};
}

export interface FormData {
	user_id?: number | null;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	orderNumber: string;
	is_deleted: boolean;
}
