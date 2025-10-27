import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../../api/Order";
import type { Order } from "../../../types/Order";
import type { User } from "../../../types/User";
import { useOrderActions } from "../../../utils/useOrderActions";
import Loader from "../Tools/Loader";
import { useSortableData } from "../Tools/useSortableData";
import OrderDetails from "./OrderDetails";
import UserDetails from "./UserDetails";

export default function OrderList() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [, setError] = useState("");
	const navigate = useNavigate();
	const { items: sortedOrders, requestSort } = useSortableData(orders);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const ordersData = await getOrders();
			setOrders(ordersData);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
		const interval = setInterval(fetchOrders, 30000);
		return () => clearInterval(interval);
	}, []);

	const {
		handleProcessingOrder,
		handleReadyOrder,
		handleShippedOrder,
		handleDeleteOrder,
	} = useOrderActions({ fetchOrders, setSelectedOrder });

	const handleNavigate = () => navigate("/");

	const statusImages: Record<string, string> = {
		paid: "/icons/invoice-check.svg",
		processing: "/icons/package.svg",
		ready: "/icons/package-check.svg",
		shipped: "/icons/delivery.svg",
		cancelled: "/icons/invoice-cancelled.svg",
	};

	if (loading) {
		return <Loader text={"des commandes client"} />;
	}

	if (!orders.length) {
		return (
			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<ShoppingBag className="w-10 h-10 text-purple-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-800 mb-3">
						Aucune commande clients
					</h2>
					<p className="text-slate-500 text-lg mb-6">
						Aucune commande clients n'a été effectuée pour le moment.
					</p>
					<button
						type="button"
						onClick={handleNavigate}
						className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
					>
						Retour à la page d'accueil
					</button>
				</div>
			</div>
		);
	}

	if (selectedUser) {
		return (
			<UserDetails
				user={selectedUser}
				orders={orders.filter((order) => order.user_id === selectedUser.userId)}
				onReturn={() => setSelectedUser(null)}
				onDeleteOrder={handleDeleteOrder}
				onProcessingOrder={handleProcessingOrder}
				onReadyOrder={handleReadyOrder}
				onShippedOrder={handleShippedOrder}
			/>
		);
	}

	if (selectedOrder) {
		return (
			<OrderDetails
				order={selectedOrder}
				onReturn={() => setSelectedOrder(null)}
				onDeleteOrder={handleDeleteOrder}
				onProcessingOrder={handleProcessingOrder}
				onReadyOrder={handleReadyOrder}
				onShippedOrder={handleShippedOrder}
			/>
		);
	}

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Commandes
			</h2>

			<div className="grid grid-cols-[3fr_2fr_2fr_2fr] bg-gray-300 mt-4 mb-2 text-sm">
				<button
					type="button"
					onClick={() => requestSort("reference")}
					className="cursor-pointer"
				>
					N° : REF ↓
				</button>
				<button
					type="button"
					onClick={() => requestSort("items")}
					className="text-center cursor-pointer"
				>
					NB.ART ↓
				</button>
				<button
					type="button"
					onClick={() => requestSort("status")}
					className="cursor-pointer"
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
						onClick={() => setSelectedOrder(order)}
					>
						<div className="grid grid-cols-[3fr_2fr_2fr_2fr] items-center h-12">
							<p className="pl-1 text-xs">{order.reference}</p>
							<p className="pl-1 text-xs text-center">
								{order.items.reduce((sum, item) => sum + item.quantity, 0)}
							</p>
							<div className="flex justify-center xl:justify-start xl:ml-15  gap-2">
								{order.status === "processing" && (
									<div className="hidden xl:block justify-center">
										<img
											src={"/icons/invoice-check.svg"}
											alt={order.status}
											className="w-7"
										/>
									</div>
								)}
								{order.status === "ready" && (
									<div className="hidden xl:flex justify-center gap-2">
										<img
											src={"/icons/invoice-check.svg"}
											alt={order.status}
											className="w-7"
										/>
										<img
											src={"/icons/package.svg"}
											alt={order.status}
											className="w-7"
										/>
									</div>
								)}
								{order.status === "shipped" && (
									<div className="hidden xl:flex justify-center gap-2">
										<img
											src={"/icons/invoice-check.svg"}
											alt={order.status}
											className="w-7"
										/>
										<img
											src={"/icons/package.svg"}
											alt={order.status}
											className="w-7"
										/>
										<img
											src={"/icons/package-check.svg"}
											alt={order.status}
											className="w-7"
										/>
									</div>
								)}
								<img
									src={
										statusImages[order.status as keyof typeof statusImages] ||
										"/icons/default.svg"
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
	);
}
