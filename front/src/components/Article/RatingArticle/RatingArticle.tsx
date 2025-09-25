import type Article from "../../../types/Article";
import RatingBar from "../../RatingBar/RatingBar";

export default function RatingArticle({ article }: { article: Article }) {
	const techRatingKeys = [
		"maneuverability",
		"power",
		"comfort",
		"spin",
		"tolerance",
		"control",
	];

	const techRatingLabels: Record<string, string> = {
		maneuverability: "Maniabilité",
		power: "Puissance",
		comfort: "Confort",
		spin: "Effet",
		tolerance: "Tolérance",
		control: "Contrôle",
	};

	// Si tech_ratings est absent, on retourne un message ou rien
	if (!article.ratings || Object.keys(article.ratings).length === 0) {
		return (
			<div className="xl:w-1/2">
				<h3 className="font-semibold text-lg mb-4 text-center mt-10">Notes</h3>
				<p className="text-center text-gray-500">Pas encore noté</p>
			</div>
		);
	}

	return (
		<div className="xl:w-1/2">
			<h3 className="font-semibold text-lg mb-4 text-center mt-10">Notes</h3>
			{article.ratings && Object.keys(article.ratings).length > 0 ? (
				<div className="grid grid-cols-2 gap-4 xl:mt-8 items-end">
					{techRatingKeys.map((key) => (
						<div key={key} className="first:mt-0">
							<p className="text-center font-semibold capitalize">
								{techRatingLabels[key] ?? key}
							</p>
							<RatingBar value={article.ratings![key] ?? 0} />
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500">Pas encore noté</p>
			)}
		</div>
	);
}
