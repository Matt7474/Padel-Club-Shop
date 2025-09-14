import { useState } from "react";
import { useCartStore } from "../../../store/cartStore";
import type Article from "../../../types/Article";

export default function PriceArticle({ article }: { article: Article }) {
	const addToCart = useCartStore((state) => state.addToCart);
	const [quantity, setQuantity] = useState(1);
	const increment = () => setQuantity((prev) => prev + 1);
	const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	let displayPrice: number = article.price_ttc;

	if (article.promotions && article.promotions.length > 0) {
		const promo = article.promotions[0];
		if (promo.discount_type === "percentage") {
			displayPrice = (article.price_ttc * (100 - promo.discount_value)) / 100;
		} else if (promo.discount_type === "amount") {
			displayPrice = article.price_ttc - promo.discount_value;
		}
	}
	displayPrice = Math.max(displayPrice, 0);

	const addOnCart = () => {
		addToCart({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand || "Inconnue",
			price: displayPrice,
			image: article.images[0] || "/icons/default.svg",
			quantity: quantity,
		});
	};

	return (
		<>
			<div>
				<div className="flex mt-6 xl:flex-col">
					<div className="flex flex-col w-1/2 justify-end">
						{/* Partie promo */}
						<div>
							{article.promotions && article.promotions.length > 0 && (
								<div className="flex mb-2">
									<p className="text-xs bg-gray-300 rounded-md font-semibold px-2 py-1">
										{article.promotions[0].discount_type === "percentage"
											? `-${article.promotions[0].discount_value}%`
											: `-${article.promotions[0].discount_value}€`}
									</p>
									<p className="text-xs bg-red-500 rounded-md text-white font-semibold px-2 py-1 ml-2 animate-bounce">
										PROMO
									</p>
								</div>
							)}
						</div>

						{/* Partie prix */}
						<div>
							{article.promotions && article.promotions.length > 0 ? (
								<p className="font-bold text-red-600 text-lg">
									{displayPrice.toFixed(2)} €{" "}
									<span className="line-through text-black text-sm">
										{article.price_ttc.toFixed(2)} €
									</span>
								</p>
							) : (
								<p className="font-bold text-lg">
									{article.price_ttc.toFixed(2)} €
								</p>
							)}
						</div>
					</div>

					{/* Partie quantité */}
					<div className="w-1/2 flex flex-col items-end xl:items-start xl:mt-3 -mt-1">
						<p className="font-semibold">Quantité</p>
						<div className="inline-flex items-center border rounded-lg overflow-hidden">
							<button
								type="button"
								onClick={decrement}
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
								aria-label="Diminuer la quantité"
							>
								-
							</button>
							<span className="w-10 text-center py-1 text-md font-semibold select-none">
								{quantity}
							</span>
							<button
								type="button"
								onClick={increment}
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
								aria-label="Augmenter la quantité"
							>
								+
							</button>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="bg-amber-300 rounded-lg mt-3 py-2 w-full font-semibold cursor-pointer hover:brightness-80"
					onClick={addOnCart}
				>
					Ajouter au panier
				</button>
			</div>
		</>
	);
}
