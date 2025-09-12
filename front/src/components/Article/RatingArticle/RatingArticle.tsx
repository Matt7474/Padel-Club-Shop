import type Article from "../../../types/Article";
import RatingBar from "../../RatingBar/RatingBar";

export default function RatingArticle({ article }: { article: Article }) {
	return (
		<>
			<div className="xl:w-1/2">
				<h3 className="font-semibold text-lg mb-4 text-center mt-10">Notes</h3>
				<div className="grid grid-cols-2 gap-4 xl:mt-8 items-end">
					{Object.entries(article.note_tech).map(([key, value]) => (
						<div key={key} className=" first:mt-0">
							<p className="text-center font-semibold capitalize">
								{key.replace(/_/g, " ")}
							</p>
							<RatingBar value={value} />
						</div>
					))}
				</div>
			</div>
		</>
	);
}
