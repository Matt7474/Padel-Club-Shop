import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../../api/Brand";
import type { Brand } from "../../types/Article";

export default function BrandIcon() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

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
		const handleUpdate = () => fetchBrands();
		window.addEventListener("brandDelete", handleUpdate);
		window.addEventListener("brandCreate", handleUpdate);
		return () => {
			window.removeEventListener("brandDelete", handleUpdate);
			window.removeEventListener("brandCreate", handleUpdate);
		};
	}, []);

	// ➜ Détecte si le contenu déborde
	useEffect(() => {
		const checkOverflow = () => {
			const el = containerRef.current;
			if (!el) return;
			setIsOverflowing(el.scrollWidth > el.clientWidth);
		};

		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [brands]);

	if (error) return <p className="text-red-500">Erreur: {error}</p>;
	if (brands.length === 0) return <p>Chargement des marques...</p>;

	return (
		<div className="mt-4 -mb-2 xl:mb-4">
			<div
				ref={containerRef}
				className={`flex gap-4 overflow-x-auto pb-2 px-4 items-center transition-all duration-200 ${
					isOverflowing ? "justify-start" : "justify-center"
				}`}
			>
				{brands.map((brand) => {
					const logoSrc = brand.logo.startsWith("/uploads/")
						? `${import.meta.env.VITE_API_URL}${brand.logo}`
						: brand.logo;

					return (
						<Link
							to={`/marques/${brand.name}`}
							key={brand.brand_id}
							className="shrink-0 flex items-center"
						>
							<img
								src={logoSrc}
								alt={brand.name}
								className="w-20 h-12 border border-gray-300 rounded-md shadow-md hover:bg-gray-300"
							/>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
