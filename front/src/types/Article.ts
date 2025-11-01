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
	level?: string;

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
	promo_id: number;
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
	brand: Brand;
	images: ArticleImage[];
	is_deleted?: boolean;
	price_ttc: number;
	stock_quantity: number | Record<string, number | undefined>;
	status: "available" | "out_of_stock" | "preorder" | string;
	shipping_cost: number;
	tech_characteristics?: TechCharacteristics;
	ratings?: TechRatings;
	promotions?: Promotion[];
	reviews?: Review[];
	created_at?: Date;
}
// ---------- Marque ----------
export interface Brand {
	brand_id?: number;
	name: string;
	logo: string;
}

// ---------- Image ----------
export interface ArticleImage {
	image_id: number;
	url: string;
	is_main: boolean;
}

// ---------- New Article ----------
export interface NewArticle {
	type: string;
	name: string;
	reference?: string;
	description?: string;
	brand_id?: number;
	price_ttc: number;
	stock_quantity?: number;
	status?: "available" | "preorder" | "out_of_stock";
	shipping_cost?: number;
	tech_characteristics?: TechCharacteristics;
	tech_ratings?: Record<string, number>;
	promotions?: NewPromotion[];
}

// ---------- Form Article ----------
export interface ArticleFormState {
	articleType: string;
	articleName: string;
	articleDescription: string;
	articleReference: string;
	articleBrand: number | null;
	articlePriceTTC: string;
	articleQty: string;
	articleStatus: string;
	articleShippingCost: string;
	techCharacteristicsState: TechCharacteristics;
	techRatings: TechRatings;
	articlePromo: boolean;
	articleDiscountValue: string | number;
	articlePromoType: string;
	articleDescriptionPromo: string;
	articlePromoStart: string;
	articlePromoEnd: string;
	images: { id: string; file: File; previewUrl: string }[];
}

// ---------- Promo Article ----------
export interface NewPromotion {
	promo_id?: NewPromotion;
	name?: string;
	description?: string;
	discount_type: "percentage" | "amount" | string;
	discount_value: number;
	start_date: string;
	end_date: string;
	status: "active" | "upcoming" | "expired";
}

export interface RacketState {
	rCharacteristicsWeight?: string;
	rCharacteristicsColor?: string;
	rCharacteristicsShape?: string;
	rCharacteristicsFoam?: string;
	rCharacteristicsSurface?: string;
	rCharacteristicsLevel?: string;
	rCharacteristicsGender?: string;
}

export interface BagState {
	bCharacteristicsWeight?: string;
	bCharacteristicsType?: string;
	bCharacteristicsVolume?: string;
	bCharacteristicsDimensions?: string;
	bCharacteristicsMaterial?: string;
	bCharacteristicsColor?: string;
	bCharacteristicsCompartment?: string;
}

export interface BallState {
	ballCharacteristicsWeight?: string;
	ballCharacteristicsDiameter?: string;
	ballCharacteristicsRebound?: string;
	ballCharacteristicsPressure?: string;
	ballCharacteristicsMaterial?: string;
	ballCharacteristicsColor?: string;
	ballCharacteristicsType?: string;
}

export interface ClothingState {
	cCharacteristicsType?: string;
	cCharacteristicsGender?: string;
	cCharacteristicsMaterial?: string;
	cCharacteristicsColor?: string;
	cCharacteristicsSize?: { label: string; stock: number }[];
}

export interface ShoesState {
	sCharacteristicsWeight?: string;
	sCharacteristicsColor?: string;
	sCharacteristicsSole?: string;
	sCharacteristicsGender?: string;
	sCharacteristicsSize?: { label: string; stock: number }[];
}
