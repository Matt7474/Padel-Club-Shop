import { deleteOrder, updateOrderStatus } from "../api/Order";
import { useToastStore } from "../store/ToastStore ";

import type { Order } from "../types/Order";

interface UseOrderActionsProps {
	fetchOrders: () => void;
	setSelectedOrder: (order: Order | null) => void;
}

export function useOrderActions({
	fetchOrders,
	setSelectedOrder,
}: UseOrderActionsProps) {
	const addToast = useToastStore((state) => state.addToast);

	const updateStatus = async (
		id: number,
		status: "processing" | "ready" | "shipped",
	) => {
		try {
			const updatedOrder = await updateOrderStatus(id, status);
			console.log(`Commande mise à jour : ${status}`, updatedOrder);
			addToast(`La commande est maintenant ${status}`, "bg-green-500");
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, `La commande n'a pas changé de status`);
			addToast(`La commande n'a pas changé de status`, "bg-red-500");
		}
	};

	const handleProcessingOrder = (id: number) => updateStatus(id, "processing");
	const handleReadyOrder = (id: number) => updateStatus(id, "ready");
	const handleShippedOrder = (id: number) => updateStatus(id, "shipped");

	const handleDeleteOrder = async (id: number) => {
		try {
			await deleteOrder(id);
			console.log("Commande supprimée !");
			addToast("La commande a été supprimée", "bg-green-500");
			setSelectedOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err, "La commande n'a pas pu être supprimée");
			addToast("La commande n'a pas pu être supprimée", "bg-red-500");
		}
	};

	return {
		handleProcessingOrder,
		handleReadyOrder,
		handleShippedOrder,
		handleDeleteOrder,
	};
}
