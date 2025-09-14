import data from "../../data/dataTest.json";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

interface ArticlesProps {
	type?: string;
	showPromos?: boolean;
}

export default function Articles({ type, showPromos }: ArticlesProps) {
	const now = new Date();

	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: showPromos
				? "Promotions"
				: type
					? `${type.charAt(0).toUpperCase() + type.slice(1)}s`
					: "",
			href: showPromos ? "/articles/promotions" : `/articles/${type}`,
		},
	];

	const articles = data.articles.filter((article) => {
		if (type?.toLowerCase() === "promotion") {
			// On garde uniquement les articles avec une promo active
			return article.promotions?.some(
				(promo) =>
					promo.status === "active" &&
					new Date(promo.start_date) <= now &&
					now <= new Date(promo.end_date),
			);
		}
		return article.tech_characteristics.type === type;
	});

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="mt-4">
				<h1 className="text-xl font-bold mb-4">
					{articles.length} {showPromos ? "Promotions" : type}s disponibles
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
