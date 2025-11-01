// src/components/NotificationProvider.tsx
import { useEffect } from "react";
import { useNotificationStore } from "../../store/useNotificationStore";

export default function NotificationProvider() {
	const fetchNotifications = useNotificationStore(
		(state) => state.fetchNotifications,
	);

	useEffect(() => {
		fetchNotifications(); // fetch direct au montage
		const interval = setInterval(fetchNotifications, 10000); // toutes les 10s
		return () => clearInterval(interval);
	}, [fetchNotifications]);

	return null; // ne render rien
}
