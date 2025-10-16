import { useEffect, useState } from "react";
import { getArticles } from "../../../api/Article";
import { deleteBrands, getBrands } from "../../../api/Brand";
import { useToastStore } from "../../../store/ToastStore ";
import type Article from "../../../types/Article";
import type { Brand } from "../../../types/Article";
import ConfirmModal from "../../Modal/ConfirmModal";
import InfoModal from "../../Modal/InfoModal";
import { useSortableData } from "../Tools/useSortableData";

export default function BrandList() {
	const BASE_URL = import.meta.env.VITE_API_URL;
	const addToast = useToastStore((state) => state.addToast);

	// States
	const [selectedBrand] = useState<Brand | null>(null);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [articles, setArticles] = useState<Article[]>([]);
	const [showConfirm, setShowConfirm] = useState(false);
	const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
	const [showModal, setShowModal] = useState(false);

	// Récupération des marques + articles
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getBrands();
				const articlesData = await getArticles();

				// On complète les URLs des logos
				const dataWithFullLogo = data.map((b: Brand) => ({
					...b,
					logo: b.logo ? BASE_URL + b.logo : "/icons/default.svg",
				}));

				setBrands(dataWithFullLogo);
				setArticles(articlesData);
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Erreur inconnue");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Hook pour le tri
	const {
		items: sortedBrands,
		requestSort,
		sortConfig,
	} = useSortableData(brands);

	const getClassNamesFor = (name: keyof Brand) => {
		if (!sortConfig) return;
		return sortConfig.key === name
			? sortConfig.direction === "asc"
				? "▲"
				: "▼"
			: undefined;
	};

	// Suppression d'une marque
	const handleDelete = (brandId: number) => {
		// Vérifie si la marque a des articles associés
		const hasArticles =
			articles?.some((article) => article.brand.brand_id === brandId) ?? false;

		if (hasArticles) {
			alert(
				"⚠️ Impossible de supprimer une marque associée à un ou plusieurs articles !",
			);
			return;
		}
		setBrandToDelete(brandId);
		setShowConfirm(true);
	};

	const confirmDelete = async () => {
		if (brandToDelete !== null) {
			await deleteBrands(brandToDelete);
			const refreshed = await getBrands();

			// Remettre les URL complètes
			const dataWithFullLogo = refreshed.map((b: Brand) => ({
				...b,
				logo: b.logo ? BASE_URL + b.logo : "/icons/default.svg",
			}));

			setBrands(dataWithFullLogo);
		}
		window.dispatchEvent(new Event("brandDelete"));
		// setShowModal(true);
		if (showConfirm === true) {
			addToast(`La marque à été supprimé avec succès`, "bg-green-500");
		}

		setShowConfirm(false);
		setBrandToDelete(null);
	};

	const cancelDelete = () => {
		setShowConfirm(false);
		setBrandToDelete(null);
	};

	// UI
	if (loading) return <p>Chargement des marques...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div>
			{selectedBrand === null && (
				<div>
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Liste des Marques
					</h2>

					<div className="grid grid-cols-[2fr_2fr_1fr_1fr] h-10 bg-gray-300 mt-4 mb-2 text-sm items-center">
						<button
							type="button"
							className=" pl-1 cursor-pointer"
							onClick={() => requestSort("name")}
						>
							NOM {getClassNamesFor("name")}
						</button>
						<p className=" text-center">LOGO</p>
						<p className=" text-center">NB.ART</p>
						<p className=" text-center">SUPPR.</p>
					</div>

					{sortedBrands.map((brand) => (
						<div key={brand.brand_id}>
							<div className="grid grid-cols-[2fr_2fr_1fr_1fr] h-10 items-center">
								<p className="pl-1 border-x h-8 text-center">{brand.name}</p>

								<div className="border-r h-8">
									<img
										src={brand.logo || "/icons/default.svg"}
										alt={brand.name || "Image par défaut"}
										className="h-10 w-full px-1 object-contain"
									/>
								</div>

								<div className="flex items-center justify-center border-r h-8">
									<p>
										{articles.filter((a) => a.brand.name === brand.name).length}
									</p>
								</div>

								<div className="flex items-center justify-center border-r h-8">
									<button
										type="button"
										onClick={() => handleDelete(brand.brand_id!)}
									>
										<img
											src="/icons/trash.svg"
											alt="poubelle"
											className="w-6 cursor-pointer"
										/>
									</button>
								</div>
							</div>
							<div className="w-full border-b border-gray-200"></div>
						</div>
					))}
				</div>
			)}

			{showConfirm && (
				<ConfirmModal
					onConfirm={confirmDelete}
					onCancel={cancelDelete}
					message="⚠️ Voulez-vous vraiment supprimer cette marque ?"
				/>
			)}
			{showModal && (
				<InfoModal
					id={1}
					bg="bg-green-500"
					text="Marque suprimée avec succès"
					onClose={() => setShowModal(false)}
					duration={2000}
				/>
			)}
		</div>
	);
}
