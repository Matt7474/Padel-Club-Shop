import { useState } from "react";
import { useCartStore } from "../../../store/cartStore";
import { useToastStore } from "../../../store/ToastStore ";
import type Article from "../../../types/Article";
import { useStockCheck } from "../../../utils/useStockCheck";
import InfoModal from "../../Modal/InfoModal";

interface PriceArticleProps {
	article: Article;
	selectedSize?: string | null;
	qty?: number;
	isSelected?: boolean;
	stockMessage?: string;
}
export default function PriceArticle({
	article,
	selectedSize,
	qty,
}: PriceArticleProps) {
	const addToast = useToastStore((state) => state.addToast);
	const addToCart = useCartStore((state) => state.addToCart);
	const [quantity, setQuantity] = useState(1);
	const increment = () => setQuantity((prev) => prev + 1);
	const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	const [infoModal, setInfoModal] = useState<{ id: number; text: string }[]>(
		[],
	);
	const [alert, setAlert] = useState<boolean>();
	const cart = useCartStore((state) => state.cart);
	const { checkStock } = useStockCheck();

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

	const addOnCart = async () => {
		const cartItem = cart.find(
			(c) =>
				c.id === article.article_id.toString() &&
				(c.size ?? null) === (selectedSize ?? null),
		);

		const quantityInCart = cartItem?.quantity ?? 0;

		const needsSize =
			(article.type === "clothing" || article.type === "shoes") &&
			article.tech_characteristics?.fit &&
			article.tech_characteristics?.fit.length > 1;

		if (needsSize && !selectedSize) {
			addToast("Veuillez sélectionner une taille !", "bg-red-500");
			setAlert(true);
			return;
		}

		if (!selectedSize && article.type === "clothing") {
			addToast("Veuillez sélectionner une taille !", "bg-red-500");
			setAlert(true);
			return;
		}

		const isInStock = await checkStock({
			articleId: article.article_id,
			quantity: quantityInCart + quantity,
			selectedSize: selectedSize ?? undefined,
		});

		if (!isInStock) return;
		addToCart({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand,
			price: displayPrice,
			image: firstImageUrl,
			type: article.type,
			quantity: quantity,
			size: selectedSize ?? undefined,
			shipping_cost: article.shipping_cost ?? 0, // <- valeur par défaut
		});

		addToast(
			`L'article ${article.name} à été ajouté au panier`,
			"bg-green-500",
		);
	};

	const removeInfoModal = (id: number) => {
		setInfoModal((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<>
			<div>
				<div className="flex mt-6 xl:flex-col xl:mt-0">
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
						{/* <div className="font-semibold italic text-gray-600">
							Frais d'envoi : {article.shipping_cost} €
						</div> */}
					</div>

					{/* Partie quantité */}
					<div className="w-1/2 flex flex-col items-end xl:items-start xl:mt-1 -mt-1 ">
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
				<div className="relative mt-2">
					<button
						type="button"
						className="bg-amber-500 hover:bg-amber-600 rounded-lg py-2 w-full font-semibold cursor-pointer hover:brightness-80"
						onClick={addOnCart}
					>
						Ajouter au panier
					</button>

					{alert && selectedSize === null && (
						<span className="text-red-500 absolute left-1/2 transform -translate-x-1/2 mt-2">
							Veuillez sélectionner une taille !
						</span>
					)}

					{typeof qty === "number" && qty < 6 && (
						<div className="flex justify-center">
							<span className="text-red-500 text-sm font-semibold text-center mt-0.5 mr-1">
								⚠️
							</span>
							<p className="text-red-500 text-sm font-semibold text-center mt-1 ">
								Il ne reste que {qty} article(s) de la taille {selectedSize}
							</p>
							<span className="text-red-500 text-sm font-semibold text-center mt-0.5 ml-1">
								⚠️
							</span>
						</div>
					)}
				</div>
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
