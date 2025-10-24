// Adresse d'un utilisateur (format API)
export interface Address {
	address_id: number;
	type: "billing" | "shipping";
	street_number: string;
	street_name: string;
	complement?: string;
	zip_code: string;
	city: string;
	country: string;
	is_default: boolean;
}

// Utilisateur (format API - ce que getUserById renvoie)
export interface UserApiResponse {
	user_id: number;
	last_name: string;
	first_name: string;
	phone: string;
	email: string;
	password?: string | undefined;
	role_id: number;
	addresses: Address[];
	created_at: string;
	updated_at: string;
}

// Utilisateur (format application - optionnel, pour usage interne)
export interface User {
	userId?: number;
	lastName?: string;
	firstName?: string;
	phone?: string;
	email: string;
	password?: string | undefined;
	role?: number;
	address?: Address[];
}

export interface AuthUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	role?: string | number;
	token?: string;
	addresses?: Address[];
}

export interface CreateUser {
	last_name: string;
	first_name: string;
	phone: string;
	email: string;
	password: string;
	shipping_address: {
		street_number: string;
		street_name: string;
		zipcode: string;
		city: string;
		country: string;
		additional_info: string;
	};
	billing_address: {
		street_number: string;
		street_name: string;
		zipcode: string;
		city: string;
		country: string;
		additional_info: string;
	} | null;
}
