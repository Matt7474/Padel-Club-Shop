import { deleteOrder, updateOrderStatus } from "../api/Order";
import { useToastStore } from "../store/ToastStore ";

import type { Order } from "../types/Order";

interface UseOrderActionsProps {
	fetchOrders: () => void;
	setSelectedOrder: (order: Order | null) => void;
	reference?: string;
}

export function useOrderActions({
	fetchOrders,
	setSelectedOrder,
	reference,
}: UseOrderActionsProps) {
	const addToast = useToastStore((state) => state.addToast);

	const statusFR: Record<"processing" | "ready" | "shipped", string> = {
		processing: "en cours de préparation",
		ready: "prête",
		shipped: "expédiée",
	};

	const updateStatus = async (
		id: number,
		status: "processing" | "ready" | "shipped",
	) => {
		try {
			const updatedOrder = await updateOrderStatus(id, status);
			console.log(`Commande mise à jour : ${status}`, updatedOrder);
			addToast(
				`La commande ${reference} est maintenant ${statusFR[status]}`,
				"bg-green-500",
			);
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande ${reference} n'a pas changé de status`);
			addToast(
				`La commande ${reference} n'a pas changé de status`,
				"bg-red-500",
			);
		}
	};

	const handleProcessingOrder = (id: number) => updateStatus(id, "processing");
	const handleReadyOrder = (id: number) => updateStatus(id, "ready");
	const handleShippedOrder = (id: number) => updateStatus(id, "shipped");

	const handleDeleteOrder = async (id: number) => {
		try {
			await deleteOrder(id);
			console.log("Commande supprimée !");
			addToast(`La commande ${reference} a été supprimée`, "bg-green-500");
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande ${reference} n'a pas pu être supprimée`);
			addToast(
				`La commande ${reference} n'a pas pu être supprimée`,
				"bg-red-500",
			);
		}
	};

	const handleCancelProcessing = async (id: number) => {
		try {
			await updateOrderStatus(id, "paid");
			console.log("Status de commande annulée !");
			addToast(
				`La commande ${reference} est revenue au status "payé`,
				"bg-green-500",
			);
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande ${reference} n'a pas pu être modifiée`);
			addToast(
				`La commande ${reference} n'a pas pu être modifiée`,
				"bg-red-500",
			);
		}
	};
	const handleCancelReady = async (id: number) => {
		try {
			await updateOrderStatus(id, "processing");
			console.log("Status de commande modifié !");
			addToast(
				`La commande ${reference} est revenue au status "en cours de préparation"`,
				"bg-green-500",
			);
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande ${reference} n'a pas pu être modifié`);
			addToast(
				`La commande ${reference} n'a pas pu être modifié`,
				"bg-red-500",
			);
		}
	};
	const handleCancelOrder = async (id: number) => {
		try {
			await updateOrderStatus(id, "cancelled");
			console.log("Status de commande modifié !");
			addToast(`La commande ${reference} a été annulée`, "bg-green-500");
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande ${reference} n'a pas pu être annulée`);
			addToast(
				`La commande ${reference} n'a pas pu être annulée`,
				"bg-red-500",
			);
		}
	};

	return {
		handleProcessingOrder,
		handleReadyOrder,
		handleShippedOrder,
		handleDeleteOrder,
		handleCancelProcessing,
		handleCancelReady,
		handleCancelOrder,
	};
}
