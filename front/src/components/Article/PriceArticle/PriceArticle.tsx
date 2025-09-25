import { useState } from "react";
import { useCartStore } from "../../../store/cartStore";
import type Article from "../../../types/Article";
import InfoModal from "../../Modal/InfoModal";

export default function PriceArticle({ article }: { article: Article }) {
	const addToCart = useCartStore((state) => state.addToCart);
	const [quantity, setQuantity] = useState(1);
	const increment = () => setQuantity((prev) => prev + 1);
	const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	const [infoModal, setInfoModal] = useState<{ id: number; text: string }[]>(
		[],
	);

	let displayPrice: number = article.price_ttc;

	// Chercher la promo active
	const now = new Date();
	let activePromo = null;
	if (article.promotions && article.promotions.length > 0) {
		activePromo = article.promotions.find((promo) => {
			const start = new Date(promo.start_date);
			const end = new Date(promo.end_date);
			return promo.status === "active" && start <= now && now <= end;
		});
	}

	if (activePromo) {
		const discountValue = parseFloat(activePromo.discount_value.toString());

		switch (activePromo.discount_type.toLowerCase()) {
			case "%":
			case "percent":
			case "percentage":
				displayPrice = (displayPrice * (100 - discountValue)) / 100;
				break;
			case "€":
			case "amount":
			case "euro":
				displayPrice = displayPrice - discountValue;
				break;
		}
	}
	displayPrice = Math.max(displayPrice, 0);

	const firstImageUrl = article.images?.[0]?.url
		? `${import.meta.env.VITE_API_URL}${article.images[0].url}`
		: "/icons/default.svg";

	const addOnCart = () => {
		addToCart({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand,
			price: displayPrice,
			image: firstImageUrl,
			type: article.type,
			quantity: quantity,
		});

		const id = Date.now();
		setInfoModal((prev) => [
			...prev,
			{ id, text: "Produit ajouté au panier !" },
		]);
	};

	const removeInfoModal = (id: number) => {
		setInfoModal((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<>
			<div>
				<div className="flex mt-6 xl:flex-col">
					<div className="flex flex-col w-1/2 justify-end">
						{/* Partie promo */}
						<div>
							{activePromo && (
								<div className="flex mb-2">
									<p className="text-xs bg-gray-300 rounded-md font-semibold px-2 py-1">
										{activePromo.discount_type === "percent" ||
										activePromo.discount_type === "%"
											? `-${activePromo.discount_value}%`
											: `-${activePromo.discount_value}€`}
									</p>

									<p className="text-xs bg-red-500 rounded-md text-white font-semibold px-2 py-1 ml-2 animate-bounce">
										PROMO
									</p>
								</div>
							)}
						</div>

						{/* Partie prix */}
						<div>
							{activePromo ? (
								<p className="font-bold text-red-600 text-lg">
									{displayPrice.toFixed(2)} €{" "}
									<span className="line-through text-black text-sm">
										{article.price_ttc} €
									</span>
								</p>
							) : (
								<p className="font-bold text-lg">{article.price_ttc} €</p>
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

			{/* infoModal */}
			<div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
				{infoModal.map((infoModal) => (
					<InfoModal
						key={infoModal.id}
						id={infoModal.id}
						bg="bg-green-500"
						text={infoModal.text}
						onClose={removeInfoModal}
					/>
				))}
			</div>
		</>
	);
}
