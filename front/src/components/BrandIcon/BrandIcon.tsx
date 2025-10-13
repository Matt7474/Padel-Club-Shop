import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../../api/Brand";
import type { Brand } from "../../types/Article";

export default function BrandIcon() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBrands = () => {
			getBrands()
				.then((data) =>
					setBrands(
						data.sort((a, b) =>
							a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
						),
					),
				)
				.catch((err: Error) => setError(err.message));
		};

		fetchBrands();

		// écouter l’event
		const handleUpdate = () => fetchBrands();
		window.addEventListener("brandDelete", handleUpdate);
		window.addEventListener("brandCreate", handleUpdate);

		// cleanup
		return () => {
			window.removeEventListener("brandDelete", handleUpdate);
			window.removeEventListener("brandCreate", handleUpdate);
		};
	}, []);

	if (error) {
		return <p className="text-red-500">Erreur: {error}</p>;
	}

	if (brands.length === 0) {
		return <p>Chargement des marques...</p>;
	}

	return (
		<div className="mt-3">
			<div className="flex gap-4 2xl:justify-center 2xl:flex-wrap overflow-x-auto 2xl:overflow-visible pb-2 px-4 2xl:px-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
				{brands.map((brand) => {
					// Gestion du chemin de l'image
					let logoSrc = brand.logo;
					if (brand.logo.startsWith("/uploads/")) {
						logoSrc = `${import.meta.env.VITE_API_URL}${brand.logo}`;
					}

					return (
						<Link
							to={`/marques/${brand.name}`}
							key={brand.brand_id}
							className="flex-shrink-0"
						>
							<img
								src={logoSrc}
								alt={brand.name}
								className="hover:cursor-pointer w-20 h-12 border border-gray-300 rounded-md shadow-md hover:bg-gray-300 xl:hover:-translate-y-2 transition-transform"
							/>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
