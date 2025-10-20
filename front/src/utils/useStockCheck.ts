import { getArticleById } from "../api/Article";
import { useToastStore } from "../store/ToastStore ";
import type Article from "../types/Article";

interface StockCheckParams {
	articleId: number;
	quantity: number;
	selectedSize?: string;
}

interface SizeStock {
	label: string;
	stock: number;
}

export function useStockCheck() {
	const { addToast } = useToastStore();

	const checkStock = async ({
		articleId,
		quantity,
		selectedSize,
	}: StockCheckParams): Promise<boolean> => {
		try {
			const article = (await getArticleById(articleId)) as Article;
			console.log(
				"article.stock_quantity",
				article.stock_quantity,
				typeof article.stock_quantity,
			);

			// --- 1️⃣ Cas : article AVEC tailles ---
			if (article.tech_characteristics?.fit && selectedSize) {
				const sizes: SizeStock[] = article.tech_characteristics.fit
					.split(",")
					.map((pair: string) => {
						const [label, stock] = pair.split(":");
						return { label: label.trim(), stock: Number(stock) };
					});

				const sizeData: SizeStock | undefined = sizes.find(
					(s: SizeStock) => s.label === selectedSize,
				);

				if (!sizeData) {
					addToast(`Taille "${selectedSize}" introuvable.`);
					return false;
				}

				if (quantity > sizeData.stock) {
					addToast(
						`Stock insuffisant pour la taille ${selectedSize}.`,
						"bg-red-500",
					);
					return false;
				}

				return true;
			}

			// --- 2️⃣ Cas : article SANS tailles ---
			let realStock = 0;

			if (typeof article.stock_quantity === "number") {
				realStock = article.stock_quantity;
			} else if (
				typeof article.stock_quantity === "object" &&
				article.stock_quantity !== null
			) {
				// on prend la première valeur du stock objet (ex: { unique: 3 })
				const values = Object.values(article.stock_quantity);
				realStock = values[0] ?? 0;
			}

			if (quantity > realStock) {
				addToast("Stock insuffisant pour cet article.", "bg-red-500");
				return false;
			}

			// ✅ Important : on retourne true si tout va bien
			return true;
		} catch (err: unknown) {
			if (err instanceof Error) {
				addToast(`Erreur de vérification du stock : ${err.message}`);
			} else {
				addToast("Erreur inconnue lors de la vérification du stock.");
			}
			return false;
		}
	};

	return { checkStock };
}
