import { useEffect, useState } from "react";
import { getPromotion } from "../../../api/Promotion";
import type { Promo } from "../../../types/Promotions";

export default function useAvailablePromos(selectedPromoId: number | "") {
	const [availablePromos, setAvailablePromos] = useState<Promo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPromos = async () => {
			setLoading(true);
			try {
				const promo = await getPromotion();
				setAvailablePromos(promo);
				setLoading(false);
			} catch (err: any) {
				console.error("Erreur récupération promos :", err);
				setError(err.message || "Erreur lors de la récupération des promos");
				setLoading(false);
			}
		};

		fetchPromos();
	}, []);

	// Pré-remplissage si selectedPromoId change
	const getSelectedPromo = () => {
		if (!selectedPromoId || availablePromos.length === 0) return null;
		return availablePromos.find((p) => p.promo_id === selectedPromoId) || null;
	};

	return { availablePromos, loading, error, getSelectedPromo };
}
