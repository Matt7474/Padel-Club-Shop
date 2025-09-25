import { useEffect, useState } from "react";
import { getArticlesType } from "../api/Article";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import type Article from "../types/Article";
import type { Promotion } from "../types/Article";

interface ArticlesProps {
	type?: string;
	showPromos?: boolean;
	searchQuery?: string;
}

export default function Articles({
	type,
	showPromos,
	searchQuery,
}: ArticlesProps) {
	const [articles, setArticles] = useState<Article[]>([]);
	const now = new Date();
	console.log(articles);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				if (type) {
					const res = await getArticlesType(type);
					setArticles(res);
				} else {
					const res = await getArticlesType();
					setArticles(res);
				}
			} catch (err) {
				console.error("Erreur fetching articles:", err);
			}
		};

		fetchArticles();
	}, [type]);

	// Filtrage côté front pour recherche ou promos
	let filteredArticles = articles;

	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		filteredArticles = filteredArticles.filter(
			(article) =>
				article.name.toLowerCase().includes(query) ||
				article.brand?.name?.toLowerCase().includes(query) ||
				article.description?.toLowerCase().includes(query),
		);
	} else if (type?.toLowerCase() === "promotion" || showPromos) {
		filteredArticles = filteredArticles.filter((article) =>
			article.promotions?.some(
				(promo: Promotion) =>
					promo.status === "active" &&
					new Date(promo.start_date) <= now &&
					now <= new Date(promo.end_date),
			),
		);
	}

	// Breadcrumb
	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: showPromos
				? "Promotions"
				: searchQuery
					? `Recherche`
					: type
						? `${type.charAt(0).toUpperCase() + type.slice(1)}(s)`
						: "",
			href: showPromos
				? "/articles/promotions"
				: searchQuery
					? `/articles?search=${searchQuery}`
					: type
						? `/articles/${type}`
						: "/articles",
		},
	];

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="mt-4">
				<h1 className="text-xl font-bold mb-4">
					{filteredArticles.length}{" "}
					{searchQuery
						? `résultat(s) pour "${searchQuery}"`
						: showPromos
							? "Promotions"
							: type
								? `${type}(s) disponibles`
								: "Articles disponibles"}
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredArticles.length > 0 ? (
						filteredArticles.map((article) => (
							<ArticleCard key={article.article_id} article={article} />
						))
					) : (
						<p>Aucun article trouvé.</p>
					)}
				</div>
			</div>
		</>
	);
}
