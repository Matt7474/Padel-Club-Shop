// src/wsServer.ts
import type http from "node:http";
import type WebSocket from "ws";
import { WebSocketServer } from "ws";

export function initWebSocketServer(server: http.Server) {
	const wss = new WebSocketServer({ server });

	// Tableau pour garder la trace des connexions
	const clients: Map<number, WebSocket> = new Map(); // userId => ws

	wss.on("connection", (ws, _req) => {
		console.log("Nouvelle connexion WebSocket");

		// Ici tu pourrais récupérer l'userId depuis un token JWT ou query param
		let userId: number | null = null;

		ws.on("message", (data) => {
			try {
				const message = JSON.parse(data.toString());
				if (message.type === "connect") {
					userId = message.userId;
					if (!userId) {
						return;
					}
					clients.set(userId, ws);
					console.log(`Utilisateur ${userId} connecté`);
				} else if (message.type === "message") {
					// message: { conversationId, content, senderId }
					broadcastMessage(message);
				}
			} catch (err) {
				console.error("Erreur WebSocket:", err);
			}
		});

		ws.on("close", () => {
			if (userId) clients.delete(userId);
			console.log(`Utilisateur ${userId} déconnecté`);
		});
	});

	function broadcastMessage(msg: {
		conversationId: number;
		content: string;
		senderId: number;
	}) {
		// envoyer à tous les participants de la conversation (exemple simplifié)
		clients.forEach((clientWs) => {
			clientWs.send(JSON.stringify({ type: "message", data: msg }));
		});
	}

	console.log("WebSocket server ready");
}
