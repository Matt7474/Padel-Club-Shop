import { useState } from "react";
import { useCartStore } from "../../../store/cartStore";
import type Article from "../../../types/Article";

export default function PriceArticle({ article }: { article: Article }) {
	const addToCart = useCartStore((state) => state.addToCart);
	const [quantity, setQuantity] = useState(1);
	const increment = () => setQuantity((prev) => prev + 1);
	const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	let displayPrice: number = article.prix_ttc;
	if (article.promos && article.promos.length > 0) {
		const promo = article.promos[0];
		if (promo.type_remise === "pourcentage") {
			displayPrice = (article.prix_ttc * (100 - promo.valeur_remise)) / 100;
		} else if (promo.type_remise === "montant") {
			displayPrice = article.prix_ttc - promo.valeur_remise;
		}
	}
	displayPrice = Math.max(displayPrice, 0);

	const addOnCart = () => {
		addToCart({
			id: article.code_article.toString(),
			name: article.nom,
			brand: article.marque || "Inconnue",
			price: displayPrice,
			image: article.image[0] || "/icons/default.svg",
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
							{article.promos.length > 0 && (
								<div className="flex mb-2">
									<p className="text-xs bg-gray-300 rounded-md font-semibold px-2 py-1">
										{article.promos[0].type_remise === "pourcentage"
											? `-${article.promos[0].valeur_remise}%`
											: `-${article.promos[0].valeur_remise}€`}
									</p>
									<p className="text-xs bg-red-500 rounded-md text-white font-semibold px-2 py-1 ml-2">
										PROMO
									</p>
								</div>
							)}
						</div>

						{/* Partie prix */}
						<div>
							{article.promos && article.promos.length > 0 ? (
								<p className="font-bold text-red-600 text-lg">
									{displayPrice.toFixed(2)} €{" "}
									<span className="line-through text-black text-xs">
										{article.prix_ttc.toFixed(2)} €
									</span>
								</p>
							) : (
								<p className="font-bold text-lg">
									{article.prix_ttc.toFixed(2)} €
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
