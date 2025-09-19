import { Link } from "react-router-dom";
import data from "../../../data/dataTest.json";

export default function BrandIcon() {
	// Extraire les marques uniques par leur nom
	const brands = [
		...new Map(
			data.articles.map((article) => [article.brand.name, article.brand]),
		).values(),
	];

	return (
		<div className="mt-3">
			<div className="flex gap-4 2xl:justify-center 2xl:flex-wrap overflow-x-auto 2xl:overflow-visible pb-2 px-4 2xl:px-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
				{brands.map((brand) => (
					<Link
						to={`/marques/${brand.name}`}
						key={brand.name}
						className="flex-shrink-0"
					>
						<img
							src={brand.logo}
							alt={brand.name}
							className="hover:cursor-pointer h-12 border border-gray-300 rounded-md shadow-md hover:bg-gray-300 xl:hover:-translate-y-2 transition-transform"
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
