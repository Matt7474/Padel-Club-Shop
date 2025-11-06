import { useEffect, useState } from "react";
import { getArticles, getArticlesDeleted } from "../../../api/Article";
import type Article from "../../../types/Article";
import Loader from "../Tools/Loader";
import Pagination from "../Tools/Pagination";
import { useSortableData } from "../Tools/useSortableData";
import CreateArticle from "./CreateArticle";

// Type unique pour le tri
type ArticleSortable = Article & {
	brandName?: string;
	promoActive?: number;
	promoStatusLabel?: string;
};

export default function ArticlesList() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [loading, setLoading] = useState(false);
	const [articles, setArticles] = useState<Article[]>([]);
	const [deletedArticles, setDeletedArticles] = useState<Article[]>([]);
	const [isChecked, setIsChecked] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	// Articles normaux
	useEffect(() => {
		const fetchArticles = async () => {
			try {
				setLoading(true);
				const data = await getArticles();
				setArticles(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des articles :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
		const interval = setInterval(fetchArticles, 30000);
		return () => clearInterval(interval);
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
		console.log("quantity", quantity);
		if (quantity <= 5) return "bg-red-100 hover:bg-red-200";
		if (quantity <= 15) return "bg-orange-100 hover:bg-orange-200";
		return "bg-transparent hover:bg-gray-100";
	};

	const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedArticles = sortedArticles.slice(startIndex, endIndex);

	// Calcul des quantité minimal en fonction des tailles d'articles
	function getArticleQuantity(article: Article): number {
		if (article.type === "clothing" || article.type === "shoes") {
			const fitString = article.tech_characteristics?.fit || "";
			const quantities = fitString
				.split(",")
				.map((part) => parseInt(part.split(":")[1] || "0", 10))
				.filter((q) => q > 0); // on garde uniquement les tailles dispo (>0)

			return quantities.length > 0 ? Math.min(...quantities) : 0; // la plus petite quantité dispo
		}

		// Pour les articles simples sans tailles
		return typeof article.stock_quantity === "number"
			? article.stock_quantity
			: 0;
	}

	if (loading) {
		return <Loader text={"des articles"} />;
	}

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

			{/* Legende couleur */}
			<div className="flex justify-between">
				<div className="flex gap-10 mb-4 justify-around xl:justify-start xl:ml-1">
					<div className="flex gap-3">
						<div className="bg-orange-200 w-8 h-2.5 mt-1 " />
						<p className="text-xs">&lt; 16 restant</p>
					</div>
					<div className="flex gap-3">
						<div className="bg-red-200 w-8 h-2.5 mt-1 " />
						<p className="text-xs">&lt; 6 restant</p>
					</div>
					<div className="flex gap-3">
						<span className="bg-yellow-500 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center -mt-1">
							!
						</span>
						<p className="text-xs">Quantité faible</p>
					</div>
					{/* <div className="flex gap-3">
						<span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center -mt-1">
							!
						</span>
						<p className="text-xs">Produit épuisé</p>
					</div> */}
				</div>
				<div>
					<p className="font-semibold mr-1">{articles.length} articles</p>
				</div>
			</div>
			{/* Liste d’articles */}
			{paginatedArticles.map((article) => {
				const quantity = getArticleQuantity(article);

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
								<p className="border-r px-1 h-8 items-center justify-center text-xs truncate hidden xl:flex">
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
			{/* --- Pagination --- */}
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	);
}
