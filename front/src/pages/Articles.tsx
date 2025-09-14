import data from "../../data/dataTest.json";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

interface ArticlesProps {
	type: string;
}

export default function Articles({ type }: ArticlesProps) {
	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
			href: `/articles/${type}`,
		},
	];

	const articles = data.articles.filter(
		(article) => article.tech_characteristics.type === type,
	);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="mt-4">
				<h1 className="text-xl font-bold mb-4">
					{articles.length} {type.charAt(0).toUpperCase() + type.slice(1)}s
					disponibles
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
