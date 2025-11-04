import { useEffect, useState } from "react";
import { getArticles, getArticlesType } from "../api/Article";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Pagination from "../components/Form/Tools/Pagination";
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
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	const now = new Date();

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				let res: Article[];

				if (type?.toLowerCase() === "promotion" || showPromos) {
					res = await getArticles();
				} else if (type?.toLowerCase() === "articles") {
					res = await getArticles();
				} else if (type) {
					res = await getArticlesType(type);
				} else {
					res = await getArticles();
				}

				setArticles(res);
				setCurrentPage(1);
			} catch (err) {
				console.error("Erreur fetching articles:", err);
			}
		};

		fetchArticles();
	}, [type, showPromos]);

	let filteredArticles = [...articles];

	if (type?.toLowerCase() === "promotion" || showPromos) {
		filteredArticles = filteredArticles.filter((article) =>
			article.promotions?.some((promo: Promotion) => {
				if (promo.status !== "active") return false;

				const startDate = new Date(promo.start_date);
				const endDate = new Date(promo.end_date);

				return now >= startDate && now <= endDate;
			}),
		);
	}

	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		filteredArticles = filteredArticles.filter(
			(article) =>
				article.name.toLowerCase().includes(query) ||
				article.brand?.name?.toLowerCase().includes(query) ||
				article.description?.toLowerCase().includes(query),
		);
	}

	const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedArticles = filteredArticles.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	const translations: Record<string, string> = {
		home: "Accueil",
		racket: "Raquette",
		rackets: "Raquettes",
		bag: "Sac",
		bags: "Sacs",
		ball: "Balle",
		balls: "Balles",
		clothing: "Vêtement",
		clothings: "Vêtements",
		shoes: "Chaussure",
		shoess: "Chaussures",
		accessory: "Accessoire",
		accessorys: "Accessoires",
		brand: "Marque",
		brands: "Marques",
		articles: "Articles",
		promotions: "Promotions",
		search: "Recherche",
	};

	const translateKey = (key: string) => {
		const cleanKey = key
			.toLowerCase()
			.replace(/\(s\)/g, "s")
			.replace(/[^a-z]/g, "");
		return translations[cleanKey] || key;
	};

	const breadcrumbItems = [
		{ label: "home", href: "/" },
		{
			label:
				showPromos || type?.toLowerCase() === "promotion"
					? "promotions"
					: searchQuery
						? "search"
						: type || "articles",
			href:
				showPromos || type?.toLowerCase() === "promotion"
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
					{searchQuery ? (
						<>résultat(s) pour "{searchQuery}"</>
					) : showPromos || type?.toLowerCase() === "promotion" ? (
						"Promotions disponibles"
					) : type ? (
						<>{translateKey(type)}(s) disponibles</>
					) : (
						"Articles disponibles"
					)}
				</h1>

				{/* --- Articles affichés --- */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{paginatedArticles.length > 0 ? (
						paginatedArticles.map((article) => (
							<ArticleCard key={article.article_id} article={article} />
						))
					) : (
						<p className="mt-4">Aucun article trouvé.</p>
					)}
				</div>

				{/* --- Pagination --- */}
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</>
	);
}
