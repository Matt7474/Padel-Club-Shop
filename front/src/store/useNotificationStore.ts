// src/store/notificationStore.ts
import { create } from "zustand";
import { getArticles } from "../api/Article";
import { getMessagesForm } from "../api/Contact";
import { getAllUserMessages } from "../api/Message";
import { getOrders } from "../api/Order";
import type { IClientMessageForm, Message } from "../types/Messages";
import type { Order } from "../types/Order";

interface NotificationState {
	unreadMessageCount: number;
	unreadFormCount: number;
	lowStockCount: number;
	orderPaid: number;
	messages: Message[];
	fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
	unreadMessageCount: 0,
	unreadFormCount: 0,
	lowStockCount: 0,
	orderPaid: 0,
	messages: [],
	fetchNotifications: async () => {
		try {
			const [articles, orders, messagesFromApi, formMessagesRes] =
				await Promise.all([
					getArticles(),
					getOrders(),
					getAllUserMessages(),
					getMessagesForm(),
				]);

			// Low stock
			let lowStock = 0;
			for (const article of articles) {
				let totalStock = 0;

				if (typeof article.stock_quantity === "number") {
					totalStock = article.stock_quantity;
				} else if (
					typeof article.stock_quantity === "object" &&
					article.stock_quantity
				) {
					totalStock = Object.values(article.stock_quantity)
						.map((val) => val ?? 0) // remplace undefined par 0
						.reduce((acc, val) => acc + val, 0);
				}

				if (totalStock < 5) lowStock++;
			}

			// Paid orders
			const ordersPaid = orders.filter(
				(o: Order) => o.status === "paid",
			).length;

			// Messages
			const messagesParsed: Message[] = messagesFromApi.map((m) => ({
				...m,
				created_at: new Date(m.created_at),
				updated_at: new Date(m.updated_at),
			}));
			const unreadMessages = messagesParsed.filter((m) => !m.is_read).length;

			// Form messages
			const unreadForm = formMessagesRes.data.filter(
				(m: IClientMessageForm) => m.is_read === false,
			).length;

			set({
				lowStockCount: lowStock,
				orderPaid: ordersPaid,
				messages: messagesParsed,
				unreadMessageCount: unreadMessages,
				unreadFormCount: unreadForm,
			});
		} catch (err) {
			console.error("Erreur fetch notifications:", err);
		}
	},
}));
