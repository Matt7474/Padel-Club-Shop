// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

interface WSMessageData {
	// type "connect"
	userId?: number;

	// type "message"
	conversationId?: number;
	content?: string;
	senderId?: number;
}

interface WSMessage {
	type: "connect" | "message";
	data?: WSMessageData;
}
export function useWebSocket(userId: number) {
	const ws = useRef<WebSocket | null>(null);
	const [messages, setMessages] = useState<WSMessage[]>([]);

	useEffect(() => {
		const WS_URL =
			import.meta.env.MODE === "development"
				? "ws://localhost:3000"
				: "wss://pcs-api.matt-dev.fr";

		// ouverture
		ws.current = new WebSocket(WS_URL);

		ws.current.onopen = () => {
			console.log("WebSocket connecté");

			ws.current?.send(
				JSON.stringify({
					type: "connect",
					userId,
				}),
			);
		};

		// message entrant
		ws.current.onmessage = (event) => {
			const message: WSMessage = JSON.parse(event.data);

			setMessages((prev) => {
				if (
					message.data?.conversationId &&
					prev.some(
						(m) =>
							m.data?.conversationId === message.data?.conversationId &&
							m.data?.content === message.data?.content &&
							m.data?.senderId === message.data?.senderId,
					)
				) {
					return prev;
				}

				return [...prev, message];
			});
		};

		ws.current.onclose = () => {
			console.log("WebSocket déconnecté");
		};

		ws.current.onerror = (err) => {
			console.error("WebSocket erreur", err);
		};

		return () => {
			ws.current?.close();
		};
	}, [userId]);

	const sendMessage = (conversationId: number, content: string) => {
		ws.current?.send(
			JSON.stringify({
				type: "message",
				conversationId,
				content,
				senderId: userId,
			}),
		);
	};

	return { messages, sendMessage };
}
