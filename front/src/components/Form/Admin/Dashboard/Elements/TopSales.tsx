import type { Order } from "../../../../../types/Order";

export interface OrdersProps {
	orders: Order[];
}

export default function TopSales({ orders }: OrdersProps) {
	const API_URL = import.meta.env.VITE_API_URL;
	// Calculer les ventes par article
	const articleMap: Record<
		string,
		{ name: string; sales: number; gains: number; image?: string }
	> = {};

	orders.forEach((order) => {
		order.items?.forEach((item) => {
			const name = item.article?.name ?? "Unknown";
			const quantity = item.quantity ?? 0;
			const price = Number(item.price ?? 0);
			const image = item.article?.images?.[0]?.url
				? `${API_URL}${item.article.images[0].url}`
				: undefined;

			if (!articleMap[name]) {
				articleMap[name] = { name, sales: 0, gains: 0, image };
			}

			articleMap[name].sales += quantity;
			articleMap[name].gains += price * quantity;
		});
	});

	// Trier les articles par ventes décroissantes
	const topArticles = Object.values(articleMap)
		.sort((a, b) => b.sales - a.sales)
		.slice(0, 5);

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-bold text-gray-900 mb-4">Top produits</h2>
			<div className="space-y-4">
				{topArticles.map((article) => (
					<div
						key={article.name}
						className="flex items-center justify-between pb-3 border-b last:border-b-0"
					>
						<div className="flex items-center gap-4 w-4/5">
							{article.image && (
								<img
									src={article.image}
									alt={article.name}
									className="w-8 h-8 object-cover rounded"
								/>
							)}
							<div>
								<p className="text-sm font-semibold text-gray-900">
									{article.name}
								</p>
								<p className="text-sm text-gray-600">{article.sales} ventes</p>
							</div>
						</div>
						<p className="font-bold text-green-600 w-1/5 text-end">
							{article.gains.toFixed(2)} €
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
