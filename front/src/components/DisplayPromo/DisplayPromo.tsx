import type ArticleType from "../../types/Article";

interface DisplayPromoProps {
	article: ArticleType;
}

export default function DisplayPromo({ article }: DisplayPromoProps) {
	if (!article.promotions?.length) return null;

	const promo = article.promotions[0];
	const today = new Date();
	const start = new Date(promo.start_date);
	const end = new Date(promo.end_date);

	const isActive = today >= start && today <= end;

	if (!isActive) return null;

	return (
		<div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-5 rounded-xl shadow-lg text-white relative overflow-hidden">
			<div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl"></div>
			<div className="relative z-10 text-center">
				<h3 className="text-xl font-extrabold mb-2 drop-shadow-sm">
					{promo.name}
				</h3>
				<p className="text-sm font-medium leading-relaxed">
					Profitez de réductions exclusives pour faire des économies sur vos
					achats&nbsp;!
				</p>
				<p className="mt-3 text-sm font-bold">
					🗓️ Du{" "}
					{new Date(promo.start_date).toLocaleDateString("fr-FR", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
					})}{" "}
					au{" "}
					{new Date(promo.end_date).toLocaleDateString("fr-FR", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
					})}
				</p>
			</div>
		</div>
	);
}
