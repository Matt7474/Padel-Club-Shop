import data from "../../data/dataTest.json";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

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
	const now = new Date();

	// Filtrage des articles
	let articles = data.articles;

	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		articles = articles.filter(
			(article) =>
				article.name.toLowerCase().includes(query) ||
				article.brand.toLowerCase().includes(query) ||
				article.description.toLowerCase().includes(query),
		);
	} else if (type?.toLowerCase() === "promotion" || showPromos) {
		articles = articles.filter((article) =>
			article.promotions?.some(
				(promo) =>
					promo.status === "active" &&
					new Date(promo.start_date) <= now &&
					now <= new Date(promo.end_date),
			),
		);
	} else if (type) {
		articles = articles.filter((article) => article.type === type);
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
					{articles.length}{" "}
					{searchQuery
						? `résultat(s) pour "${searchQuery}"`
						: showPromos
							? "Promotions"
							: type
								? `${type}(s) disponibles`
								: "Articles disponibles"}
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{articles.length > 0 ? (
						articles.map((article) => (
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
