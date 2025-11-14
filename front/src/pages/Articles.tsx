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
	const [filters, setFilters] = useState({
		brand: "",
		level: "",
		gender: "",
		shape: "",
		priceMin: "",
		priceMax: "",
	});
	const itemsPerPage = 15;
	const now = new Date();

	// --- Chargement des articles ---
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

	// --- Filtrage des promotions ---
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

	// --- Filtrage par recherche ---
	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		filteredArticles = filteredArticles.filter(
			(article) =>
				article.name.toLowerCase().includes(query) ||
				article.brand?.name?.toLowerCase().includes(query) ||
				article.description?.toLowerCase().includes(query),
		);
	}

	// --- Application des filtres ---
	filteredArticles = filteredArticles.filter((article) => {
		// --- Détermination du prix effectif ---
		let price = Number(article.price_ttc);

		// Vérifie s’il y a une promo active
		const activePromo = article.promotions?.find((promo: Promotion) => {
			if (promo.status !== "active") return false;
			const startDate = new Date(promo.start_date);
			const endDate = new Date(promo.end_date);
			return now >= startDate && now <= endDate;
		});

		// Si promo active → remplace par le prix réduit
		if (activePromo?.discount_value) {
			price = Number(activePromo.discount_value);
		}

		// --- Filtres existants ---
		const matchBrand = filters.brand
			? article.brand?.name === filters.brand
			: true;
		const matchLevel = filters.level
			? article.tech_characteristics?.level === filters.level
			: true;
		const matchGender = filters.gender
			? article.tech_characteristics?.gender === filters.gender
			: true;
		const matchShape = filters.shape
			? article.tech_characteristics?.shape === filters.shape
			: true;
		const matchPriceMin = filters.priceMin
			? price >= Number(filters.priceMin)
			: true;
		const matchPriceMax = filters.priceMax
			? price <= Number(filters.priceMax)
			: true;

		return (
			matchBrand &&
			matchLevel &&
			matchGender &&
			matchShape &&
			matchPriceMin &&
			matchPriceMax
		);
	});

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

	// --- Nombre de filtres actifs ---
	const activeFilters = Object.values(filters).filter(Boolean).length;

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

				{/* --- Zone de filtres --- */}
				<div className="flex flex-wrap gap-4 mb-6 items-end">
					{/* <select
						value={filters.brand}
						onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
						className="border rounded px-2 py-1"
					>
						<option value="">Toutes les marques</option>
						{[...new Set(articles.map((a) => a.brand?.name))].map(
							(brandName) =>
								brandName && (
									<option key={brandName} value={brandName}>
										{brandName}
									</option>
								),
						)}
					</select> */}

					<select
						value={filters.level}
						onChange={(e) => setFilters({ ...filters, level: e.target.value })}
						className="border rounded px-2 py-1"
					>
						<option value="">Tous niveaux</option>
						<option value="beginner">Débutant</option>
						<option value="intermediate">Intermédiaire</option>
						<option value="advanced">Avancé</option>
					</select>

					<select
						value={filters.gender}
						onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
						className="border rounded px-2 py-1"
					>
						<option value="">Tous genres</option>
						<option value="men">Homme</option>
						<option value="woman">Femme</option>
						<option value="unisex">Unisexe</option>
					</select>

					{/* <select
						value={filters.shape}
						onChange={(e) => setFilters({ ...filters, shape: e.target.value })}
						className="border rounded px-2 py-1"
					>
						<option value="">Toutes les formes</option>
						<option value="diamond">Diamant</option>
						<option value="round">Ronde</option>
						<option value="teardrop">Goutte d'eau</option>
					</select> */}

					<div className="flex items-center gap-2">
						<input
							type="number"
							placeholder="Prix min"
							value={filters.priceMin}
							onChange={(e) =>
								setFilters({ ...filters, priceMin: e.target.value })
							}
							className="border rounded px-2 py-1 w-24"
						/>
						<input
							type="number"
							placeholder="Prix max"
							value={filters.priceMax}
							onChange={(e) =>
								setFilters({ ...filters, priceMax: e.target.value })
							}
							className="border rounded px-2 py-1 w-24"
						/>
					</div>

					<button
						type="button"
						onClick={() =>
							setFilters({
								brand: "",
								level: "",
								gender: "",
								shape: "",
								priceMin: "",
								priceMax: "",
							})
						}
						className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
					>
						Réinitialiser
					</button>
				</div>

				{activeFilters > 0 && (
					<p className="text-sm text-gray-600 mb-2">
						{activeFilters} filtre(s) actif(s)
					</p>
				)}

				{/* --- Liste des articles --- */}
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
