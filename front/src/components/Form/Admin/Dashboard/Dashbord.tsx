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
import Cards from "./Elements/Cards";
import SalesEvolution from "./Elements/SalesEvolution";
import SalesCategories from "./Elements/SalesCategories";
import { useEffect, useState } from "react";
import type { Order } from "../../../../types/Order";
import { getOrders } from "../../../../api/Order";
import TopSales from "./Elements/TopSales";

export default function Dashboard() {
	const [orders, setOrders] = useState<Order[]>([]);

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
		const interval = setInterval(fetchOrders, 30000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		// setSalesData(computeSalesData(orders));
	}, [orders]);

	// Panier moyen par mois
	const panierMoyenData = [
		{ mois: "Jan", montant: 48.3 },
		{ mois: "Fév", montant: 48.1 },
		{ mois: "Mar", montant: 48.6 },
		{ mois: "Avr", montant: 49.2 },
		{ mois: "Mai", montant: 49.2 },
		{ mois: "Juin", montant: 49.7 },
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* En-tête */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
					<p className="text-gray-600 mt-2">Vue d'ensemble de la boutique</p>
				</div>

				{/* Header : Cartes métriques */}
				<Cards orders={orders} />

				{/* Graphiques principaux */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Évolution des ventes */}
					<SalesEvolution orders={orders} />
					{/* Ventes par caategories */}
					<SalesCategories orders={orders} />
				</div>

				{/* Graphique visiteurs et produits top */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Panier moyen */}
					<div className="bg-white lg:col-span-2 rounded-lg shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-900">
								Évolution du panier moyen
							</h2>
							<div className="text-right">
								<p className="text-2xl font-bold text-green-600">49,7 €</p>
								<p className="text-xs text-gray-500">Juin 2024</p>
							</div>
						</div>
						<ResponsiveContainer width="100%" height={288}>
							<LineChart data={panierMoyenData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="mois" />
								<YAxis domain={[45, 52]} />
								<Tooltip formatter={(value) => `${value} €`} />
								<Legend />
								<Line
									type="monotone"
									dataKey="montant"
									stroke="#10b981"
									strokeWidth={3}
									name="Panier moyen (€)"
									dot={{ fill: "#10b981", r: 5 }}
									activeDot={{ r: 7 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					{/* Top produits */}
					<TopSales orders={orders} />
				</div>
			</div>
		</div>
	);
}
