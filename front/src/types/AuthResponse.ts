export interface AuthResponse {
	message: string;
	user: {
		id: number;
		email: string;
		first_name: string;
		last_name: string;
		role?: string | null;
	};
	token: string;
}
