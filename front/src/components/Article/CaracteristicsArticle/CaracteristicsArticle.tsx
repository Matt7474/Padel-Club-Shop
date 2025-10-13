import type Article from "../../../types/Article";

export default function CaracteristicsArticle({
	article,
}: {
	article: Article;
}) {
	const characteristics = article.tech_characteristics ?? {};

	const translations: Record<string, string> = {
		material: "Matériau",
		color: "Couleur",
		size: "Taille",
		weight: "Poids",
		length: "Longueur",
		width: "Largeur",
		height: "Hauteur",
		brand: "Marque",
		category: "Catégorie",
		capacity: "Capacité",
		durability: "Durabilité",
		gender: "Genre",
		foam: "Mousse",
		level: "Niveau",
		shape: "Forme",
	};

	const translateKey = (key: string) =>
		translations[key] || key.replace(/_/g, " ");

	return (
		<>
			<div className="xl:w-full">
				<h3 className="hidden xl:font-semibold xl:text-lg xl:mb-4 xl:text-center xl:mt-10">
					Caractéristiques
				</h3>

				{/* Responsive : 1 colonne en mobile, 2 en desktop */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2 xl:gap-y-6 mt-6 xl:mt-10">
					{Object.entries(characteristics)
						.filter(([key, value]) => key !== "fit" && value && value !== null)
						.map(([key, value]) => (
							<div
								key={key}
								className="flex border border-gray-300 h-10 rounded-lg overflow-hidden"
							>
								<p className="bg-gray-300 h-full flex items-center px-3 w-2/5 font-semibold xl:w-1/2 capitalize">
									{translateKey(key)}
								</p>
								<div className="flex w-1/2 items-center px-2 text-sm">
									<p>{value}</p>
								</div>
							</div>
						))}
				</div>
			</div>
		</>
	);
}
