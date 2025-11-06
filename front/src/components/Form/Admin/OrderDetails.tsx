import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refundOrder } from "../../../api/Order";
import { getAllUsers } from "../../../api/User";
import { useToastStore } from "../../../store/ToastStore ";
import type { Order } from "../../../types/Order";
import type { UserApiResponse } from "../../../types/User";
import ConfirmModal from "../../Modal/ConfirmModal";
import BackButton from "../Tools/BackButton";
import Button from "../Tools/Button";
import Loader from "../Tools/Loader";

interface OrderDetailsProps {
	order: Order;
	onReturn: () => void;
	onDeleteOrder?: (orderId: number) => void;
	onProcessingOrder?: (orderId: number) => void;
	onReadyOrder?: (orderId: number) => void;
	onShippedOrder?: (orderId: number) => void;
	fromUserDetails?: boolean;
	fetchOrders?: () => void;
	onCancelProcessing?: (orderId: number) => void;
	onCancelReady?: (orderId: number) => void;
	onCancelOrder?: (orderId: number) => void;
}

export default function OrderDetails({
	order,
	onReturn,
	onDeleteOrder,
	onProcessingOrder,
	onReadyOrder,
	onShippedOrder,
	onCancelProcessing,
	onCancelReady,
	onCancelOrder,
	fetchOrders,
}: OrderDetailsProps) {
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();
	const addToast = useToastStore((state) => state.addToast);

	const [showRefundConfirm, setShowRefundConfirm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showProcessingConfirm, setShowProcessingConfirm] = useState(false);
	const [showReadyConfirm, setShowReadyConfirm] = useState(false);
	const [showShippedConfirm, setShowShippedConfirm] = useState(false);
	const [, setShowRefundButton] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [showCancelProcessing, setShowCancelProcessing] = useState(false);
	const [showCancelReady, setShowCancelReady] = useState(false);
	const [, setError] = useState("");
	const [users, setUsers] = useState<UserApiResponse[]>([]);
	const [loading, setLoading] = useState(false);

	const [canClick, setCanClick] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		timerRef.current = setTimeout(() => {
			setCanClick(true);
		}, 5000);
	};

	const handleMouseLeave = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setCanClick(false);
	};

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const usersData = await getAllUsers();
			setUsers(usersData);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const orderUser = users.find((user) => user.user_id === order.user_id);

	const statusImages: Record<string, string> = {
		paid: "/icons/invoice-check.svg",
		processing: "/icons/package.svg",
		ready: "/icons/package-check.svg",
		shipped: "/icons/delivery.svg",
		cancelled: "/icons/invoice-cancelled.svg",
		refund: "/icons/invoice-refund.svg",
	};

	const statusFr: Record<string, string> = {
		paid: "Payée",
		processing: "En préparation",
		ready: "Prête",
		shipped: "Expédiée",
		cancelled: "Annulée",
		refund: "Remboursé",
	};

	const TVA_RATE = 0.2;
	const FREE_SHIPPING_THRESHOLD = 69;
	const SHIPPING_FEE = 6.9;

	// Total articles
	const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

	// Total TTC des articles
	const totalTTC = order.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	// Frais de livraison
	const shippingCost = totalTTC >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

	// Total global
	const total = totalTTC + shippingCost;

	// Total HT
	const totalHT = (totalTTC / (1 + TVA_RATE)).toFixed(2);

	// Gestion des boutons d’action
	const handleConfirmDelete = () => {
		onDeleteOrder?.(order.order_id);
		setShowDeleteConfirm(false);
	};

	const handleConfirmProcessing = () => {
		onProcessingOrder?.(order.order_id);
		setShowProcessingConfirm(false);
	};

	const handleConfirmReady = () => {
		onReadyOrder?.(order.order_id);
		setShowReadyConfirm(false);
	};

	const handleConfirmShipped = () => {
		onShippedOrder?.(order.order_id);
		setShowShippedConfirm(false);
	};

	const handleConfirmCancelProcessing = () => {
		onCancelProcessing?.(order.order_id);
		setShowCancelProcessing(false);
	};

	const handleConfirmCancelReady = () => {
		onCancelReady?.(order.order_id);
		setShowCancelReady(false);
	};

	const handleCancelOrder = () => {
		onCancelOrder?.(order.order_id);
		setShowCancelConfirm(false);
		setShowRefundButton(true);
	};

	const handleRefund = async () => {
		try {
			await refundOrder(order.order_id);
			addToast("Commande remboursée avec succès !", "bg-green-500");
			setShowRefundConfirm(false);
			fetchOrders?.();
			onReturn();
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "La commande n'a pas pu être remboursée";
			addToast(`Erreur : ${message}`, "bg-red-500");
			setShowRefundConfirm(false);
		}
	};

	if (loading) {
		<Loader text={"des informations"} />;
	}

	return (
		<div>
			<BackButton onClick={onReturn} />

			<div className="mx-auto px-3 py-6">
				<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
					<div className="p-4">
						<div className="flex justify-between items-center mb-6 pb-4">
							<p className="text-sm font-semibold text-gray-800">
								{order.reference}
							</p>
							<div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:brightness-90">
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

						<div className="grid grid-cols-[2fr_4fr_5fr_1fr] xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 mb-3 pb-2 border-b border-gray-300 text-center">
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
									className="grid grid-cols-[2fr_4fr_5fr_1fr] xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] text-center gap-4 items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
										{item.price ? (item.price / 1.2).toFixed(2) : "N/A"} €
									</p>
									<p className="text-sm font-semibold text-gray-900 hidden xl:block">
										{item.price ?? "N/A"} €
									</p>
								</div>
							);
						})}

						{/* display Mobile */}
						<div className="xl:hidden mt-4 grid gap-y-1">
							<div className="flex justify-end mr-2">
								<p className="text-sm uppercase w-3/4 text-end">
									Total article
								</p>
								<p className="text-sm uppercase w-1/4 text-end">{totalQty}</p>
							</div>
							<div className="flex justify-end mr-2">
								<p className="text-sm uppercase w-3/4 text-end">
									Sous Total HT
								</p>
								<p className="text-sm uppercase w-1/4 text-end">{totalHT} €</p>
							</div>
							<div className="flex justify-end mr-2">
								<p className="text-sm uppercase w-3/4 text-end">
									SOUS TOTAL TTC
								</p>
								<p className="text-sm uppercase w-1/4 text-end">
									{totalTTC.toFixed(2)} €
								</p>
							</div>
							<div className="flex justify-end mr-2">
								<p className="text-sm uppercase w-3/4 text-end">LIVRAISON</p>
								<p className="text-sm uppercase w-1/4 text-end">
									{shippingCost.toFixed(2)} €
								</p>
							</div>
							<div className="flex justify-end mr-2">
								<p className="text-sm uppercase w-3/4 text-end font-semibold">
									TOTAL
								</p>
								<p className="text-sm uppercase w-1/4 text-end font-semibold">
									{total.toFixed(2)} €
								</p>
							</div>
						</div>

						{/* display Desktop */}
						<div className="hidden xl:block">
							<div className="grid xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 pb-2 text-center mt-4">
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="text-sm uppercase">Total article</p>
								<p>{totalQty}</p>
							</div>

							<div className="grid xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 pb-2 text-center mt-1">
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="text-sm uppercase">Sous total HT</p>
								<p>{totalHT} €</p>
							</div>

							<div className="grid xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 pb-2 text-center mt-1">
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="text-sm uppercase">SOUS TOTAL TTC</p>
								<p>{totalTTC.toFixed(2)} €</p>
							</div>

							<div className="grid xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 pb-2 text-center mt-1">
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="text-sm uppercase">Livraison</p>
								<p>{shippingCost.toFixed(2)} €</p>
							</div>

							<div className="grid xl:grid-cols-[2fr_5fr_2fr_1fr_2fr_2fr] gap-4 pb-2 text-center mt-1">
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="hidden xl:block"></p>
								<p className="text-sm uppercase font-bold">TOTAL TTC</p>
								<p className="font-bold">{total.toFixed(2)} €</p>
							</div>
						</div>

						<div className="mt-6 pt-4">
							{/* status payé */}
							{order.status === "paid" && (
								<div className="flex justify-around gap-4">
									{/* <button
										type="button"
										onClick={() => setShowDeleteConfirm(true)}
										className="bg-red-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										ANNULER LA COMMANDE
									</button> */}
									<button
										type="button"
										onClick={() => setShowProcessingConfirm(true)}
										className="bg-green-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										PREPARER LA COMMANDE
									</button>
								</div>
							)}
							{/* status en préparation */}
							{order.status === "processing" && (
								<div className="flex justify-around gap-4">
									<button
										type="button"
										onClick={() => setShowCancelProcessing(true)}
										className="bg-red-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										ANNULER LA PREPARATION DE COMMANDE
									</button>
									{/* <button
										type="button"
										onClick={() => setShowDeleteConfirm(true)}
										className="bg-red-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										ANNULER LA COMMANDE
									</button> */}
									<button
										type="button"
										onClick={() => setShowReadyConfirm(true)}
										className="bg-green-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										COMMANDE PRETE
									</button>
								</div>
							)}
							{/* status en prête */}
							{order.status === "ready" && (
								<div className="flex justify-around gap-4">
									<button
										type="button"
										onClick={() => setShowCancelReady(true)}
										className="bg-red-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										REVENIR AU A LA PREPRARATION DE LA COMMANDE
									</button>
									{/* <button
										type="button"
										onClick={() => setShowDeleteConfirm(true)}
										className="bg-red-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										ANNULER LA COMMANDE
									</button> */}
									<button
										type="button"
										onClick={() => setShowShippedConfirm(true)}
										className="bg-green-500 p-2 rounded-lg font-semibold text-white cursor-pointer text-sm xl:text-md w-1/2 xl:w-1/4"
									>
										COMMANDE EXPEDIEE
									</button>
								</div>
							)}
							{/* Modal suppression */}
							{showDeleteConfirm && (
								<ConfirmModal
									message="Voulez-vous vraiment annuler cette commande ?"
									onConfirm={handleConfirmDelete}
									onCancel={() => setShowDeleteConfirm(false)}
								/>
							)}
							{/* Modal confirmation de preparation */}
							{showProcessingConfirm && (
								<ConfirmModal
									message="Voulez-vous passer cette commande en préparation ?"
									onConfirm={handleConfirmProcessing}
									onCancel={() => setShowProcessingConfirm(false)}
								/>
							)}
							{/* Modal confirmation de commande prete */}
							{showReadyConfirm && (
								<ConfirmModal
									message="Voulez-vous rendre cette commande prête ?"
									onConfirm={handleConfirmReady}
									onCancel={() => setShowReadyConfirm(false)}
								/>
							)}
							{/* Modal confirmation de commande expédiée */}
							{showShippedConfirm && (
								<ConfirmModal
									message="Voulez-vous rendre cette commande expédiée ?"
									onConfirm={handleConfirmShipped}
									onCancel={() => setShowShippedConfirm(false)}
								/>
							)}

							{/* Modal confirmation de modification de status de "praparation" => "payée" */}
							{showCancelProcessing && (
								<ConfirmModal
									message="Voulez-vous annuler la préparation de cette commande ?"
									onConfirm={handleConfirmCancelProcessing}
									onCancel={() => setShowCancelProcessing(false)}
								/>
							)}
							{/* Modal confirmation de modification de status de "prete" => "praparation" */}
							{showCancelReady && (
								<ConfirmModal
									message="Voulez-vous revenir à la préparation de cette commande ?"
									onConfirm={handleConfirmCancelReady}
									onCancel={() => setShowCancelReady(false)}
								/>
							)}
						</div>
					</div>

					{/* Bordure gradient qui épouse l'arrondi grâce à overflow-hidden sur le parent */}
					<div className="h-1 bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500"></div>
				</div>
				<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-6">
					<div className="p-4">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Informations client
						</h3>

						{orderUser ? (
							<>
								{/* Desktop */}
								<div className="hidden xl:grid xl:grid-cols-5 gap-20 text-sm text-gray-700">
									<div className=" flex flex-col justify-between">
										<div className="flex justify-between">
											<p>{orderUser.last_name}</p>
										</div>
										<div className="flex justify-between">
											<p>{orderUser.first_name}</p>
										</div>

										<div className="flex justify-between">
											<p>{orderUser.email}</p>
										</div>

										<div className="flex justify-between">
											<p>{orderUser.phone}</p>
										</div>

										{/* <div className="flex justify-between">
											<p>
												{orderUser.addresses?.[0].street_number ??
													"Non renseignée"}
											</p>
										</div> */}
									</div>
									<div>
										<p className="font-medium">Adresse :</p>

										<div className="flex justify-between">
											<p>
												{orderUser.addresses[0].street_number}{" "}
												{orderUser.addresses[0].street_name}
											</p>
										</div>

										<div className="flex justify-between">
											<p>
												{orderUser.addresses[0].zip_code}{" "}
												{orderUser.addresses[0].city}
											</p>
										</div>

										<div className="flex justify-between">
											<p>
												{orderUser.addresses?.[0].country ?? "Non renseignée"}
											</p>
										</div>
									</div>
									<div>
										<p className="font-medium">Complément d'information :</p>
										{orderUser.addresses?.[0].complement ?? "Non renseignée"}
									</div>
									<div></div>

									{["paid", "processing", "ready", "shipped"].includes(
										order.status,
									) && (
										<div>
											<Button
												type="button"
												onClick={() => setShowCancelConfirm(true)}
												buttonText="ANNULER LA COMMANDE"
												bgColor="bg-red-500"
											/>
										</div>
									)}
									{order.status === "cancelled" && (
										<div>
											<p className="-mb-4 font-semibold text-center">
												Effectuez un remboursement ?
											</p>
											<div>
												<Button
													type="button"
													onClick={() => canClick && setShowRefundConfirm(true)}
													onMouseEnter={handleMouseEnter}
													onMouseLeave={handleMouseLeave}
													buttonText={
														canClick
															? "REMBOURSEMENT"
															: "Survolez 5s pour activer"
													}
													bgColor="bg-red-500"
												/>
											</div>
										</div>
									)}
									{order.status === "refund" && (
										<div>
											<p>Remboursement effectué le : </p>
											<p>
												{new Intl.DateTimeFormat("fr-FR", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												}).format(new Date(order.refunded_at))}
											</p>
										</div>
									)}
									{/* {order.status === "shipped" && (
										<div>Remboursement impossible apres expédition</div>
									)} */}
								</div>

								{/* Mobile */}
								<div className="xl:hidden grid gap-y-2 text-sm text-gray-700">
									<div className="flex justify-between">
										<p className="font-medium">Nom & Prénom</p>
										<span>
											{orderUser.first_name} {orderUser.last_name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium">Email</span>
										<span>{orderUser.email}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium">Téléphone</span>
										<span>{orderUser.phone}</span>
									</div>
									<div className="mt-2">
										<div className="border-t  border-gray-200 "></div>
										<div className="font-medium mt-2">Adresse</div>
										<div className="mt-2">
											<div>
												<span>
													{orderUser.addresses?.[0].street_number ??
														"Non renseignée"}
												</span>
												<span className="ml-2">
													{orderUser.addresses?.[0].street_name ??
														"Non renseignée"}
												</span>
											</div>
											<div>
												<span>
													{orderUser.addresses?.[0].zip_code ??
														"Non renseignée"}
												</span>
												<span className="ml-2">
													{orderUser.addresses?.[0].city ?? "Non renseignée"}
												</span>
											</div>
											<div>
												<span>
													{orderUser.addresses?.[0].country ?? "Non renseignée"}
												</span>
											</div>
											<div>
												<div className="font-medium mt-4">
													Informations complémentaires
												</div>
												<div className="mt-2">
													<span>
														{orderUser.addresses?.[0].complement ??
															"Non renseignée"}
													</span>
												</div>
											</div>
											{order.status !== "cancelled" && (
												<div>
													<Button
														type="button"
														onClick={() =>
															canClick && setShowRefundConfirm(true)
														}
														onMouseEnter={handleMouseEnter}
														onMouseLeave={handleMouseLeave}
														buttonText={
															canClick
																? "REMBOURSEMENT"
																: "Survolez 5s pour activer"
														}
													/>
												</div>
											)}

											{order.status === "refund" && (
												<div>
													<p>Remboursement effectué le : </p>
													<p>
														{new Intl.DateTimeFormat("fr-FR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														}).format(new Date(order.refunded_at))}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</>
						) : (
							<p className="text-gray-500 text-sm italic">
								Aucun utilisateur associé à cette commande.
							</p>
						)}
					</div>

					<div className="h-1 bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500"></div>
				</div>
				{showRefundConfirm && (
					<ConfirmModal
						message="Voulez-vous vraiment rembourser cette commande ?"
						onConfirm={handleRefund}
						onCancel={() => setShowRefundConfirm(false)}
					/>
				)}

				{showCancelConfirm && (
					<ConfirmModal
						message="Voulez-vous vraiment annuler cette commande ?"
						onConfirm={handleCancelOrder}
						onCancel={() => setShowCancelConfirm(false)}
					/>
				)}
			</div>
		</div>
	);
}
