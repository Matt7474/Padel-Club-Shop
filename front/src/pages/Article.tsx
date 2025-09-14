import { useState } from "react";
import { useParams } from "react-router-dom";
import articlesData from "../../data/dataTest.json";
import CaracteristicsArticle from "../components/Article/CaracteristicsArticle/CaracteristicsArticle";
import ImagesArticle from "../components/Article/ImagesArticle/ImagesArticle";
import PriceArticle from "../components/Article/PriceArticle/PriceArticle";
import RatingArticle from "../components/Article/RatingArticle/RatingArticle";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import type ArticleType from "../types/Article";

const typedArticlesData: { articles: ArticleType[] } = articlesData;

export default function Article() {
	const { type, name } = useParams();

	const article = typedArticlesData.articles.find(
		(art) => art.tech_characteristics.type === type && art.name === name,
	);

	if (!type || !name) {
		return <div>Chargement...</div>;
	}

	if (!article) {
		return <div>Cet article n'à pas été trouvé</div>;
	}

	const [isDescriptionOn, setIsDescriptionOn] = useState(true);
	const [isCaracteristiquesOn, setIsCaracteristiquesOn] = useState(false);

	const breadcrumbItems = [
		{ label: "Accueil", href: "/homepage" },
		{
			label: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
			href: `/articles/${type}`,
		},
		{
			label: name,
			href: `/articles/${type}/${name}`,
		},
	];

	return (
		<>
			<div>
				<Breadcrumb items={breadcrumbItems} />
			</div>

			{/* LAYOUT MOBILE */}
			<div className="xl:hidden mt-6">
				<ImagesArticle article={article} />
				<PriceArticle article={article} />
				<p className="font-semibold text-lg mt-6">{article.name}</p>
				<p className="text-sm">{article.reference}</p>
				<RatingArticle article={article} />
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
							}
								`}
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
						<div>
							<p className="mt-3">{article.description}</p>
						</div>
					) : isCaracteristiquesOn ? (
						<CaracteristicsArticle article={article} />
					) : null}
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:flex-col xl:gap-8 xl:justify-between mt-6">
				<div className="hidden xl:flex  xl:gap-8 xl:justify-between ">
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
