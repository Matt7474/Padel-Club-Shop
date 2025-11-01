import { CreditCard, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../../api/Order";
import { useAuthStore } from "../../../store/useAuthStore";
import type { OrderItem } from "../../../types/Order";
import { generateInvoice } from "../../../utils/generateInvoice";
import Loader from "../Tools/Loader";

interface MyOrdersProps {
	order_id: number;
	reference: string;
	total_amount: number;
	status: "paid" | "processing" | "ready" | "shipped" | "cancelled";
	created_at: string;
	items: OrderItem[];
}

const statusMap: Record<
	MyOrdersProps["status"],
	{ label: string; bg: string; text: string; border: string }
> = {
	paid: {
		label: "Payée",
		bg: "bg-amber-50", // jaune clair → début du process
		text: "text-amber-700",
		border: "border-amber-200",
	},
	processing: {
		label: "Préparation",
		bg: "bg-orange-50", // orange clair → en cours de préparation
		text: "text-orange-700",
		border: "border-orange-200",
	},
	ready: {
		label: "Prête",
		bg: "bg-blue-50", // bleu clair → prête à être expédiée
		text: "text-blue-700",
		border: "border-blue-200",
	},
	shipped: {
		label: "Expédiée",
		bg: "bg-green-50", // vert clair → finalisée
		text: "text-green-700",
		border: "border-green-200",
	},
	cancelled: {
		label: "Annulée",
		bg: "bg-rose-50", // rouge clair → annulée
		text: "text-rose-700",
		border: "border-rose-200",
	},
};

export default function MyOrders() {
	const [orders, setOrders] = useState<MyOrdersProps[]>([]);
	const [loading, setLoading] = useState(true);
	const user = useAuthStore((state) => state.user);
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

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

	console.log("orders", orders);

	const handleOrderClick = (order: MyOrdersProps) => {
		console.log("Génération de la facture pour:", order);

		// Préparer les données pour la facture avec toutes les vérifications
		const invoiceData = {
			order_id: order.order_id,
			reference: order.reference || `CMD-${order.order_id}`,
			total_amount: order.total_amount || 0,
			created_at: order.created_at || new Date().toISOString(),
			items: order.items || [],
			user: {
				firstName: user?.firstName || "",
				lastName: user?.lastName || "",
				email: user?.email || "",
				addresses: user?.addresses || [],
			},
		};

		try {
			// Générer la facture
			generateInvoice(invoiceData);
			console.log("Facture générée avec succès");
		} catch (error) {
			console.error("Erreur lors de la génération de la facture:", error);
			alert("Une erreur est survenue lors de la génération de la facture.");
		}
	};

	const handleNavigate = () => {
		navigate("/");
	};

	if (loading) {
		return <Loader text={"de vos commandes"} />;
	}

	if (orders.length === 0)
		return (
			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
						onClick={handleNavigate}
						className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
					>
						Découvrir nos produits
					</button>
				</div>
			</div>
		);

	return (
		<div>
			<div>
				<div className="mb-10">
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Mes commandes
					</h2>
					<h3 className="text-lg pl-1 font-semibold mt-4 -mb-4">
						Suivez l'état de vos {orders.length} commande
						{orders.length > 1 ? "s" : ""}
					</h3>
				</div>

				<div className="space-y-5 max-h-130 xl:max-h-200 overflow-y-auto scroll-smooth xl:mx-50">
					{orders.map((order) => {
						const status = statusMap[order.status];
						return (
							<div
								key={order.order_id}
								className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-300"
							>
								<div className="px-4 xl:px-8 pb-9 pt-4">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
										{/* Order Info */}
										<div className="flex-1 space-y-4 ">
											{/* Layout Desktop */}
											<div className="hidden xl:block">
												<div className="flex  justify-between">
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
															<div className="w-10 h-10 bg-linear-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center shrink-0">
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
														<button
															type="button"
															onClick={() => handleOrderClick(order)}
														>
															<p className="underline text-blue-700 font-semibold cursor-pointer">
																Facture
															</p>
														</button>
													</div>
												</div>
											</div>

											{/* Layout Mobile */}
											<div className="xl:hidden">
												<div className="flex">
													<div className="w-full">
														<div className="flex justify-between">
															<div>
																<p className="text-sm font-semibold">
																	Commande effectuée le{" "}
																</p>
																<p className="italic text-sm font-semibold">
																	{new Date(
																		order.created_at,
																	).toLocaleDateString("fr-FR", {
																		day: "numeric",
																		month: "long",
																		year: "numeric",
																	})}
																</p>
															</div>
															<div className="flex flex-col">
																<p className="text-sm font-semibold italic text-slate-800">
																	{order.reference}
																</p>
																<button
																	type="button"
																	onClick={() => handleOrderClick(order)}
																	className="text-end"
																>
																	<p className="underline text-blue-700 font-semibold cursor-pointer -mt-1">
																		Facture
																	</p>
																</button>
															</div>
														</div>

														<div className="flex justify-between mt-1">
															<div className="flex items-center gap-3 text-slate-600 mt-3">
																<div className="w-10 h-10 bg-linear-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center shrink-0">
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
															<div className="group/user relative mt-2 text-end">
																<p>Livraison à</p>

																{/* Nom cliquable / survolable */}
																<p className="font-semibold underline text-blue-700 cursor-pointer -mt-0.5">
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
													</div>
												</div>
											</div>

											<div className="space-y-3">
												{order.items?.map((item: OrderItem) => {
													console.log("item on map", item);

													const mainImage =
														item.article?.images?.find((img) => img.is_main) ??
														item.article?.images?.[0];

													return (
														<div key={item.article_id}>
															<div className="items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
																<div className="grid grid-cols-[4fr_2fr] xl:flex xl:justify-between items-center xl:gap-4 ">
																	<div className="flex">
																		<img
																			src={`${API_URL}${mainImage?.url}`}
																			alt={item.article?.name}
																			className="w-14 h-14 object-cover rounded-md border cursor-pointer"
																			onClick={() =>
																				navigate(
																					`/articles/${item.article?.type}/${item.article?.name}`,
																				)
																			}
																			onKeyUp={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					navigate(
																						`/articles/${item.article?.type}/${item.article?.name}`,
																					);
																				}
																			}}
																		/>
																		<div className="flex flex-col justify-center ml-2">
																			<p className="font-medium text-slate-800 text-xs xl:text-md">
																				{item.article?.name}
																			</p>
																			{item.size && (
																				<p className="text-sm text-slate-500">
																					Taille : {item.size}
																				</p>
																			)}
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
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>

								<div className="h-1 bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500"></div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
