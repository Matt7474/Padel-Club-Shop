import { DollarSign, Receipt, ShoppingCart, Users2 } from "lucide-react";
import type { Order } from "../../../../../types/Order";

export interface OrdersProps {
	orders: Order[];
}

export default function Cards({ orders }: OrdersProps) {
	// ✅ On filtre les commandes non annulées
	const validOrders = orders.filter((order) => order.status !== "cancelled");

	// Calcul du chiffre d'affaire HT (hors commandes annulées)
	const comptableCA = validOrders.reduce((acc, order) => {
		const totalTTC = parseFloat(order.total_amount ?? "0");
		const totalHT = totalTTC / 1.2;
		return acc + totalHT;
	}, 0);

	// Calcul du chiffre d'affaire HT + Frais de livraison (hors commandes annulées)
	const operationalCA = validOrders.reduce((acc, order) => {
		const totalTTC = parseFloat(order.total_amount ?? "0");
		const shippingCost = totalTTC < 69 ? 6.9 : 0;
		const totalHT = totalTTC / 1.2;
		return acc + shippingCost + totalHT;
	}, 0);

	// Calcul du nombre de clients uniques (hors commandes annulées)
	const uniqueClients = new Set(validOrders.map((order) => order.user_id));
	const totalClients = uniqueClients.size;

	// ✅ Nombre total de commandes valides
	const totalOrders = validOrders.length;

	const metriques = [
		{
			title: "Chiffre d'affaires comptable",
			subTitle: "(Total HT)",
			values: `${comptableCA.toFixed(2)} €`,
			icon: DollarSign,
			color: "bg-green-500",
		},
		{
			title: "Chiffre d'affaires opérationnel",
			subTitle: "(Total HT + Livraison)",
			values: `${operationalCA.toFixed(2)} €`,
			icon: Receipt,
			color: "bg-amber-500",
		},
		{
			title: "Commandes",
			subTitle: "(hors remboursées)",
			values: `${totalOrders}`,
			icon: ShoppingCart,
			color: "bg-blue-500",
		},
		{
			title: "Nombre de clients",
			subTitle: "(uniques)",
			values: totalClients.toString(),
			icon: Users2,
			color: "bg-purple-500",
		},
	];

	return (
		<div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
			{metriques.map((metrique) => {
				const Icon = metrique.icon;
				return (
					<div key={metrique.title} className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`${metrique.color} p-3 rounded-lg`}>
								<Icon className="w-6 h-6 text-white" />
							</div>
						</div>

						<h3 className="text-gray-600 text-sm mb-1">{metrique.title}</h3>
						<p className="text-gray-500 italic text-xs -mt-1 mb-1 h-4">
							{metrique.subTitle || ""}
						</p>
						<p className="text-2xl font-bold text-gray-900">
							{metrique.values}
						</p>
					</div>
				);
			})}
		</div>
	);
}
