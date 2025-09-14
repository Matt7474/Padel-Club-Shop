import data from "../../data/dataTest.json";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

interface ArticlesProps {
	brand: string;
}

export default function Brand({ brand }: ArticlesProps) {
	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: `${brand.charAt(0).toUpperCase() + brand.slice(1)}s`,
			href: `/marques/${brand}`,
		},
	];

	const filteredArticles = data.articles.filter(
		(article) => article.brand.toLowerCase() === brand.toLowerCase(),
	);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<h1 className="text-xl font-bold mb-4">{brand}</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredArticles.map((article) => (
					<ArticleCard key={article.article_id} article={article} />
				))}
			</div>
		</>
	);
}
