// ---------- Caractéristiques techniques ----------
export interface TechCharacteristics {
	// Commun à tous les produits
	weight?: string;
	type?: string;
	color?: string;
	gender?: string;

	// Vêtements spécifiques
	clothing_type?: string; // "polo", "dress", "shorts", "skirt", etc.
	material?: string;
	fit?: string; // "regular", "athletic", "slim", etc.
	technology?: string; // "Dri-FIT", "AEROREADY", etc.
	length?: string;
	sleeves?: string; // "short", "long", "sleeveless"
	collar?: string; // "ribbed", "crew neck", etc.
	pockets?: string;

	// Chaussures spécifiques
	sole?: string;
	upper_material?: string;

	// Raquettes spécifiques
	shape?: string;
	foam?: string;
	surface?: string;
	skill_level?: string;

	[key: string]: string | undefined; // autorise d'autres clés optionnelles
}

// ---------- Notes techniques ----------
export interface TechRatings {
	// Ratings pour raquettes
	maneuverability?: number;
	power?: number;
	comfort?: number;
	spin?: number;
	tolerance?: number;
	control?: number;

	// Ratings pour chaussures
	stability?: number;
	durability?: number;
	grip?: number;
	breathability?: number;
	support?: number;

	// Permet d'ajouter d'autres ratings selon le type de produit
	[key: string]: number | undefined;
}

// ---------- Promotion ----------
export interface Promotion {
	promotion_id: number;
	name: string;
	description: string;
	discount_type: "percentage" | "amount" | string;
	discount_value: number;
	start_date: string; // format ISO, ex: "2025-07-29"
	end_date: string;
	status: "active" | "expired" | "upcoming" | string;
}

// ---------- Avis utilisateur ----------
export interface Review {
	review_id: number;
	user: number; // ID de l'utilisateur au lieu du nom
	rating: number;
	comment: string;
	date?: string; // optionnel si pas toujours présent
	[key: string]: unknown; // tu peux enrichir plus tard si besoin
}

// ---------- Article complet ----------
export default interface Article {
	type: string;
	article_id: number;
	name: string;
	description: string;
	reference: string;
	brand: string;
	images: string[];
	price_ttc: number;
	stock_quantity: number | Record<string, number | undefined>;
	status: "available" | "out_of_stock" | "preorder" | string;
	shipping_cost: number;
	tech_characteristics: TechCharacteristics;
	tech_ratings?: TechRatings;
	promotions?: Promotion[];
	reviews?: Review[];
}
