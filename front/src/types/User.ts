// Adresse d'un utilisateur
export interface Address {
	zip_code: string;
	address_id: number;
	type: "billing" | "shipping"; // ou string si tu veux plus générique
	street_number: string;
	street_name: string;
	complement?: string;
	postal_code: string;
	city: string;
	country: string;
	is_default: boolean;
}

// Utilisateur
export interface User {
	user_id: number;
	lastname: string;
	firstname: string;
	phone: string;
	email: string;
	password: string; // hashé
	role: number; // ex: 1 = admin, 2 = client
	addresses: Address[];
}
