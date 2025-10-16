import { useEffect, useMemo, useState } from "react";
import {
	createPromo,
	deletePromoById,
	updatePromo,
} from "../../../api/Promotion";
import { useToastStore } from "../../../store/ToastStore ";
import type { Promo } from "../../../types/Promotions";
import ConfirmModal from "../../Modal/ConfirmModal";
import Button from "../Tools/Button";
import Input from "../Tools/Input";
import TextArea from "../Tools/TextArea";

interface CreatePromoProps {
	mode?: "create" | "edit";
	promo?: Promo;
	setMenuSelected?: React.Dispatch<React.SetStateAction<string>>;
	onCancel?: () => void;
}

export default function CreatePromo({
	promo,
	mode,
	setMenuSelected,
	onCancel,
}: CreatePromoProps) {
	const today = new Date();
	const addToast = useToastStore((state) => state.addToast);

	const [confirm, setConfirm] = useState(false);

	const [promoName, setPromoName] = useState("");
	const [promoDescription, setPromoDescription] = useState("");
	const [promoStartDate, setPromoStartDate] = useState("");
	const [promoEndDate, setPromoEndDate] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (mode === "edit" && promo) {
			setPromoName(promo.name ?? "");
			setPromoDescription(promo.description ?? "");
			setPromoStartDate(promo.start_date ? promo.start_date.slice(0, 10) : "");
			setPromoEndDate(promo.end_date ? promo.end_date.slice(0, 10) : "");
		}
	}, [mode, promo]);

	const startDate = promoStartDate ? new Date(promoStartDate) : null;
	const endDate = promoEndDate ? new Date(promoEndDate) : null;

	const promoState = useMemo(() => {
		if (startDate && today < startDate) return "pending";
		if (startDate && endDate && today >= startDate && today <= endDate)
			return "active";
		if (endDate && today > endDate) return "expired";
		return "unknown";
	}, [startDate, endDate, today]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			if (mode !== "edit") {
				const newPromo = await createPromo({
					name: promoName,
					description: promoDescription,
					start_date: promoStartDate,
					end_date: promoEndDate,
				});
				console.log("Promo créée :", newPromo);

				setSuccess(`Promotion "${newPromo.name}" créée avec succès !`);

				// Réinitialisation uniquement en création
				setPromoName("");
				setPromoDescription("");
				setPromoStartDate("");
				setPromoEndDate("");
				setMenuSelected?.("Liste des promotions");

				const startDate = new Date(newPromo.start_date).toLocaleDateString(
					"fr-FR",
				);
				const endDate = new Date(newPromo.end_date).toLocaleDateString("fr-FR");
				addToast(
					`La promotion ${newPromo.name} valide du ${startDate} au ${endDate} à été créé avec succès`,
					"bg-green-500",
				);
			} else if (mode === "edit" && promo) {
				// Appelle une fonction updatePromo côté API
				const updatedPromo = await updatePromo(promo.promo_id, {
					name: promoName,
					description: promoDescription,
					start_date: promoStartDate,
					end_date: promoEndDate,
				});
				console.log("promo.promo_id, :", promo.promo_id);
				console.log("Promo modifiée :", updatedPromo);

				setSuccess(
					`Promotion "${updatedPromo.name}" mise à jour avec succès !`,
				);
				onCancel?.();
				addToast(
					`La promotion ${updatedPromo.name} à été modifiée avec succès`,
					"bg-green-500",
				);
			}
		} catch (err: any) {
			setError(err.message || "Erreur lors de la sauvegarde de la promotion");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number | undefined) => {
		if (!id) return;

		try {
			await deletePromoById(id);
			setTimeout(() => {
				onCancel?.();
				setMenuSelected?.("Liste des promotions");
			}, 300);
			addToast(`La promotion à été supprimée avec succès`, "bg-green-500");
		} catch (error) {
			console.error("❌ Erreur lors de la suppression :", error);
		}
	};

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				{mode === "edit"
					? "Modification de la promotion"
					: "Création d'une promotion"}
				{mode === "edit" && (
					<button type="button" onClick={() => setConfirm(true)}>
						<div className="flex ">
							<p className="hidden xl:block">Supprimer la promotion ?</p>
							<img
								src="/icons/trash2.svg"
								alt="poubelle"
								className="w-6 cursor-pointer ml-2"
							/>
						</div>
					</button>
				)}
			</h2>
			{mode === "edit" && (
				<button
					type="button"
					onClick={onCancel}
					className="flex mt-4 cursor-pointer"
				>
					<img
						src="/icons/arrow.svg"
						alt="fleche retour"
						className="w-4 rotate-180"
					/>
					Retour
				</button>
			)}
			<div className="xl:w-1/3 xl:flex xl:flex-col xl:place-self-center gap-4 xl:gap-0">
				<form onSubmit={handleSubmit}>
					<Input
						htmlFor="promoName"
						label="Nom de la promotion"
						type="text"
						value={promoName}
						onChange={setPromoName}
						width="w-full"
					/>

					<TextArea
						label="Description de la promotion"
						placeholder="Description de la promo"
						length={promoDescription.length}
						height="h-80"
						value={promoDescription}
						onChange={setPromoDescription}
						maxLength={2000}
					/>

					{/* Dates */}
					<div className="grid grid-cols-3 gap-4 text-sm">
						<input
							type="date"
							value={promoStartDate}
							onChange={(e) => setPromoStartDate(e.target.value)}
							className="border rounded px-2 py-1 bg-gray-100 cursor-not-allowed h-10 mt-4"
							required
						/>
						<input
							type="date"
							value={promoEndDate}
							onChange={(e) => setPromoEndDate(e.target.value)}
							className="border rounded px-2 py-1 bg-gray-100 cursor-not-allowed h-10 mt-4"
							required
						/>

						<div className="mt-4 relative">
							{promoState === "pending" && (
								<div className="border border-[#1CBCF2] h-10 bg-[#1CBCF2] flex justify-center items-center">
									<p className="absolute">En attente</p>
								</div>
							)}
							{promoState === "active" && (
								<div className="border border-[#65D778] h-10 bg-[#65D778] flex justify-center items-center">
									<p className="absolute">Active</p>
								</div>
							)}
							{promoState === "expired" && (
								<div className="border border-[#E64C4C] h-10 bg-[#E64C4C] flex justify-center items-center">
									<p className="absolute">Expiré</p>
								</div>
							)}
							{promoState === "unknown" && (
								<div className="border border-transparent h-10 flex justify-center items-center">
									<p className="absolute">En attente</p>
								</div>
							)}
						</div>
					</div>

					{error && <p className="text-red-500 mt-2">{error}</p>}
					{success && <p className="text-green-500 mt-2">{success}</p>}

					<Button
						type="submit"
						buttonText={
							loading
								? mode === "edit"
									? "Mise à jour..."
									: "Création..."
								: mode === "edit"
									? "MODIFIER LA PROMOTION"
									: "AJOUTER UNE PROMOTION"
						}
					/>
				</form>
				{confirm && (
					<ConfirmModal
						onConfirm={() => handleDelete(promo?.promo_id)}
						onCancel={() => setConfirm(false)}
						message={`Voulez vous supprimer la promotion ${promoName}`}
					/>
				)}
			</div>
		</div>
	);
}
