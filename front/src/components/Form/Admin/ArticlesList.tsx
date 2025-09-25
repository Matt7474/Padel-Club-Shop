import { useEffect, useState } from "react";
import { getArticles } from "../../../api/Article";
import type Article from "../../../types/Article";
import type { Brand } from "../../../types/Article";
import { useSortableData } from "../Tools/useSortableData";
import ArticleDetails from "./ArticleDetails";

type ArticleWithBrandName = Article & { brandName: Brand };

export default function ArticlesList() {
	const [articles, setArticles] = useState<ArticleWithBrandName[]>([]);
	const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

	// Récupération des articles depuis l’API
	useEffect(() => {
		getArticles()
			.then((data) => {
				const articlesWithBrandName = data.map((a) => ({
					...a,
					brandName: a.brand || "Sans marque",
				}));
				setArticles(articlesWithBrandName);
			})
			.catch((err) => console.error("Erreur API Articles:", err));
	}, []);

	const handleArticleClick = (article: Article) => {
		setSelectedArticle(article);
	};

	const {
		items: sortedArticles,
		requestSort,
		sortConfig,
	} = useSortableData(articles);

	const getClassNamesFor = (name: keyof Article) => {
		if (!sortConfig) return;
		return sortConfig.key === name
			? sortConfig.direction === "asc"
				? "▲"
				: "▼"
			: undefined;
	};

	if (selectedArticle) {
		return <ArticleDetails article={selectedArticle} />;
	}

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Articles
			</h2>
			<div className="grid grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] bg-gray-300 mt-4 mb-2">
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("images")}
				>
					IMAGE {getClassNamesFor("images")}
				</button>
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("name")}
				>
					NOM {getClassNamesFor("name")}
				</button>
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("brandName")}
				>
					MARQUE {getClassNamesFor("brand")}
				</button>
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("reference")}
				>
					REF {getClassNamesFor("reference")}
				</button>
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("type")}
				>
					TYPE {getClassNamesFor("type")}
				</button>
				<button
					type="button"
					className="text-xs border-b pl-1 cursor-pointer"
					onClick={() => requestSort("status")}
				>
					DIS {getClassNamesFor("status")}
				</button>
			</div>

			{sortedArticles.map((article) => (
				<div key={article.article_id}>
					<button
						type="button"
						onClick={() => handleArticleClick(article)}
						className="cursor-pointer w-full text-left hover:bg-gray-300"
					>
						<div className="grid grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr_1fr] xl:text-center">
							<img
								src={article.images?.[0].url || "/icons/default.svg"}
								alt={article.name || "Image par défaut"}
								className=" px-1 py-1 w-12 mx-auto"
							/>
							<p className="border-x px-1 py-1 text-xs">{article.name}</p>
							<p className="border-r px-1 py-1 text-xs truncate">
								{article.brand?.name}
							</p>
							<p className="border-r px-1 py-1 text-xs truncate">
								{article.reference}
							</p>
							<p className="border-r px-1 py-1 text-xs truncate">
								{article.type}
							</p>
							<div
								className={`w-4 h-4 rounded-full mx-auto my-1
                  ${article.status === "available" ? "bg-green-500" : ""}
                  ${article.status === "preorder" ? "bg-blue-500" : ""}
                  ${article.status === "out_of_stock" ? "bg-red-500" : ""}`}
							/>
						</div>
						<div className="w-full border-b border-gray-200"></div>
					</button>
				</div>
			))}
		</div>
	);
}
