import { useEffect, useState } from "react";
import { getArticles } from "../api/Article";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import type Article from "../types/Article";

interface ArticlesProps {
	brand: string;
}

export default function Brand({ brand }: ArticlesProps) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);

	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: `${brand.charAt(0).toUpperCase() + brand.slice(1)}s`,
			href: `/marques/${brand}`,
		},
	];

	useEffect(() => {
		setLoading(true);
		getArticles()
			.then((data) => {
				// filtre les articles côté front
				const filtered = data.filter(
					(article) => article.brand.name.toLowerCase() === brand.toLowerCase(),
				);
				setArticles(filtered);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [brand]);

	if (loading) return <div>Chargement...</div>;
	if (articles.length === 0)
		return <div className="mt-4">Aucun article trouvé pour cette marque.</div>;

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<h1 className="text-xl font-bold mb-4 mt-2">
				Nos articles de la marque {brand}
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{articles.map((article) => (
					<ArticleCard key={article.article_id} article={article} />
				))}
			</div>
		</>
	);
}
