import { useEffect, useState } from "react";
import { getArticles, getArticlesDeleted } from "../../../api/Article";
import type Article from "../../../types/Article";
import { useSortableData } from "../Tools/useSortableData";
import CreateArticle from "./CreateArticle";

// Type unique pour le tri
type ArticleSortable = Article & {
	brandName?: string; // pour trier par marque
	promoActive?: number; // pour trier par promo active
	promoStatusLabel?: string; // pour trier par statut de promo
};

export default function ArticlesList() {
	const API_URL = import.meta.env.VITE_API_URL;

	const [articles, setArticles] = useState<Article[]>([]);
	const [deletedArticles, setDeletedArticles] = useState<Article[]>([]);
	const [isChecked, setIsChecked] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

	// Articles normaux
	useEffect(() => {
		getArticles()
			.then((data) => setArticles(data))
			.catch((err) => console.error("Erreur API Articles:", err));
	}, []);

	// Articles supprimés
	useEffect(() => {
		if (isChecked) {
			getArticlesDeleted()
				.then((data) => setDeletedArticles(data))
				.catch((err) => console.error("Erreur API Articles:", err));
		} else {
			setDeletedArticles([]);
		}
	}, [isChecked]);

	const handleArticleClick = (article: Article) => {
		setSelectedArticle(article);
	};

	// Liste courante
	const currentArticles = isChecked ? deletedArticles : articles;

	// Ajouter les champs calculés pour le tri
	const articlesForSort: ArticleSortable[] = currentArticles.map((a) => {
		const now = new Date();

		let promoStatusLabel = "Inactive";

		if (a.promotions && a.promotions.length > 0) {
			const activePromo = a.promotions.find(
				(p) => new Date(p.start_date) <= now && now <= new Date(p.end_date),
			);
			const upcomingPromo = a.promotions.find(
				(p) => new Date(p.start_date) > now,
			);

			if (activePromo) promoStatusLabel = "Active";
			else if (upcomingPromo) promoStatusLabel = "En attente";
		}

		return {
			...a,
			brandName: a.brand?.name || "Sans marque",
			promoActive: a.promotions?.some(
				(p) => new Date(p.start_date) <= now && now <= new Date(p.end_date),
			)
				? 1
				: 0,
			promoStatusLabel,
		};
	});

	// Hook de tri
	const {
		items: sortedArticles,
		requestSort,
		sortConfig,
	} = useSortableData<ArticleSortable>(articlesForSort);

	const getClassNamesFor = (name: keyof ArticleSortable) => {
		if (!sortConfig) return;
		return sortConfig.key === name
			? sortConfig.direction === "asc"
				? "▲"
				: "▼"
			: undefined;
	};

	const refreshArticles = async () => {
		try {
			const data = await getArticles();
			setArticles(data);
		} catch (err) {
			console.error("Erreur API Articles:", err);
		}
	};

	const refreshDeletedArticles = async () => {
		if (!isChecked) return;
		try {
			const data = await getArticlesDeleted();
			setDeletedArticles(data);
		} catch (err) {
			console.error("Erreur API Articles:", err);
		}
	};

	const getRowBgClass = (quantity: number) => {
		if (quantity <= 5) return "bg-red-100 hover:bg-red-200";
		if (quantity <= 15) return "bg-orange-100 hover:bg-orange-200";
		return "bg-transparent hover:bg-gray-100";
	};

	if (selectedArticle) {
		return (
			<CreateArticle
				title="Modifier l'article"
				buttonText="MODIFIER L'ARTICLE"
				article={selectedArticle}
				mode="edit"
				onReturn={() => setSelectedArticle(null)}
				onUpdated={() => {
					refreshArticles();
					if (isChecked) refreshDeletedArticles();
				}}
			/>
		);
	}

	return (
		<div>
			<div className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between items-center">
				<div className="">
					<h2 className="">Liste des Articles</h2>
				</div>
				<div className="w-1/2 text-end">
					<label htmlFor="articleDeleted">
						Voir les articles archivé ?
						<input
							type="checkbox"
							id="articleDeleted"
							className="ml-2"
							checked={isChecked}
							onChange={() => setIsChecked((prev) => !prev)}
						/>
					</label>
				</div>
			</div>

			{/* Header colonnes */}
			<div className="grid grid-cols-[2fr_5fr_1fr_3fr_2fr_1fr] h-10 xl:grid-cols-[1fr_2fr_5fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-300 mt-4 mb-2 items-center">
				<button type="button" className="text-xs  cursor-pointer">
					IMAGE
				</button>
				<button
					type="button"
					className="text-xs  cursor-pointer"
					onClick={() => requestSort("name")}
				>
					NOM {getClassNamesFor("name")}
				</button>
				<button
					type="button"
					className="text-xs  cursor-pointer hidden xl:block"
					onClick={() => requestSort("description")}
				>
					DESCRIPTION {getClassNamesFor("description")}
				</button>
				<button
					type="button"
					className="text-xs  cursor-pointer"
					onClick={() => requestSort("stock_quantity")}
				>
					QTE {getClassNamesFor("stock_quantity")}
				</button>
				<button
					type="button"
					className="text-xs  cursor-pointer hidden xl:block"
					onClick={() => requestSort("brandName")}
				>
					MARQUE {getClassNamesFor("brand")}
				</button>
				<button
					type="button"
					className="text-xs  cursor-pointer"
					onClick={() => requestSort("reference")}
				>
					REF {getClassNamesFor("reference")}
				</button>
				<button
					type="button"
					className="text-xs pr-1 cursor-pointer"
					onClick={() => requestSort("type")}
				>
					TYPE {getClassNamesFor("type")}
				</button>
				<button
					type="button"
					className="text-xs pr-1 cursor-pointer hidden xl:block"
					onClick={() => requestSort("promoStatusLabel")}
				>
					PROMO ? {getClassNamesFor("promoStatusLabel")}
				</button>
				<div>
					<div>
						<button
							type="button"
							className="text-xs cursor-pointer xl:hidden"
							onClick={() => requestSort("status")}
						>
							DIS {getClassNamesFor("status")}
						</button>
					</div>
					<div>
						<button
							type="button"
							className="text-xs pl-1 cursor-pointer hidden xl:block"
							onClick={() => requestSort("status")}
						>
							DISPONIBILITE {getClassNamesFor("status")}
						</button>
					</div>
				</div>
			</div>

			{/* Liste d’articles */}
			{sortedArticles.map((article) => {
				const quantity =
					typeof article.stock_quantity === "number"
						? article.stock_quantity
						: Object.values(article.stock_quantity || {}).reduce(
								(acc: number, val) => acc + (val ?? 0),
								0,
							);

				return (
					<div key={article.article_id}>
						<button
							type="button"
							onClick={() => handleArticleClick(article)}
							className={`cursor-pointer w-full text-left transition-colors duration-300 ${getRowBgClass(
								quantity,
							)}`}
						>
							<div className="grid grid-cols-[2fr_5fr_1fr_3fr_2fr_1fr] h-10 items-center xl:grid-cols-[1fr_2fr_5fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:text-center">
								<div className="border-x">
									<img
										src={
											`${API_URL}${article.images?.[0]?.url}` ||
											"/icons/default.svg"
										}
										alt={article.name || "Image par défaut"}
										className="mx-auto px-1 w-8 h-8"
									/>
								</div>
								<p className="border-r px-1 h-8 flex items-center justify-start xl:justify-center text-xs">
									{article.name}
								</p>
								<p className="border-r px-1 h-8 text-xs text-start hidden xl:flex items-center">
									{article.description
										? article.description.split(" ").slice(0, 20).join(" ") +
											"..."
										: ""}
								</p>
								<p className="border-r px-1 h-8 flex items-center justify-center text-xs truncate">
									{quantity}
								</p>
								<p className="border-r px-1 h-8 items-center justify-center text-xs truncate hidden xl:block">
									{article.brand?.name}
								</p>
								<p className="border-r px-1 h-8 flex items-center justify-center text-xs truncate">
									{article.reference}
								</p>
								<p className="border-r px-1 h-8 flex items-center text-start xl:justify-center text-xs truncate">
									{article.type}
								</p>
								<div className="border-r px-1 h-8 hidden xl:flex items-center justify-center">
									{article.promoStatusLabel === "Active" && (
										<div className="h-4 w-4 rounded-full bg-green-500" />
									)}
									{article.promoStatusLabel === "En attente" && (
										<div className="h-4 w-4 rounded-full bg-blue-500" />
									)}
									{article.promoStatusLabel === "Inactive" && (
										<div className="h-4 w-4 rounded-full bg-red-500" />
									)}
								</div>

								<div>
									<div className="border-r px-1 text-xs truncate flex justify-center items-center">
										{article.status === "available" && (
											<div>
												<span className="px-2 py-1 text-white text-xs rounded-full bg-green-500 xl:hidden" />
												<span className="px-2 py-1 text-white text-xs rounded-full bg-green-500 hidden xl:block">
													Disponible
												</span>
											</div>
										)}
										{article.status === "preorder" && (
											<div>
												<span className="px-2 py-1 text-white text-xs rounded-full bg-blue-500 xl:hidden" />
												<span className="px-2 py-1 text-white text-xs rounded-full bg-blue-500 hidden xl:block">
													Commande
												</span>
											</div>
										)}
										{article.status === "out_of_stock" && (
											<div>
												<span className="px-2 py-1 text-white text-xs rounded-full bg-red-500 xl:hidden" />
												<span className="px-2 py-1 text-white text-xs rounded-full bg-red-500 hidden xl:block">
													Rupture
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="w-full border-b border-gray-200"></div>
						</button>
					</div>
				);
			})}
		</div>
	);
}
