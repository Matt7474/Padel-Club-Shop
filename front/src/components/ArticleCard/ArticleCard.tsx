import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import type Article from "../../types/Article";
import { useState } from "react";
import InfoModal from "../Modal/InfoModal";
import Toast from "../Modal/InfoModal";

interface ArticleCardProps {
	article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
	const navigate = useNavigate();
	const now = new Date();
	const [infoModal, setInfoModal] = useState<{ id: number; text: string }[]>(
		[],
	);
	const addToCartStore = useCartStore((state) => state.addToCart);

	const handleBrandClick = (e: React.MouseEvent, brand: string) => {
		e.stopPropagation();
		navigate(`/marque/${brand}`);
	};

	const type = article.tech_characteristics.type;
	const shortDesc = article.description
		? `${article.description.split(" ").slice(0, 7).join(" ")} ... voir plus`
		: "";

	// On récupère la première promo active, si elle existe
	const activePromo = article.promotions?.find((promo) => {
		const start = new Date(promo.start_date);
		const end = new Date(promo.end_date);
		return promo.status === "active" && start <= now && now <= end;
	});

	// booléen pour savoir si on affiche le badge + prix promo
	const hasPromo = !!activePromo;

	// Calcul prix avec promo si elle existe
	let displayPrice = article.price_ttc;
	if (activePromo) {
		if (activePromo.discount_type === "percentage") {
			displayPrice =
				(article.price_ttc * (100 - activePromo.discount_value)) / 100;
		} else if (activePromo.discount_type === "amount") {
			displayPrice = article.price_ttc - activePromo.discount_value;
		}
	}
	displayPrice = Math.max(displayPrice, 0);

	const addToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addToCartStore({
			id: article.article_id.toString(),
			name: article.name,
			brand: article.brand,
			price: displayPrice,
			image: article.images?.[0],
			quantity: 1,
		});
		const id = Date.now();
		setInfoModal((prev) => [
			...prev,
			{ id, text: "Produit ajouté au panier !" },
		]);
	};

	const removeToast = (id: number) => {
		setInfoModal((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<Link
			to={`/articles/${type}/${article.name}`}
			key={article.article_id}
			className="border rounded-lg shadow-lg bg-white cursor-pointer flex flex-col hover:-translate-y-2 transition-transform"
		>
			<div className="flex h-42">
				{/* Colonne image */}
				<div className="w-1/3 border-r flex items-center justify-center p-2">
					<img
						src={`/images/${article.images}`}
						alt={article.name}
						className="max-h-32 object-contain"
						onError={(e) => {
							e.currentTarget.src = "/icons/default.svg";
						}}
					/>
				</div>

				{/* Colonne texte */}
				<div className="w-2/3 pl-2 flex flex-col bg-gray-50 rounded-lg justify-between">
					<div>
						<div className="flex justify-between">
							<div className="bg-gray-300 inline-block mt-1 -ml-1 rounded-lg">
								<button
									type="button"
									onClick={(e) => handleBrandClick(e, article.brand)}
									className="px-2 hover:underline"
								>
									{article.brand}
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
						<h2 className="font-semibold leading-none mt-1">{article.name}</h2>
						<p className="text-sm text-gray-600 mt-1 leading-tight">
							{shortDesc}
						</p>
					</div>

					{/* Bloc prix + panier fixé en bas */}
					<div className="flex items-end justify-between p-1 -ml-2 ">
						{/* Prix */}
						<div>
							{hasPromo && activePromo && (
								<p className="inline-block bg-gray-300 rounded-md font-semibold px-2 py-1 text-xs">
									{activePromo.discount_type === "percentage"
										? `-${activePromo.discount_value}%`
										: `-${activePromo.discount_value}€`}
								</p>
							)}

							<div>
								{hasPromo && activePromo ? (
									<p className="font-bold text-red-600 text-md">
										{displayPrice.toFixed(2)} €{" "}
										<span className="line-through text-gray-500 text-sm">
											{article.price_ttc.toFixed(2)} €
										</span>
									</p>
								) : (
									<p className="font-bold text-md">
										{article.price_ttc.toFixed(2)} €
									</p>
								)}
							</div>
						</div>

						{/* Bouton panier */}
						<button
							type="button"
							className="flex items-center justify-center bg-amber-300 text-black rounded-md px-2 py-1 transition-colors"
							onClick={addToCart}
						>
							<span className="text-md font-bold mr-1">+</span>
							<img src="/icons/cart.svg" alt="panier" className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* infoModal */}
				<div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
					{infoModal.map((infoModal) => (
						<Toast
							key={infoModal.id}
							id={infoModal.id}
							bg="bg-green-500"
							text={infoModal.text}
							onClose={removeToast}
						/>
					))}
				</div>
			</div>
		</Link>
	);
}
