import { Link } from "react-router-dom";

export default function BrandIcon() {
	const brands = [
		"adidas",
		"babolat",
		"wilson",
		"black-crown",
		"cork",
		"head",
		"nox",
		"oxdog",
		"starvie",
		"tecnifibre",
	];

	return (
		<div className="mt-3">
			<div className="flex gap-4 2xl:justify-center 2xl:flex-wrap overflow-x-auto 2xl:overflow-visible pb-2 px-4 2xl:px-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
				{brands.map((brand) => (
					<Link to={`/marque/${brand}`} key={brand} className="flex-shrink-0">
						<img
							src={`/brands/${brand}.svg`}
							alt={brand}
							className="hover:cursor-pointer h-12 border border-gray-300 rounded-md shadow-md hover:bg-gray-300 hover:-translate-y-2 transition-transform"
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
