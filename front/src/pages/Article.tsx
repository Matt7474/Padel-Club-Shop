import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getArticleByName } from "../api/Article";
import CaracteristicsArticle from "../components/Article/CaracteristicsArticle/CaracteristicsArticle";
import ImagesArticle from "../components/Article/ImagesArticle/ImagesArticle";
import PriceArticle from "../components/Article/PriceArticle/PriceArticle";
import RatingArticle from "../components/Article/RatingArticle/RatingArticle";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import type ArticleType from "../types/Article";

export default function Article() {
	const [isDescriptionOn, setIsDescriptionOn] = useState(true);
	const [isCaracteristiquesOn, setIsCaracteristiquesOn] = useState(false);

	const { name } = useParams<{ name: string }>();
	const location = useLocation();
	const stateArticle = (location.state as { article?: ArticleType })?.article;

	const [article, setArticle] = useState<ArticleType | null>(
		stateArticle || null,
	);
	const [loading, setLoading] = useState(!stateArticle);

	useEffect(() => {
		if (stateArticle) return;
		if (!name) return;

		setLoading(true);
		getArticleByName(name)
			.then((data) => {
				setArticle(data);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [name, stateArticle]);

	if (!name || loading) return <div>Chargement...</div>;
	if (!article) return <div>Cet article n'a pas été trouvé</div>;

	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: article.type.charAt(0).toUpperCase() + article.type.slice(1),
			href: `/articles/${article.type}`,
		},
		{ label: article.name, href: `/articles/${name}` },
	];

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />

			{/* LAYOUT MOBILE */}
			<div className="xl:hidden mt-6">
				<ImagesArticle article={article} />
				<PriceArticle article={article} />
				<p className="font-semibold text-lg mt-6">{article.name}</p>
				<p className="text-sm">{article.reference}</p>
				{article.ratings && Object.keys(article.ratings).length > 0 && (
					<RatingArticle article={article} />
				)}

				<div className="mt-10">
					<div className="flex justify-around font-semibold text-lg">
						<button
							type="button"
							onClick={() => {
								setIsDescriptionOn(true);
								setIsCaracteristiquesOn(false);
							}}
							className={`cursor-pointer ${
								isDescriptionOn ? "text-black" : "text-gray-400"
							}`}
						>
							Description
						</button>
						<button
							type="button"
							onClick={() => {
								setIsDescriptionOn(false);
								setIsCaracteristiquesOn(true);
							}}
							className={`cursor-pointer ${
								isCaracteristiquesOn ? "text-black" : "text-gray-400"
							}`}
						>
							Caractéristiques
						</button>
					</div>

					{isDescriptionOn ? (
						<p className="mt-3">{article.description}</p>
					) : (
						isCaracteristiquesOn && <CaracteristicsArticle article={article} />
					)}
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:flex-col xl:gap-8 xl:justify-between mt-6">
				<div className="hidden xl:flex xl:gap-8 xl:justify-between">
					<ImagesArticle article={article} />
					<div className="xl:w-1/2 xl:flex xl:flex-col">
						<div className="xl:flex xl:flex-col xl:h-full xl:justify-between">
							<div>
								<h1 className="font-bold text-2xl mb-2">{article.name}</h1>
								<p className="text-gray-600 text-sm mb-4">
									{article.reference}
								</p>
								<p className="text-base leading-relaxed mb-6">
									{article.description}
								</p>
							</div>
							<PriceArticle article={article} />
						</div>
					</div>
				</div>

				<div className="hidden xl:flex justify-center gap-6 xl:mt-6">
					<RatingArticle article={article} />
					<div className="w-1/2">
						<h3 className="font-semibold text-lg mb-4 xl:text-center xl:mt-10">
							Caractéristiques
						</h3>
						<CaracteristicsArticle article={article} />
					</div>
				</div>
			</div>
		</>
	);
}
