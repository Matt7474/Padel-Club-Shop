// ---------- Caractéristiques techniques ----------
export interface CaracTech {
	poids?: string;
	type?: string;
	couleur?: string;
	forme?: string;
	mousse?: string;
	surface?: string;
	niveau_de_jeu?: string;
	genre?: string;
	[key: string]: string | undefined; // autorise d'autres clés optionnelles
}

// ---------- Notes techniques ----------
export interface NoteTech {
	maniabilite: number;
	puissance: number;
	confort: number;
	effet: number;
	tolerance: number;
	controle: number;
}

// ---------- Promotion ----------
export interface Promo {
	code_promo: number;
	nom: string;
	description: string;
	type_remise: "pourcentage" | "montant" | string; // si tu veux restreindre, sinon laisse string
	valeur_remise: number;
	date_debut: string; // format ISO, ex: "2025-07-29"
	date_fin: string;
	statut: "actif" | "expiré" | "à venir" | string;
}

// ---------- Avis utilisateur ----------
export interface Avis {
	// tu peux enrichir plus tard si tu sais ce que contient un avis
	[key: string]: unknown;
}

// ---------- Article complet ----------
export default interface Article {
	code_article: number;
	nom: string;
	description: string;
	reference: string;
	marque: string;
	image: string[];
	prix_ttc: number;
	qte_stock: number;
	statut: "disponible" | "rupture" | "précommande" | string;
	frais_livraison: number;
	carac_tech: CaracTech;
	note_tech: NoteTech;
	promos: Promo[];
	avis: Avis[];
}
