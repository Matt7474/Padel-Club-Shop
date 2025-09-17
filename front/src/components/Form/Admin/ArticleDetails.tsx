import { useState } from "react";
import type Article from "../../../types/Article";
import type { Promotion } from "../../../types/Article";
import ArticlesList from "./ArticlesList";
import CreateArticle from "./CreateArticle";

interface ArticleDetailsProps {
	article: Article;
}

export default function ArticleDetails({ article }: ArticleDetailsProps) {
	const [clickReturn, setClickReturn] = useState<Article | null>(null);
	const [changeArticle, setChangeArticle] = useState(false);

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("fr-FR"); // format JJ/MM/AAAA
	};

	const handleClick = (article: Article) => {
		setClickReturn(article);
	};

	if (clickReturn) {
		return <ArticlesList />;
	}

	const handleChange = () => {
		console.log("handleChange");
		setChangeArticle(true);
	};

	return (
		<div>
			<button
				type="button"
				onClick={() => handleClick(article)}
				className="flex mt-4"
			>
				<img
					src="/icons/arrow.svg"
					alt="fleche retour"
					className="w-4 rotate-180"
				/>
				Retour
			</button>

			{changeArticle === false && (
				<div>
					<div className="mt-4 pl-1">
						<div className="flex justify-between">
							<h2>Détails de l'article : {article.name}</h2>
							<div
								className={`w-4 h-4 rounded-full mx-auto my-1
							${article.status === "available" ? "bg-green-500" : ""}
							${article.status === "preorder" ? "bg-blue-500" : ""}
							${article.status === "out_of_stock" ? "bg-red-500" : ""}`}
							/>
						</div>
						<div className="flex">
							<div className="my-auto">
								<img
									src={article.images?.[0] || "/icons/default.svg"}
									alt={article.name || "Image par défaut"}
									className="w-30"
								/>
							</div>

							<div className="mt-4 border-l pl-2">
								<p>Marque : {article.brand}</p>
								<p>Référence : {article.reference}</p>
								<p>Type : {article.type}</p>
								<p>Prix TTC : {article.price_ttc} €</p>
								<p className="border-b pb-2 mb-2">
									Frais de port : {article.shipping_cost} €
								</p>

								<p className="flex items-center gap-2">
									Promo :
									{article.promotions && article.promotions.length > 0
										? article.promotions.map((promo: Promotion) => (
												<span
													key={promo.promotion_id}
													className="flex flex-col items-center gap-2 mr-2"
												>
													<span className="flex flex-col">
														<span
															className={`w-4 h-4 rounded-full
														${promo.status === "active" ? "bg-green-500" : ""}
														${promo.status === "upcoming" ? "bg-blue-500" : ""}
														${promo.status === "expired" ? "bg-red-500" : ""}`}
														/>
													</span>
												</span>
											))
										: " Aucune"}
								</p>
								{article.promotions?.map((promo: Promotion) => (
									<div className="text-sm" key={promo.promotion_id}>
										{promo.status === "active" &&
											`Active du ${formatDate(promo.start_date)} au ${formatDate(promo.end_date)}`}
										{promo.status === "upcoming" &&
											`En attente du ${formatDate(promo.start_date)} au ${formatDate(promo.end_date)}`}
										{promo.status === "expired" &&
											`Expirée du ${formatDate(promo.start_date)} au ${formatDate(promo.end_date)}`}
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="flex justify-center mt-6">
						<button
							onClick={handleChange}
							type="button"
							className="bg-green-500 w-full h-10 rounded-lg cursor-pointer"
						>
							Modifier l'article
						</button>
					</div>
				</div>
			)}
			{changeArticle && (
				<div>
					<CreateArticle
						title={"Modifier l'article"}
						button={"MODIFIER L'ARTICLE"}
						article={article}
					/>
				</div>
			)}
		</div>
	);
}
