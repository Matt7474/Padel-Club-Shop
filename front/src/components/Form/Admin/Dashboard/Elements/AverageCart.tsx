import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { Order } from "../../../../../types/Order";

export interface OrdersProps {
	orders: Order[];
}

// Fonction pour générer les N derniers mois
const generateLastMonths = (numMonths = 6) => {
	const result: { month: string; sales: number; orders: number }[] = [];
	const now = new Date();

	const monthNames = [
		"Jan",
		"Fév",
		"Mar",
		"Avr",
		"Mai",
		"Juin",
		"Juil",
		"Août",
		"Sep",
		"Oct",
		"Nov",
		"Déc",
	];

	for (let i = numMonths - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		result.push({ month: monthNames[d.getMonth()], sales: 0, orders: 0 });
	}

	return result;
};

export default function AverageCart({ orders }: OrdersProps) {
	// Générer les 6 derniers mois
	const lastMonths = generateLastMonths(6);

	// Calculer le panier moyen par mois
	const chartData = lastMonths.map((m) => {
		const monthOrders = orders.filter((order) => {
			const d = new Date(order.created_at);
			const monthNames = [
				"Jan",
				"Fév",
				"Mar",
				"Avr",
				"Mai",
				"Juin",
				"Juil",
				"Août",
				"Sep",
				"Oct",
				"Nov",
				"Déc",
			];
			return monthNames[d.getMonth()] === m.month;
		});

		const totalSales = monthOrders.reduce(
			(acc, order) => acc + parseFloat(order.total_amount ?? "0"),
			0,
		);

		const orderCount = monthOrders.length;

		return {
			month: m.month,
			amount: orderCount > 0 ? totalSales / orderCount : 0,
			orders: orderCount,
		};
	});

	// Dernier mois pour l'affichage du panier moyen actuel
	const lastMonthData = chartData[chartData.length - 1];

	return (
		<div className="bg-white lg:col-span-2 rounded-lg shadow p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold text-gray-900">
					Évolution du panier moyen
				</h2>
				<div className="text-right">
					<p className="text-2xl font-bold text-green-600">
						{lastMonthData.amount.toFixed(2)} €
					</p>
					<p className="text-xs text-gray-500">{lastMonthData.month}</p>
				</div>
			</div>

			<ResponsiveContainer width="100%" height={288}>
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis domain={["auto", "auto"]} />
					<Tooltip
						formatter={(value: number) => `${value.toFixed(2)} €`}
						labelFormatter={(label: string) => {
							const monthData = chartData.find((m) => m.month === label);
							return `${label} - ${monthData?.orders ?? 0} commandes`;
						}}
					/>
					<Legend />
					<Line
						type="monotone"
						dataKey="amount"
						stroke="#10b981"
						strokeWidth={3}
						name="Panier moyen (€)"
						dot={{ fill: "#10b981", r: 5 }}
						activeDot={{ r: 7 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
