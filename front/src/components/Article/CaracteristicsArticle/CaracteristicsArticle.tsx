import type Article from "../../../types/Article";

export default function CaracteristicsArticle({
	article,
}: {
	article: Article;
}) {
	const characteristics = article.tech_ratings ?? {};
	return (
		<>
			<div className="xl:w-full">
				<h3 className="hidden xl:font-semibold xl:text-lg xl:mb-4 xl:text-center xl:mt-10">
					Caractéristiques
				</h3>

				{/* Responsive : 1 colonne en mobile, 2 en desktop */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
					{Object.entries(characteristics)
						.filter(([_, value]) => value && value !== null)
						.map(([key, value]) => (
							<div
								key={key}
								className="flex border border-gray-300 rounded-lg overflow-hidden items-end"
							>
								<p className="bg-gray-300 px-3 py-2 w-2/5 font-semibold xl:w-1/2 capitalize">
									{key.replace(/_/g, " ")}
								</p>
								<p className="px-3 py-2 flex-1">{value}</p>
							</div>
						))}
				</div>
			</div>
		</>
	);
}
