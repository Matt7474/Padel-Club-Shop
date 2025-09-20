import { useState } from "react";
import data from "../../../../data/dataTest.json";
import type { Order } from "../../../types/Order";
import Button from "../Tools/Button";
import { useSortableData } from "../Tools/useSortableData";

export default function OrderList() {
	const orders = data.orders as Order[];
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const handleOrder = (order: Order) => setSelectedOrder(order);

	const { items: sortedOrders, requestSort } = useSortableData(orders);

	const statusImages: Record<string, string> = {
		pending: "/icons/invoice-waiting.svg",
		paid: "/icons/invoice-check.svg",
		shipped: "/icons/delivery.svg",
		cancelled: "/icons/invoice-cancelled.svg",
	};

	const statusFr: Record<string, string> = {
		paid: "Payée",
		pending: "En attente",
		shipped: "Expédiée",
		cancelled: "Annulée",
	};

	const handleReturnClick = () => setSelectedOrder(null);

	const handleReadyOrder = () => console.log("Commande prête");
	const handleDeleteOrder = () => console.log("Supprimer commande");

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Commandes
			</h2>

			{selectedOrder === null && (
				<div>
					<div className="grid grid-cols-[3fr_2fr_2fr_2fr] bg-gray-300 mt-4 mb-2 text-sm">
						<button
							type="button"
							onClick={() => requestSort("reference")}
							className=" cursor-pointer"
						>
							N° : REF ↓
						</button>
						<button
							type="button"
							onClick={() => requestSort("order_lines")}
							className="text-center cursor-pointer"
						>
							NB.ART ↓
						</button>
						<button
							type="button"
							onClick={() => requestSort("status")}
							className=" cursor-pointer"
						>
							STATUT ↓
						</button>
						<button
							type="button"
							onClick={() => requestSort("created_at")}
							className="text-center cursor-pointer"
						>
							DATE ↓
						</button>
					</div>

					{sortedOrders.map((order) => (
						<div key={order.order_id} className="relative">
							<button
								type="button"
								className="px-2 bg-white cursor-pointer w-full"
								onClick={() => handleOrder(order)}
							>
								<div className="grid grid-cols-[3fr_2fr_2fr_2fr] items-center h-12">
									<p className="pl-1 text-xs">{order.reference}</p>
									<p className="pl-1 text-xs text-center">
										{order.order_lines.length}
									</p>
									<div className="flex justify-center">
										<img
											src={
												statusImages[
													order.status as keyof typeof statusImages
												] || "/icons/default.svg"
											}
											alt={order.status}
											className="w-7"
										/>
									</div>
									<p className="pl-1 text-xs text-center">
										{new Date(order.created_at).toLocaleDateString()}
									</p>
								</div>
							</button>

							<div className="absolute bottom-0 left-0 w-full border-b border-gray-200"></div>
						</div>
					))}
				</div>
			)}

			{selectedOrder && (
				<>
					<button
						type="button"
						onClick={handleReturnClick}
						className="flex my-4 cursor-pointer"
					>
						<img
							src="/icons/arrow.svg"
							alt="fleche retour"
							className="w-4 rotate-180"
						/>
						Retour
					</button>

					<div className="xl:flex xl:flex-col xl:w-1/2 mx-auto text-left">
						<div className="flex justify-between">
							<p>{selectedOrder.reference}</p>
							<div className="flex justify-center">
								<p>
									{statusFr[selectedOrder.status as keyof typeof statusFr] ||
										"Statut inconnu"}
								</p>
								<img
									src={
										statusImages[
											selectedOrder.status as keyof typeof statusImages
										] || "/icons/default.svg"
									}
									alt={selectedOrder.status}
									className="w-7 ml-1 mr-2"
								/>
							</div>
						</div>

						<div className="grid grid-cols-[2fr_4fr_1fr_2fr_2fr] mt-4 mb-2">
							<p className="text-xs pl-1">IMAGE</p>
							<p className="text-xs pl-1">DESCRIPTION</p>
							<p className="text-xs pl-1">QTE</p>
							<p className="text-xs pl-1">PRIX.HT</p>
							<p className="text-xs pl-1">PRIX.TTC</p>
						</div>

						{selectedOrder.order_lines.map((line) => {
							const article = data.articles.find(
								(a) => a.article_id === line.article,
							);
							return (
								<div
									key={line.order_line_id}
									className="grid grid-cols-[2fr_4fr_1fr_2fr_2fr] gap-2 items-center border-b py-2"
								>
									<img
										src={article?.images?.[0] || "/icons/default.svg"}
										alt={article?.name || "Article"}
										className="w-12 h-12 object-cover rounded"
									/>
									<p className="font-semibold">{article?.name || "Inconnu"}</p>
									<p className="text-sm text-gray-600 pl-1">{line.quantity}</p>
									<p className="text-sm text-gray-800">
										{article?.price_ttc
											? (article.price_ttc / 1.2).toFixed(2)
											: "N/A"}{" "}
										€
									</p>
									<p className="text-sm font-bold text-gray-800">
										{article?.price_ttc ?? "N/A"} €
									</p>
								</div>
							);
						})}

						<div className="mt-4">
							{selectedOrder.status === "paid" && (
								<Button
									type="button"
									onClick={handleReadyOrder}
									buttonText="COMMANDE PRÊTE ?"
								/>
							)}
							{selectedOrder.status === "cancelled" && (
								<Button
									type="button"
									onClick={handleDeleteOrder}
									buttonText="ANNULER LA COMMANDE"
								/>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
