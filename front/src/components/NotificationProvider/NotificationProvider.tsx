import { useEffect } from "react";
import { useNotificationStore } from "../../store/useNotificationStore";

export default function NotificationProvider() {
	const fetchNotifications = useNotificationStore(
		(state) => state.fetchNotifications,
	);

	useEffect(() => {
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 10000);
		return () => clearInterval(interval);
	}, [fetchNotifications]);

	return null;
}
