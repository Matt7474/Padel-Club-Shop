import { useEffect, useState } from "react";
import ToogleType from "../Toogle/ToogleType";
import Input from "../Tools/Input";
import Select from "../Tools/Select";
import TextArea from "../Tools/TextArea";
import useAvailablePromos from "./useAvailablePromos";

// ✅ Définition du type pour une promotion
type Promo = {
	promo_id: number;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
};

// ✅ Typage complet des props
interface PromoFormProps {
	articleDiscountValue: number | string;
	setArticleDiscountValue: (val: string) => void;
	articlePromoType: string;
	setArticlePromoType: (val: string) => void;
	finalPrice: number;
	articleNamePromo: string;
	setArticleNamePromo: (val: string) => void;
	articleDescriptionPromo: string;
	setArticleDescriptionPromo: (val: string) => void;
	articlePromoStart: string;
	setArticlePromoStart: (val: string) => void;
	articlePromoEnd: string;
	setArticlePromoEnd: (val: string) => void;
	promoState: "pending" | "active" | "expired" | "unknown";
	today: Date;
	formatDateForInput: (date: string) => string;
	promoId?: number;
}

// ✅ Composant principal
export default function PromoForm({
	articleDiscountValue,
	setArticleDiscountValue,
	articlePromoType,
	setArticlePromoType,
	finalPrice,
	articleNamePromo,
	setArticleNamePromo,
	articleDescriptionPromo,
	setArticleDescriptionPromo,
	articlePromoStart,
	setArticlePromoStart,
	articlePromoEnd,
	setArticlePromoEnd,
	promoState,
	today,
	formatDateForInput,
	promoId,
}: PromoFormProps) {
	const [selectedPromoId, setSelectedPromoId] = useState<string>("");

	// Hook récupérant la liste des promos disponibles
	const { availablePromos } = useAvailablePromos(Number(selectedPromoId));

	// 🟢 Pré-remplissage automatique en mode édition
	useEffect(() => {
		if (availablePromos.length === 0) return;

		if (promoId) {
			setSelectedPromoId(String(promoId));
			return;
		}

		if (articleNamePromo) {
			const foundPromo = availablePromos.find(
				(p) => p.name === articleNamePromo,
			);
			if (foundPromo) {
				setSelectedPromoId(String(foundPromo.promo_id));
				return;
			}
		}

		setSelectedPromoId("");
	}, [promoId, articleNamePromo, availablePromos]);

	// 🟢 Quand une promo est sélectionnée, on met à jour les autres champs
	useEffect(() => {
		if (!selectedPromoId) return;
		const promo = availablePromos.find(
			(p) => p.promo_id === Number(selectedPromoId),
		);
		if (promo) {
			setArticleNamePromo(promo.name ?? "");
			setArticleDescriptionPromo(promo.description);
			setArticlePromoStart(formatDateForInput(promo.start_date));
			setArticlePromoEnd(formatDateForInput(promo.end_date));
		}
	}, [selectedPromoId, availablePromos]);

	return (
		<div>
			{/* Ligne montant / type / prix final */}
			<div className="grid grid-cols-3 gap-4 mt-4 relative">
				{/* Montant de la promo */}
				<div className="-mt-5">
					<Input
						htmlFor="discount_value"
						label="Montant promo"
						type="number"
						value={articleDiscountValue}
						onChange={setArticleDiscountValue}
					/>
				</div>

				{/* Type de promo (montant ou pourcentage) */}
				<div className="flex justify-center">
					<ToogleType value={articlePromoType} onChange={setArticlePromoType} />
				</div>

				{/* Prix final */}
				<div>
					<div className="relative border border-orange-400 px-2 pt-3.5 text-md -mt-1 bg-white h-10">
						{finalPrice}
						<span className="absolute text-md top-0 pt-4 right-2 pl-2 border-l">
							€
						</span>
						<p className="absolute text-gray-500 text-xs top-0 left-1">
							Prix de vente
						</p>
					</div>
				</div>
			</div>

			{/* Sélection de la promo */}
			<Select
				label="Quelle promotion ?"
				value={selectedPromoId}
				options={availablePromos.map((p) => String(p.promo_id))}
				labels={availablePromos.map((p) => (p.name ?? "–") as string)}
				onChange={setSelectedPromoId}
			/>

			{/* Description */}
			<TextArea
				label="Description de la promotion"
				placeholder="Jusqu'à épuisement des stocks"
				height="h-70"
				length={articleDescriptionPromo.length}
				value={articleDescriptionPromo}
				onChange={setArticleDescriptionPromo}
				maxLength={2000}
			/>

			{/* Dates + état */}
			<div className="grid grid-cols-3 gap-4 -mt-1 text-sm">
				<Input
					htmlFor="startDate"
					label="Début de la promo"
					type="date"
					value={articlePromoStart}
					onChange={setArticlePromoStart}
					min={today.toISOString().split("T")[0]}
				/>

				<Input
					htmlFor="endDate"
					label="Fin de la promo"
					type="date"
					value={articlePromoEnd}
					onChange={setArticlePromoEnd}
					min={articlePromoStart || today.toISOString().split("T")[0]}
				/>

				{/* État de la promo */}
				<div className="mt-4 relative">
					{promoState === "pending" && (
						<div className="border border-[#1CBCF2] h-10 bg-[#1CBCF2] flex justify-center items-center">
							<p className="text-md absolute">En attente</p>
						</div>
					)}
					{promoState === "active" && (
						<div className="border border-[#65D778] h-10 bg-[#65D778] flex justify-center items-center">
							<p className="text-md absolute">Active</p>
						</div>
					)}
					{promoState === "expired" && (
						<div className="border border-[#E64C4C] h-10 bg-[#E64C4C] flex justify-center items-center">
							<p className="text-md absolute">Expiré</p>
						</div>
					)}
					{promoState === "unknown" && (
						<div className="border border-transparent h-10 flex justify-center items-center">
							<p className="text-md absolute">En attente</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
