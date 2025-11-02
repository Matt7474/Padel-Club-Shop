import { useEffect, useState } from "react";
import { getOrders } from "../../../../api/Order";
import type { Order } from "../../../../types/Order";
import Loader from "../../Tools/Loader";
import AverageCart from "./Elements/AverageCart";
import Cards from "./Elements/Cards";
import SalesCategories from "./Elements/SalesCategories";
import SalesEvolution from "./Elements/SalesEvolution";
import TopSales from "./Elements/TopSales";

export default function Dashboard() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const response = await getOrders();

				const filteredOrders = (response as Order[]).filter(
					(order) => order.status !== "cancelled" && order.status !== "refund",
				);

				setOrders(filteredOrders);
			} catch (error) {
				console.error("Erreur lors de la récupération des commandes :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
		const interval = setInterval(fetchOrders, 30000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {}, [orders]);

	if (loading) {
		return <Loader text={"des données"} />;
	}

	console.log("orders dashboard", orders);

	return (
		<div className="flex-1 overflow-y-auto bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* En-tête */}
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
					<p className="text-gray-600 mt-2">Vue d'ensemble de la boutique</p>
				</div>
				<Cards orders={orders} />

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<SalesEvolution orders={orders} />
					<SalesCategories orders={orders} />
				</div>

				{/* Graphique visiteurs et produits top */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<AverageCart orders={orders} />
					<TopSales orders={orders} />
				</div>
			</div>
		</div>
	);
}
