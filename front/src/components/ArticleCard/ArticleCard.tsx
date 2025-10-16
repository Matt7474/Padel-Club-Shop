import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import type Article from "../../types/Article";
import InfoModal from "../Modal/InfoModal";
import { useToastStore } from "../../store/ToastStore ";

interface ArticleCardProps {
	article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
	const navigate = useNavigate();
	const now = new Date();
	const addToast = useToastStore((state) => state.addToast);

	const [infoModal, setInfoModal] = useState<{ id: number; text: string }[]>(
		[],
	);
	const addToCartStore = useCartStore((state) => state.addToCart);

	// Base URL pour les images
	const BASE_URL = import.meta.env.VITE_API_URL;

	// Construction de l'URL de l'image
	const imageUrl = article.images?.[0]?.url
		? `${BASE_URL}${article.images[0].url}`
		: "/icons/default.svg";

	const handleBrandClick = (e: React.MouseEvent, brand: string) => {
		e.stopPropagation();
		navigate(`/marque/${brand}`);
	};

	const type = article.type;
	const shortDesc = article.description
		? `${article.description.split(" ").slice(0, 7).join(" ")} ... voir plus`
		: "";

	// Recherche de la promo active
	const activePromo = article.promotions?.find((promo) => {
		const start = new Date(promo.start_date);
		const end = new Date(promo.end_date);

		return promo.status === "active" && start <= now && now <= end;
	});

	// Booléen pour savoir si on affiche le badge + prix promo
	const hasPromo = !!activePromo;

	// Calcul prix avec promo si elle existe
	let displayPrice = parseFloat(article.price_ttc.toString());
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

	const addToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addToCartStore({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand,
			price: displayPrice,
			image: firstImageUrl,
			type: article.type,
			quantity: 1,
		});

		const id = Date.now();
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
			<Link
				to={`/articles/${type}/${article.name}`}
				key={article.article_id}
				state={{ article }}
				className="border rounded-lg shadow-lg bg-white cursor-pointer flex flex-col hover:-translate-y-2 transition-transform "
			>
				<div className="flex h-42">
					{/* Colonne image */}
					<div className="w-1/3 border-r flex items-center justify-center p-2">
						<img
							src={imageUrl}
							alt={article.name}
							className="max-h-32 object-contain"
							onError={(e) => {
								e.currentTarget.src = "/icons/default.svg";
							}}
						/>
					</div>

					{/* Colonne texte */}
					<div className="w-2/3 px-2 flex flex-col bg-gray-50 rounded-lg justify-between ">
						<div>
							<div className="flex justify-between">
								<div className="bg-gray-300 inline-block mt-1 -ml-1 rounded-lg">
									<button
										type="button"
										onClick={(e) => handleBrandClick(e, article.brand.name)}
										className="px-2 hover:underline"
									>
										{article.brand?.name}
									</button>
								</div>
								<div>
									{hasPromo && (
										<p className="text-xs bg-red-500 rounded-md text-white font-semibold inline-block mt-1 px-2 py-1 mr-1 animate-bounce">
											PROMO
										</p>
									)}
								</div>
							</div>
							<h2 className="font-semibold leading-none mt-1">
								{article.name}
							</h2>
							<p className="text-sm text-gray-600 mt-1 leading-tight">
								{shortDesc}
							</p>
						</div>

						{/* Bloc prix + panier fixé en bas */}
						<div className="flex items-end justify-between p-1 -ml-2">
							{/* Prix */}
							<div>
								{hasPromo && activePromo && (
									<p className="inline-block bg-gray-300 rounded-md font-semibold px-2 py-1 text-xs">
										{["%", "percent", "percentage"].includes(
											activePromo.discount_type.toLowerCase(),
										)
											? `-${activePromo.discount_value}%`
											: `-${activePromo.discount_value}€`}
									</p>
								)}

								<div>
									{hasPromo && activePromo ? (
										<p className="font-bold text-red-600 text-md">
											{displayPrice.toFixed(2)} €{" "}
											<span className="line-through text-gray-500 text-sm">
												{parseFloat(article.price_ttc.toString()).toFixed(2)} €
											</span>
										</p>
									) : (
										<p className="font-bold text-md">
											{parseFloat(article.price_ttc.toString()).toFixed(2)} €
										</p>
									)}
								</div>
							</div>

							{/* Bouton panier */}
							{article.type !== "clothing" && article.type !== "shoes" && (
								<button
									type="button"
									className="flex items-center justify-center bg-amber-300 text-black rounded-md px-2 py-1 transition-colors hover:bg-amber-400 cursor-pointer"
									onClick={addToCart}
								>
									<span className="text-md font-bold mr-1">+</span>
									<img src="/icons/cart.svg" alt="panier" className="w-5 h-5" />
								</button>
							)}
						</div>
					</div>
				</div>
			</Link>

			{/* InfoModal - déplacé en dehors du Link pour éviter les problèmes */}
			<div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
				{infoModal.map((modal) => (
					<InfoModal
						key={modal.id}
						id={modal.id}
						bg="bg-green-500"
						text={modal.text}
						onClose={removeInfoModal}
					/>
				))}
			</div>
		</>
	);
}
