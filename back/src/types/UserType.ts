export interface AddressInput {
	street_number: string;
	street_name: string;
	additional_info?: string | null;
	zipcode: string;
	city: string;
	country: string;
}
