import { useState } from "react";
import data from "../../../../data/dataTest.json";
import type Article from "../../../types/Article";
import ArticleDetails from "./ArticleDetails";

export default function ArticlesList() {
	const articlesData = data.articles;
	const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

	const handleArticleClick = (article: Article) => {
		setSelectedArticle(article);
	};

	if (selectedArticle) {
		return <ArticleDetails article={selectedArticle} />;
	}

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Liste des Articles
				</h2>
				<div className="grid grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr_1fr_1fr_1fr] bg-gray-300 mt-4 mb-2">
					<p className="text-xs border-b pl-1">IMAGE</p>
					<p className="text-xs border-b pl-1">NOM</p>
					<p className="text-xs border-b pl-1">MARQUE</p>
					<p className="text-xs border-b pl-1">REF</p>
					<p className="text-xs border-b pl-1 overflow-hidden ">TYPE</p>
					<div>
						<p className="text-xs border-b pl-1 overflow-hidden xl:hidden">
							DIS
						</p>
						<p className="text-xs border-b pl-1 overflow-hidden hidden xl:block">
							DISPO
						</p>
					</div>
					<p className="text-xs border-b pl-1 overflow-hidden hidden xl:block">
						PRIX.HT
					</p>
					<p className="text-xs border-b pl-1 overflow-hidden hidden xl:block">
						PRIX.TTC
					</p>
					<p className="text-xs  pl-1 overflow-hidden hidden xl:block">PROMO</p>
				</div>
				{articlesData.map((article) => (
					<div key={article.article_id}>
						<button
							type="button"
							onClick={() => handleArticleClick(article)}
							className="cursor-pointer w-full text-left hover:bg-gray-300"
						>
							<div className="grid grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr_1fr_1fr_1fr]">
								<img
									src={article.images?.[0] || "/icons/default.svg"}
									alt={article.name || "Image par défaut"}
									className="border-r px-1 py-1 w-12"
								/>

								<p className="border-r  px-1 py-1 text-xs">{article.name}</p>
								<p className="border-r  px-1 py-1 text-xs truncate">
									{article.brand.name}
								</p>
								<p className="border-r  px-1 py-1 text-xs truncate">
									{article.reference}
								</p>
								<p className="border-r  px-1 py-1 text-xs truncate">
									{article.type}
								</p>
								<div
									className={`w-4 h-4 rounded-full mx-auto my-1
										${article.status === "available" ? "bg-green-500" : ""}
										${article.status === "preorder" ? "bg-blue-500" : ""}
										${article.status === "out_of_stock" ? "bg-red-500" : ""}`}
								/>
								<p className="border-r border-l px-1 py-1 text-xs truncate hidden xl:block">
									{article.type}
								</p>
								<p className="border-r  px-1 py-1 text-xs truncate hidden xl:block">
									{article.type}
								</p>
								<p className="px-1 py-1 text-xs truncate hidden xl:block">
									{article.type}
								</p>
							</div>
							<div className="w-full border-b border-gray-200"></div>
						</button>
					</div>
				))}
			</div>
		</>
	);
}
