import { addArticle } from "../api/Article";
import type {
	ArticleFormState,
	BagState,
	BallState,
	ClothingState,
	NewArticle,
	RacketState,
	ShoesState,
	TechCharacteristics,
} from "../types/Article";

// Fonction pour envoyer l'article à l'API
export const submitArticle = async (articleData: NewArticle) => {
	const res = await addArticle(articleData);
	return res;
};

// Fonction pour construire l'objet NewArticle depuis ton state
// buildNewArticle.ts
export const buildNewArticle = (state: ArticleFormState): NewArticle => {
	const {
		articleType,
		articleName,
		articleDescription,
		articleReference,
		articleBrand,
		articlePriceTTC,
		articleQty,
		articleStatus,
		articleShippingCost,
		techCharacteristicsState,
		articlePromo,
		articleDiscountValue,
		articlePromoType,
		articleDescriptionPromo,
		articlePromoStart,
		articlePromoEnd,
	} = state;

	const validStatus: "available" | "preorder" | "out_of_stock" | undefined = [
		"available",
		"preorder",
		"out_of_stock",
	].includes(articleStatus)
		? (articleStatus as "available" | "preorder" | "out_of_stock")
		: undefined;

	const promotions = articlePromo
		? [
				{
					discount_type: articlePromoType as "percentage" | "amount",
					discount_value: Number(articleDiscountValue),
					description: articleDescriptionPromo,
					start_date: articlePromoStart,
					end_date: articlePromoEnd,
					status: "upcoming" as const, // Type littéral correct
				},
			]
		: [];

	return {
		type: articleType,
		name: articleName,
		reference: articleReference,
		description: articleDescription,
		brand_id: articleBrand ?? 0,
		price_ttc: Number(articlePriceTTC),
		stock_quantity: Number(articleQty),
		status: validStatus,
		shipping_cost: Number(articleShippingCost),
		tech_characteristics: techCharacteristicsState,
		promotions,
	};
};

type TechState = RacketState &
	BagState &
	BallState &
	ClothingState &
	ShoesState;

export const getTechCharacteristicsState = (
	type: string,
	state: TechState,
): TechCharacteristics => {
	switch (type) {
		case "racket":
			return {
				weight: state.rCharacteristicsWeight,
				color: state.rCharacteristicsColor,
				shape: state.rCharacteristicsShape,
				foam: state.rCharacteristicsFoam,
				surface: state.rCharacteristicsSurface,
				level: state.rCharacteristicsLevel,
				gender: state.rCharacteristicsGender,
			};
		case "bag":
			return {
				weight: state.bCharacteristicsWeight,
				type: state.bCharacteristicsType,
				volume: state.bCharacteristicsVolume,
				dimensions: state.bCharacteristicsDimensions,
				material: state.bCharacteristicsMaterial,
				color: state.bCharacteristicsColor,
				compartment: state.bCharacteristicsCompartment,
			};
		case "ball":
			return {
				weight: state.ballCharacteristicsWeight,
				diameter: state.ballCharacteristicsDiameter,
				rebound: state.ballCharacteristicsRebound,
				pressure: state.ballCharacteristicsPressure,
				material: state.ballCharacteristicsMaterial,
				color: state.ballCharacteristicsColor,
				type: state.ballCharacteristicsType,
			};
		case "clothing":
			return {
				type: state.cCharacteristicsType,
				gender: state.cCharacteristicsGender,
				material: state.cCharacteristicsMaterial,
				color: state.cCharacteristicsColor,
				fit: state.cCharacteristicsSize
					?.map((s) => `${s.label}:${s.stock}`)
					.join(","),
			};
		case "shoes":
			return {
				weight: state.sCharacteristicsWeight,
				color: state.sCharacteristicsColor,
				sole: state.sCharacteristicsSole,
				gender: state.sCharacteristicsGender,
				fit: state.sCharacteristicsSize
					?.map((s) => `${s.label}:${s.stock}`)
					.join(","),
			};
		default:
			return {};
	}
};
