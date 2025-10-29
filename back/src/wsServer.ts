import type http from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { Message } from "./models/message";
import { User } from "./models/user";

export function initWebSocketServer(server: http.Server) {
	const wss = new WebSocketServer({ server });

	// Map des utilisateurs connectés (userId -> WebSocket)
	const clients = new Map<number, WebSocket>();

	console.log("✅ WebSocket server ready");

	wss.on("connection", (ws) => {
		let currentUserId: number | null = null;

		ws.on("message", async (rawData) => {
			try {
				const message = JSON.parse(rawData.toString());

				// --- Connexion utilisateur ---
				if (message.type === "connect") {
					currentUserId = Number(message.userId);
					if (currentUserId) {
						clients.set(currentUserId, ws);
						// console.log(`🔌 Utilisateur ${currentUserId} connecté`);
					}
					return;
				}

				// --- Envoi d’un message ---
				if (message.type === "message") {
					const { senderId, receiverId, content } = message;

					if (!senderId || !content) {
						return ws.send(
							JSON.stringify({
								type: "error",
								message: "senderId et content requis",
							}),
						);
					}

					// --- Cas 1 : message direct (client ↔ client/admin spécifique) ---
					if (receiverId) {
						const newMsg = await Message.create({
							sender_id: senderId,
							receiver_id: receiverId,
							content,
							is_read: false,
						});

						const fullMsg = await Message.findByPk(newMsg.id, {
							include: [
								{
									model: User,
									as: "sender",
									attributes: ["user_id", "first_name", "last_name", "role_id"],
								},
								{
									model: User,
									as: "receiver",
									attributes: ["user_id", "first_name", "last_name", "role_id"],
									required: false,
								},
							],
						});

						// Envoi au client expéditeur
						if (ws.readyState === ws.OPEN) {
							ws.send(JSON.stringify({ type: "message", data: fullMsg }));
						}

						// Envoi au destinataire
						const targetWs = clients.get(receiverId);
						if (targetWs && targetWs.readyState === WebSocket.OPEN) {
							targetWs.send(JSON.stringify({ type: "message", data: fullMsg }));
							// console.log(`📨 Message envoyé à ${receiverId}`);
						}

						return;
					}

					// --- Cas 2 : message client → support (receiverId = null) ---
					const admins = await User.findAll({ where: { role_id: 1 } }); // rôle admin = 1
					const adminIds = admins.map((a) => a.user_id);

					for (const adminId of adminIds) {
						// On crée un message distinct par admin pour pouvoir tracker la lecture individuellement
						const newMsg = await Message.create({
							sender_id: senderId,
							receiver_id: adminId,
							content,
							is_read: false,
						});

						const fullMsg = await Message.findByPk(newMsg.id, {
							include: [
								{
									model: User,
									as: "sender",
									attributes: ["user_id", "first_name", "last_name", "role_id"],
								},
								{
									model: User,
									as: "receiver",
									attributes: ["user_id", "first_name", "last_name", "role_id"],
									required: false,
								},
							],
						});

						// Envoi aux admins connectés
						const adminWs = clients.get(adminId);
						if (adminWs && adminWs.readyState === WebSocket.OPEN) {
							adminWs.send(JSON.stringify({ type: "message", data: fullMsg }));
							// console.log(`📨 Message broadcasté à l'admin ${adminId}`);
						}
					}

					// --- Renvoi au client pour affichage instantané ---
					const clientMsg = await Message.create({
						sender_id: senderId,
						receiver_id: null,
						content,
						is_read: false,
					});

					const clientFullMsg = await Message.findByPk(clientMsg.id, {
						include: [
							{
								model: User,
								as: "sender",
								attributes: ["user_id", "first_name", "last_name", "role_id"],
							},
							{
								model: User,
								as: "receiver",
								attributes: ["user_id", "first_name", "last_name", "role_id"],
								required: false,
							},
						],
					});

					if (ws.readyState === ws.OPEN) {
						ws.send(JSON.stringify({ type: "message", data: clientFullMsg }));
					}
				}
			} catch (err) {
				console.error("❌ Erreur WebSocket (handler):", err);
				try {
					ws.send(
						JSON.stringify({
							type: "error",
							message: "Erreur interne WebSocket (voir serveur)",
						}),
					);
				} catch {}
			}
		});

		ws.on("close", () => {
			if (currentUserId) {
				clients.delete(currentUserId);
				console.log(`❎ Utilisateur ${currentUserId} déconnecté`);
			}
		});
	});
}
