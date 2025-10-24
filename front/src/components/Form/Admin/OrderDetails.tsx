import { useNavigate } from "react-router-dom";
import type { Order } from "../../../types/Order";

interface OrderDetailsProps {
	order: Order;
	onReturn: () => void;
	onReadyOrder: () => void;
	onDeleteOrder: () => void;
}

export default function OrderDetails({
	order,
	onReturn,
	onReadyOrder,
	onDeleteOrder,
}: OrderDetailsProps) {
	const statusImages: Record<string, string> = {
		paid: "/icons/invoice-check.svg",
		processing: "/icons/package.svg",
		ready: "/icons/package-check.svg",
		shipped: "/icons/delivery.svg",
		cancelled: "/icons/invoice-cancelled.svg",
	};

	const statusFr: Record<string, string> = {
		paid: "Payée",
		processing: "En préparation",
		ready: "Prête",
		shipped: "Expédiée",
		cancelled: "Annulée",
	};

	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const tvaRate = 0.2;
	const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

	const priceHT = order.items.reduce((sum, item) => {
		if (!item.article) return sum;
		const priceTTC = item.article.price_ttc;
		const quantity = item.quantity;
		return sum + (priceTTC / (1 + tvaRate)) * quantity;
	}, 0);
	const totalHT = priceHT.toFixed(2);

	const totalTTC = order.items.reduce((sum, item) => {
		if (!item.article) return sum;
		const priceTTC = item.article.price_ttc;
		const quantity = item.quantity;
		return sum + priceTTC * quantity;
	}, 0);

	// const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
	//   {selectedOrder.items.reduce((total, item) => total + item.quantity, 0)}

	return (
		<div>
			<button
				type="button"
				onClick={onReturn}
				className="flex items-center gap-2 mb-0 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer mt-4 xl:mt-0"
			>
				<img
					src="/icons/arrow.svg"
					alt="fleche retour"
					className="w-4 rotate-180"
				/>
				Retour
			</button>

			<div className="max-w-5xl mx-auto px-3 py-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
					<div className="flex justify-between items-center mb-6 pb-4">
						<p className="text-sm font-semibold text-gray-800">
							{order.reference}
						</p>
						<div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg hover:brightness-90 cursor-pointer">
							<p className="font-medium text-gray-700">
								{statusFr[order.status as keyof typeof statusFr] ||
									"Statut inconnu"}
							</p>
							<img
								src={
									statusImages[order.status as keyof typeof statusImages] ||
									"/icons/default.svg"
								}
								alt={order.status}
								className="w-6 h-6"
							/>
						</div>
					</div>

					<div className="grid grid-cols-[2fr_4fr_3fr_1fr] xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 mb-3 pb-2 border-b border-gray-300 text-center">
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
							Image
						</p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
							Description
						</p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
							Reference
						</p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
							Qté
						</p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide hidden xl:block">
							Prix HT
						</p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide hidden xl:block">
							Prix TTC
						</p>
					</div>

					{order.items.map((item) => {
						const { article, quantity } = item;
						if (!article) return null;
						const mainImage =
							item.article?.images?.find((img) => img.is_main) ??
							item.article?.images?.[0];

						return (
							<div
								key={`${order.reference}-${article.article_id}`}
								className="grid grid-cols-[2fr_4fr_3fr_1fr] xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] text-center gap-4 items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
							>
								<img
									src={`${API_URL}${mainImage?.url}`}
									alt={item.article?.name}
									className="w-12 h-12 aspect-square object-cover rounded-md border border-gray-200 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
									onClick={() =>
										navigate(
											`/articles/${item.article?.type}/${item.article?.name}`,
										)
									}
									onKeyUp={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											navigate(
												`/articles/${item.article?.type}/${item.article?.name}`,
											);
										}
									}}
								/>

								<p className="text-sm text-gray-800">
									{article.name || "Inconnu"}
								</p>
								<p className="text-sm text-gray-900">
									{article.reference ?? ""}
								</p>
								<p className="text-sm text-gray-600">{quantity}</p>
								<p className="text-sm text-gray-700 hidden xl:block">
									{article.price_ttc
										? (article.price_ttc / 1.2).toFixed(2)
										: "N/A"}{" "}
									€
								</p>
								<p className="text-sm font-semibold text-gray-900 hidden xl:block">
									{article.price_ttc ?? "N/A"} €
								</p>
							</div>
						);
					})}
					<div className="grid grid-cols-[2fr_4fr_3fr_1fr] xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4  pb-2 border-b border-gray-300 text-center mt-8">
						{/* <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
						Image
					</p>
					<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
						Description
					</p> */}
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide"></p>
						<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide"></p>

						<p className="text-sm font-semibold uppercase tracking-wide">
							Sous Total
						</p>

						<p className="text-sm font-semibold uppercase tracking-wide">
							{totalQty}
						</p>

						<p className="text-sm font-semibold uppercase tracking-wide hidden xl:block">
							{totalHT} €
						</p>
						<p className="text-sm font-semibold uppercase tracking-wide hidden xl:block">
							{totalTTC} €
						</p>
					</div>

					<div className="mt-6 pt-4 bg-red-500">
						{order.status === "pending" && (
							<button type="button" onClick={onReadyOrder}>
								COMMANDE PRÊTE ?
							</button>
						)}
						{order.status === "cancelled" && (
							<button type="button" onClick={onDeleteOrder}>
								ANNULER LA COMMANDE
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
