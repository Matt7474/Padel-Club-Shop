import { Link, useNavigate } from "react-router-dom";
import type Article from "../../types/Article";

interface ArticleCardProps {
	article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
	const navigate = useNavigate();

	const handleBrandClick = (e: React.MouseEvent, brand: string) => {
		e.stopPropagation();
		navigate(`/marque/${brand}`);
	};

	const type = article.tech_characteristics.type;
	const shortDesc = article.description
		? `${article.description.split(" ").slice(0, 7).join(" ")} ... voir plus`
		: "";

	// Calcul prix avec promo si elle existe
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

	return (
		<Link
			to={`/articles/${type}/${article.name}`}
			key={article.article_id}
			className="border rounded-lg shadow-lg bg-white cursor-pointer flex flex-col h-40 hover:-translate-y-2"
		>
			<div className="flex h-full">
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
				<div className="w-2/3 pl-2 flex flex-col justify-between bg-gray-50 rounded-lg">
					<div>
						<div className="bg-gray-300 inline-block mt-1 -ml-1 rounded-lg">
							<button
								type="button"
								onClick={(e) => handleBrandClick(e, article.brand)}
								className="px-2 hover:underline"
							>
								{article.brand}
							</button>
						</div>
						<h2 className="font-semibold leading-none mt-1">{article.name}</h2>
						<p className="text-sm text-gray-600 mt-1">{shortDesc}</p>
					</div>

					<div>
						{article.promotions && article.promotions.length > 0 && (
							<div className="bg-gray-300 inline-block rounded-sm px-1 mt-2 text-sm">
								- {article.promotions[0].discount_value}{" "}
								{article.promotions[0].discount_type === "percentage"
									? "%"
									: "€"}
							</div>
						)}

						{/* Prix */}
						<div>
							{article.promotions && article.promotions.length > 0 ? (
								<p className="font-bold text-red-600 text-sm">
									{displayPrice.toFixed(2)} €{" "}
									<span className="line-through text-black text-sm">
										{article.price_ttc.toFixed(2)} €
									</span>
								</p>
							) : (
								<p className="font-bold text-sm">
									{article.price_ttc.toFixed(2)} €
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
