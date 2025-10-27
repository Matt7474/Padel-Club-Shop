import { useEffect, useState } from "react";
import { getPromotion } from "../../../api/Promotion";
import type { Promo } from "../../../types/Promotions";
import Loader from "../Tools/Loader";
import { useSortableData } from "../Tools/useSortableData";
import CreatePromo from "./CreatePromo";

interface PromoListProps {
	setMenuSelected?: React.Dispatch<React.SetStateAction<string>>;
}

export default function PromoList({ setMenuSelected }: PromoListProps) {
	const [promotions, setPromotions] = useState<Promo[]>([]);
	const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
	const [loading, setLoading] = useState(false);

	// Fonction pour charger les promotions
	const loadPromotions = async () => {
		try {
			setLoading(true);
			const data = await getPromotion();

			const today = new Date();

			// Calcul du statut réel selon les dates
			const promos = data.map((p: Promo) => {
				const start = new Date(p.start_date);
				const end = new Date(p.end_date);

				let realStatus: "active" | "upcoming" | "expired" = "upcoming";
				if (today >= start && today <= end) realStatus = "active";
				else if (today > end) realStatus = "expired";

				return {
					...p,
					status: realStatus,
					promo: p.name || "Sans nom",
				};
			});

			setPromotions(promos);
		} catch (err) {
			console.error("Erreur API Promotions :", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPromotions();
	}, []);

	const {
		items: sortedPromotions,
		requestSort,
		sortConfig,
	} = useSortableData(promotions);

	const getClassNamesFor = (name: keyof Promo) => {
		if (!sortConfig) return;
		return sortConfig.key === name
			? sortConfig.direction === "asc"
				? "▲"
				: "▼"
			: undefined;
	};

	const handlePromotionClick = (promo: Promo) => {
		setSelectedPromo(promo);
	};

	const handleCancelEdit = () => {
		setSelectedPromo(null);
		loadPromotions();
	};

	if (selectedPromo) {
		return (
			<CreatePromo
				promo={selectedPromo}
				mode="edit"
				setMenuSelected={setMenuSelected}
				onCancel={handleCancelEdit}
			/>
		);
	}

	if (loading) {
		return <Loader text={"des promotions"} />;
	}

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Promotions
			</h2>

			<div>
				{/* En-têtes de colonnes */}
				<div className="grid grid-cols-[3fr_2fr_2fr_2fr] text-center h-10 xl:grid-cols-[1fr_5fr_1fr_1fr_1fr] bg-gray-300 mt-4 mb-2">
					<button
						type="button"
						className="text-xs border-b pl-1 cursor-pointer"
						onClick={() => requestSort("name")}
					>
						NOM {getClassNamesFor("name")}
					</button>
					<button
						type="button"
						className="text-xs border-b pl-1 cursor-pointer hidden xl:block"
						onClick={() => requestSort("description")}
					>
						DESCRIPTION {getClassNamesFor("description")}
					</button>
					<button
						type="button"
						className="text-xs border-b pl-1 cursor-pointer"
						onClick={() => requestSort("start_date")}
					>
						DATE DÉBUT {getClassNamesFor("start_date")}
					</button>
					<button
						type="button"
						className="text-xs border-b pl-1 cursor-pointer"
						onClick={() => requestSort("end_date")}
					>
						DATE FIN {getClassNamesFor("end_date")}
					</button>
					<button
						type="button"
						className="text-xs border-b pl-1 cursor-pointer"
						onClick={() => requestSort("status")}
					>
						ACTIVE ? {getClassNamesFor("status")}
					</button>
				</div>

				{/* Liste des promotions */}
				{sortedPromotions.map((promo) => (
					<div key={promo.promo_id}>
						<button
							type="button"
							onClick={() => handlePromotionClick(promo)}
							className="cursor-pointer w-full text-left hover:bg-gray-300"
						>
							<div className="grid grid-cols-[3fr_2fr_2fr_2fr] text-center items-center h-10 xl:grid-cols-[1fr_5fr_1fr_1fr_1fr] xl:text-center">
								<p className="border-x px-1 py-1 text-xs h-8 flex items-center justify-center">
									{promo.name}
								</p>

								<p className="border-r px-1 py-1 text-xs h-8 text-start hidden xl:block truncate">
									{promo.description
										? promo.description.split(" ").slice(0, 20).join(" ") +
											"..."
										: ""}
								</p>

								<p className="border-r px-1 py-1 text-xs h-8 flex items-center justify-center truncate">
									{new Date(promo.start_date).toLocaleDateString("fr-FR")}
								</p>

								<p className="border-r px-1 py-1 text-xs h-8 flex items-center justify-center truncate">
									{new Date(promo.end_date).toLocaleDateString("fr-FR")}
								</p>

								<p className="border-r px-1 py-1 text-xs h-8 flex items-center justify-center truncate">
									{promo.status === "active" && (
										<span className="px-2 py-1 text-white text-xs rounded-full bg-green-500">
											Active
										</span>
									)}
									{promo.status === "upcoming" && (
										<span className="px-2 py-1 text-white text-xs rounded-full bg-blue-500">
											À venir
										</span>
									)}
									{promo.status === "expired" && (
										<span className="px-2 py-1 text-white text-xs rounded-full bg-red-500">
											Expirée
										</span>
									)}
								</p>
							</div>
							<div className="w-full border-b border-gray-200"></div>
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
