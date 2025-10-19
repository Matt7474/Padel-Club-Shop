import type { MouseEvent } from "react";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/ToastStore ";

interface AddToCartParams {
	article: {
		article_id: number;
		name: string;
		brand: { brand_id?: number; name: string; logo: string };
		type: string;
		tech_characteristics?: { fit?: string };
	};
	displayPrice: number;
	firstImageUrl: string;
	selectedSize?: string | null;
	quantity: number; // Quantité demandée par l'utilisateur
	setInfoModal: (
		fn: (
			prev: { id: number; text: string }[],
		) => { id: number; text: string }[],
	) => void;
	setAlert: (value: boolean) => void;
}

/**
 * Parse la chaîne "36:5,37:2,38:3" et retourne la quantité disponible pour une taille
 */
const getAvailableQuantityForSize = (
	fitString: string | undefined,
	size: string,
): number => {
	if (!fitString) return 0;

	const sizes = fitString.split(",");
	const sizeData = sizes.find((s) => s.split(":")[0] === size);

	if (!sizeData) return 0;

	const [, qty] = sizeData.split(":");
	return Number(qty) || 0;
};

export const useAddToCartHandler = ({
	article,
	displayPrice,
	firstImageUrl,
	selectedSize,
	quantity,
	setInfoModal,
	setAlert,
}: AddToCartParams) => {
	const addToCartStore = useCartStore((state) => state.addToCart);
	const addToast = useToastStore((state: any) => state.addToast);

	const handleAddToCart = async (e?: MouseEvent) => {
		e?.preventDefault();
		e?.stopPropagation();

		// Vérification si une taille est nécessaire
		const needsSize =
			(article.type === "clothing" || article.type === "shoes") &&
			article.tech_characteristics?.fit;

		if (needsSize && !selectedSize) {
			const id = Date.now();
			setInfoModal((prev) => [
				...prev,
				{ id, text: "Veuillez sélectionner une taille !" },
			]);
			setAlert(true);
			return;
		}

		// ✅ Vérifier la disponibilité de la taille sélectionnée
		if (needsSize && selectedSize && article.tech_characteristics?.fit) {
			const availableQty = getAvailableQuantityForSize(
				article.tech_characteristics.fit,
				selectedSize,
			);

			console.log("🔍 Debug:", {
				selectedSize,
				fitString: article.tech_characteristics.fit,
				availableQty,
				requestedQty: quantity,
			});

			if (availableQty === 0) {
				const id = Date.now();
				setInfoModal((prev) => [
					...prev,
					{ id, text: `La taille ${selectedSize} n'est plus disponible` },
				]);
				setAlert(true);
				return;
			}

			if (quantity > availableQty) {
				const id = Date.now();
				setInfoModal((prev) => [
					...prev,
					{
						id,
						text: `Seulement ${availableQty} article(s) disponible(s) en taille ${selectedSize}`,
					},
				]);
				setAlert(true);
				return;
			}
		}

		const result = await addToCartStore({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand,
			price: displayPrice,
			image: firstImageUrl,
			type: article.type,
			quantity: quantity, // ✅ Utilise la quantité demandée
			size: selectedSize || undefined,
		});

		console.log("🛒 Résultat addToCart:", result);

		if (result === true) {
			addToast(
				`${quantity} article(s) "${article.name}" ajouté(s) au panier`,
				"bg-green-500",
			);
		} else {
			addToast(result as string, "bg-red-600");
		}
	};

	return handleAddToCart;
};
