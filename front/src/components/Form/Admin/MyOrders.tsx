import { useEffect, useState } from "react";
import { CreditCard, ShoppingBag } from "lucide-react";
import { getMyOrders } from "../../../api/Order";
import { useAuthStore } from "../../../store/useAuthStore";
import type { OrderItem } from "../../../types/Order";

interface MyOrdersProps {
	order_id: number;
	reference: string;
	total_amount: number;
	status: "pending" | "paid" | "cancelled" | "shipped";
	created_at: string;
	items: OrderItem[];
}

const statusMap: Record<
	MyOrdersProps["status"],
	{ label: string; bg: string; text: string; border: string }
> = {
	pending: {
		label: "En attente",
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200",
	},
	paid: {
		label: "Payée",
		bg: "bg-emerald-50",
		text: "text-emerald-700",
		border: "border-emerald-200",
	},
	cancelled: {
		label: "Annulée",
		bg: "bg-rose-50",
		text: "text-rose-700",
		border: "border-rose-200",
	},
	shipped: {
		label: "Expédiée",
		bg: "bg-blue-50",
		text: "text-blue-700",
		border: "border-blue-200",
	},
};

export default function MyOrders() {
	const [orders, setOrders] = useState<MyOrdersProps[]>([]);
	const [loading, setLoading] = useState(true);
	const user = useAuthStore((state) => state.user);
	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getMyOrders();
				setOrders(data as MyOrdersProps[]);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	const handleOrderClick = () => {
		console.log("handleOrderClick");
	};

	if (loading)
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-slate-600 text-lg font-medium">
						Chargement de vos commandes...
					</p>
				</div>
			</div>
		);

	if (orders.length === 0)
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center p-6">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<ShoppingBag className="w-10 h-10 text-indigo-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-800 mb-3">
						Aucune commande
					</h2>
					<p className="text-slate-500 text-lg mb-6">
						Vous n'avez pas encore passé de commande.
					</p>
					<button
						type="button"
						className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
					>
						Découvrir nos produits
					</button>
				</div>
			</div>
		);

	return (
		<div>
			<div>
				{/* Header */}
				<div className="mb-10">
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Mes commandes
					</h2>
					<h3 className="text-lg pl-1 font-semibold mt-4 -mb-4">
						Suivez l'état de vos {orders.length} commande
						{orders.length > 1 ? "s" : ""}
					</h3>
				</div>

				{/* Orders Grid */}
				<div className="space-y-5">
					{orders.map((order) => {
						const status = statusMap[order.status];
						return (
							<div
								key={order.order_id}
								className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-300"
							>
								<div className="px-8 pb-9 pt-4">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
										{/* Order Info */}
										<div className="flex-1 space-y-4 ">
											{/* Reference & Status */}
											<div className="flex justify-between">
												<div className="flex flex-wrap gap-20 w-2/3">
													<div className="">
														<p className="text-md font-semibold">
															Commande effectuée le{" "}
														</p>
														<p className="italic text-md font-semibold">
															{new Date(order.created_at).toLocaleDateString(
																"fr-FR",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
														</p>
													</div>
													<div className="flex items-center gap-3 text-slate-600">
														<div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
															<CreditCard className="w-5 h-5 text-emerald-600" />
														</div>
														<div>
															<p className="text-xs text-slate-500 font-medium">
																Montant
															</p>
															<p className="font-bold text-slate-800 text-lg">
																{order.total_amount} €
															</p>
														</div>
													</div>
													<div className="group/user relative">
														<p>Livraison à</p>

														{/* Nom cliquable / survolable */}
														<p className="font-semibold underline text-blue-700 cursor-pointer">
															{user?.lastName} {user?.firstName}
														</p>

														{/* Bloc caché qui s’affiche au survol uniquement du nom */}
														<div className="hidden group-hover/user:block absolute top-full left-0 -mt-7 -ml-2 bg-white shadow-lg border border-slate-200 rounded-lg p-2 z-10 w-56">
															<p className="font-semibold ">
																{user?.lastName} {user?.firstName}
															</p>
															<div className="flex">
																<p>{user?.addresses?.[0].street_number}</p>
																<p className="ml-1">
																	{user?.addresses?.[0].street_name}
																</p>
															</div>
															<div className="flex">
																<p>{user?.addresses?.[0].zip_code}</p>
																<p className="ml-1">
																	{user?.addresses?.[0].city}
																</p>
															</div>
															<p>{user?.addresses?.[0].country}</p>
														</div>
													</div>
												</div>
												<div className="">
													<p className="text-md font-bold italic text-slate-800">
														{order.reference}
													</p>
													<button type="button" onClick={handleOrderClick}>
														<p className="underline text-blue-700 font-semibold cursor-pointer">
															Facture
														</p>
													</button>
												</div>
											</div>

											<div className="space-y-3">
												{order.items?.map((item: OrderItem) => {
													const mainImage =
														item.article?.images?.find((img) => img.is_main) ??
														item.article?.images?.[0];

													return (
														<div key={item.article_id} className="">
															<div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
																<div className="flex gap-4">
																	<img
																		src={`${API_URL}${mainImage?.url}`}
																		alt={item.article?.name}
																		className="w-14 h-14 object-cover rounded-md border"
																	/>
																	<div className="flex flex-col justify-center">
																		<p className="font-medium text-slate-800">
																			{item.article?.name}
																		</p>
																		<p className="text-sm text-slate-500">
																			Quantité : {item.quantity}
																		</p>
																	</div>
																</div>

																<div
																	className={`flex items-center justify-center h-10 px-4 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}
																>
																	{status.label}
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>

								<div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"></div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

// import { useEffect, useState } from "react";
// import {
// 	Package,
// 	Calendar,
// 	CreditCard,
// 	ChevronRight,
// 	ShoppingBag,
// } from "lucide-react";
// import { getMyOrders } from "../../../api/Order";

// interface MyOrdersProps {
// 	order_id: number;
// 	reference: string;
// 	total_amount: number;
// 	status: "pending" | "paid" | "cancelled" | "shipped";
// 	created_at: string;
// }

// const statusMap: Record<
// 	MyOrdersProps["status"],
// 	{ label: string; bg: string; text: string; border: string }
// > = {
// 	pending: {
// 		label: "En attente",
// 		bg: "bg-amber-50",
// 		text: "text-amber-700",
// 		border: "border-amber-200",
// 	},
// 	paid: {
// 		label: "Payée",
// 		bg: "bg-emerald-50",
// 		text: "text-emerald-700",
// 		border: "border-emerald-200",
// 	},
// 	cancelled: {
// 		label: "Annulée",
// 		bg: "bg-rose-50",
// 		text: "text-rose-700",
// 		border: "border-rose-200",
// 	},
// 	shipped: {
// 		label: "Expédiée",
// 		bg: "bg-blue-50",
// 		text: "text-blue-700",
// 		border: "border-blue-200",
// 	},
// };

// export default function MyOrders() {
// 	const [orders, setOrders] = useState<MyOrdersProps[]>([]);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchOrders = async () => {
// 			try {
// 				const data = await getMyOrders();
// 				setOrders(data as MyOrdersProps[]);
// 			} catch (err) {
// 				console.error(err);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		fetchOrders();
// 	}, []);

// 	if (loading)
// 		return (
// 			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center">
// 				<div className="text-center">
// 					<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
// 					<p className="text-slate-600 text-lg font-medium">
// 						Chargement de vos commandes...
// 					</p>
// 				</div>
// 			</div>
// 		);

// 	if (orders.length === 0)
// 		return (
// 			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center p-6">
// 				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
// 					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
// 						<ShoppingBag className="w-10 h-10 text-indigo-600" />
// 					</div>
// 					<h2 className="text-2xl font-bold text-slate-800 mb-3">
// 						Aucune commande
// 					</h2>
// 					<p className="text-slate-500 text-lg mb-6">
// 						Vous n'avez pas encore passé de commande.
// 					</p>
// 					<button
// 						type="button"
// 						className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
// 					>
// 						Découvrir nos produits
// 					</button>
// 				</div>
// 			</div>
// 		);

// 	return (
// 		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
// 			<div className="max-w-5xl mx-auto">
// 				{/* Header */}
// 				<div className="mb-10">
// 					<h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
// 						Mes commandes
// 					</h1>
// 					<p className="text-slate-600 text-lg">
// 						Suivez l'état de vos {orders.length} commande
// 						{orders.length > 1 ? "s" : ""}
// 					</p>
// 				</div>

// 				{/* Orders Grid */}
// 				<div className="space-y-5">
// 					{orders.map((order) => {
// 						const status = statusMap[order.status];
// 						return (
// 							<div
// 								key={order.order_id}
// 								className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
// 							>
// 								<div className="p-6 sm:p-8">
// 									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
// 										{/* Order Info */}
// 										<div className="flex-1 space-y-4">
// 											{/* Reference & Status */}
// 											<div className="flex flex-wrap items-center gap-3">
// 												<h3 className="text-xl font-bold text-slate-800">
// 													{order.reference}
// 												</h3>
// 												<span
// 													className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}
// 												>
// 													{status.label}
// 												</span>
// 											</div>

// 											{/* Details Grid */}
// 											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// 												<div className="flex items-center gap-3 text-slate-600">
// 													<div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
// 														<Calendar className="w-5 h-5 text-indigo-600" />
// 													</div>
// 													<div>
// 														<p className="text-xs text-slate-500 font-medium">
// 															Date
// 														</p>
// 														<p className="font-semibold text-slate-800">
// 															{new Date(order.created_at).toLocaleDateString(
// 																"fr-FR",
// 																{
// 																	day: "2-digit",
// 																	month: "long",
// 																	year: "numeric",
// 																},
// 															)}
// 														</p>
// 													</div>
// 												</div>

// 												<div className="flex items-center gap-3 text-slate-600">
// 													<div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
// 														<CreditCard className="w-5 h-5 text-emerald-600" />
// 													</div>
// 													<div>
// 														<p className="text-xs text-slate-500 font-medium">
// 															Montant
// 														</p>
// 														<p className="font-bold text-slate-800 text-lg">
// 															{order.total_amount} €
// 														</p>
// 													</div>
// 												</div>
// 											</div>
// 										</div>

// 										{/* Action Button */}
// 										<button
// 											type="button"
// 											className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center group-hover:scale-105 duration-300"
// 											onClick={() =>
// 												alert(`Voir détails commande ${order.reference}`)
// 											}
// 										>
// 											<Package className="w-5 h-5" />
// 											<span>Détails</span>
// 											<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// 										</button>
// 									</div>
// 								</div>

// 								{/* Subtle bottom accent */}
// 								<div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"></div>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
