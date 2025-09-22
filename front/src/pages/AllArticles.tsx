import { useEffect, useState } from "react";
import { getArticles } from "../api/Article";
import type Article from "../types/Article";

export default function AllArticles() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getArticles();
				console.log("data", data);

				setArticles(data);
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Erreur inconnue");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (loading) return <div>Chargement...</div>;
	if (error) return <div>Erreur : {error}</div>;

	return (
		<div>
			{articles.map((article) => (
				<div key={article.article_id}>
					<h3>{article.name}</h3>
					<p>{article.description}</p>
					<p>Prix : {article.price_ttc} €</p>
				</div>
			))}
		</div>
	);
}
