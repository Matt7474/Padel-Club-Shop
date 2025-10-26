import { useEffect, useState } from "react";
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
import { getOrders } from "../../../../../api/Order";
import type { Order } from "../../../../../types/Order";

export default function SalesEvolution() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [salesData, setSalesData] = useState<
		{ month: string; sales: number; orders: number }[]
	>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await getOrders();
				setOrders(response as Order[]);
			} catch (error) {
				console.error("Erreur lors de la récupération des commandes :", error);
			}
		};

		fetchOrders();
		const interval = setInterval(fetchOrders, 5000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setSalesData(computeSalesData(orders));
	}, [orders]);

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
			"Aoû",
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

	const computeSalesData = (orders: Order[]) => {
		const data = generateLastMonths(6);

		orders.forEach((order) => {
			const date = new Date(order.created_at);
			const monthIndex = data.findIndex(
				(d) =>
					d.month ===
					[
						"Jan",
						"Fév",
						"Mar",
						"Avr",
						"Mai",
						"Juin",
						"Juil",
						"Aoû",
						"Sep",
						"Oct",
						"Nov",
						"Déc",
					][date.getMonth()],
			);
			if (monthIndex !== -1) {
				data[monthIndex].sales += parseFloat(order.total_amount);
				data[monthIndex].orders += 1;
			}
		});

		return data;
	};

	return (
		<>
			<div>
				{/* Évolution des ventes */}
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4">
						Évolution des ventes
					</h2>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={salesData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="sales"
								stroke="#3b82f6"
								strokeWidth={2}
								name="sales (€)"
							/>
							<Line
								type="monotone"
								dataKey="orders"
								stroke="#8b5cf6"
								strokeWidth={2}
								name="orders"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</>
	);
}
