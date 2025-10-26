import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { Order } from "../../../../../types/Order";

export interface OrdersProps {
	orders: Order[];
}

export default function SalesCategories({ orders }: OrdersProps) {
	// Définition des catégories avec couleur
	const categories = [
		{ type: "clothing", color: "#3b82f6" },
		{ type: "Accessory", color: "#8b5cf6" },
		{ type: "Shoes", color: "#ec4899" },
		{ type: "Racket", color: "#f59e0b" },
		{ type: "Balls", color: "#e11d48" },
		{ type: "Bags", color: "#10b981" },
	];

	const nameMap: Record<string, string> = {
		clothing: "Vêtements",
		Accessory: "Accessoires",
		Shoes: "Chaussures",
		Racket: "Raquettes",
		Balls: "Balles",
		Bags: "Sacs",
	};

	// Calcul des ventes par catégorie
	const categoriesData = categories.map((cat) => {
		const value = orders.reduce((acc, order) => {
			const catItems =
				order.items?.filter(
					(item) =>
						item.article?.type?.toLowerCase() === cat.type.toLowerCase(),
				) || [];
			const totalValue = catItems.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0,
			);
			return acc + totalValue;
		}, 0);

		return { ...cat, value, name: nameMap[cat.type] };
	});

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-bold text-gray-900 mb-4">
				Ventes par catégorie
			</h2>
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={categoriesData}
						cx="50%"
						cy="50%"
						outerRadius={85}
						dataKey="value"
						label={({ name, percent }) =>
							`${name} ${(Number(percent) * 100).toFixed(0)}%`
						}
					>
						{categoriesData.map((entry) => (
							<Cell key={`cell-${entry.type}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
					<Legend layout="horizontal" verticalAlign="bottom" align="center" />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
