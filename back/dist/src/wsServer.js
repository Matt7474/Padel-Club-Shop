"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocketServer = initWebSocketServer;
const ws_1 = require("ws");
const message_1 = require("./models/message");
const user_1 = require("./models/user");
function initWebSocketServer(server) {
    const wss = new ws_1.WebSocketServer({ server });
    // Map des utilisateurs connectés (userId -> WebSocket)
    const clients = new Map();
    console.log("✅ WebSocket server ready");
    wss.on("connection", (ws) => {
        let currentUserId = null;
        ws.on("message", async (rawData) => {
            try {
                const message = JSON.parse(rawData.toString());
                // console.log("📩 Message reçu:", message);
                // --- Connexion utilisateur ---
                if (message.type === "connect") {
                    currentUserId = Number(message.userId);
                    if (currentUserId) {
                        clients.set(currentUserId, ws);
                        // console.log(`🔌 Utilisateur ${currentUserId} connecté`);
                        // ✅ Envoyer une confirmation de connexion
                        ws.send(JSON.stringify({
                            type: "connected",
                            userId: currentUserId,
                        }));
                    }
                    return;
                }
                // --- Envoi d'un message ---
                if (message.type === "message") {
                    const { senderId, receiverId, content } = message;
                    // console.log(
                    // 	`💬 Tentative d'envoi: senderId=${senderId}, receiverId=${receiverId}`,
                    // );
                    if (!senderId || !content) {
                        console.error("❌ Données manquantes");
                        return ws.send(JSON.stringify({
                            type: "error",
                            message: "senderId et content requis",
                        }));
                    }
                    // --- Cas 1 : Message admin → client spécifique (receiverId fourni) ---
                    if (receiverId) {
                        // console.log("📤 Message direct");
                        await handleDirectMessage(ws, senderId, receiverId, content, clients);
                        return;
                    }
                    // --- Cas 2 : Message client → support (receiverId = null) ---
                    console.log("📤 Message support");
                    await handleSupportMessage(ws, senderId, content, clients);
                }
            }
            catch (err) {
                console.error("❌ Erreur WebSocket (handler):", err);
                try {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: err instanceof Error ? err.message : "Erreur inconnue",
                    }));
                }
                catch (sendErr) {
                    console.error("❌ Impossible d'envoyer l'erreur au client:", sendErr);
                }
            }
        });
        ws.on("error", (error) => {
            console.error("❌ WebSocket erreur:", error);
        });
        ws.on("close", () => {
            if (currentUserId) {
                clients.delete(currentUserId);
                console.log(`❎ Utilisateur ${currentUserId} déconnecté`);
            }
        });
    });
}
// ✅ Fonction pour gérer les messages directs (admin → client)
async function handleDirectMessage(senderWs, senderId, receiverId, content, clients) {
    try {
        // console.log(`📝 Création message: ${senderId} → ${receiverId}`);
        // Créer le message en BDD
        const newMsg = await message_1.Message.create({
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            is_read: false,
        });
        // console.log(`✅ Message créé avec ID: ${newMsg.id}`);
        // Récupérer le message complet avec les relations
        const fullMsg = await message_1.Message.findByPk(newMsg.id, {
            include: [
                {
                    model: user_1.User,
                    as: "sender",
                    attributes: ["user_id", "first_name", "last_name", "role_id"],
                },
                {
                    model: user_1.User,
                    as: "receiver",
                    attributes: ["user_id", "first_name", "last_name", "role_id"],
                    required: false,
                },
            ],
        });
        if (!fullMsg) {
            console.error("❌ Message introuvable après création");
            return;
        }
        // console.log("📦 Message complet récupéré:", fullMsg.id);
        // Envoi à l'expéditeur (pour affichage instantané)
        if (senderWs.readyState === ws_1.WebSocket.OPEN) {
            senderWs.send(JSON.stringify({ type: "message", data: fullMsg }));
            // console.log(`✅ Message envoyé à l'expéditeur ${senderId}`);
        }
        else {
            console.warn(`⚠️ WebSocket de l'expéditeur ${senderId} fermé`);
        }
        // Envoi au destinataire (s'il est connecté)
        const targetWs = clients.get(receiverId);
        if (targetWs && targetWs.readyState === ws_1.WebSocket.OPEN) {
            targetWs.send(JSON.stringify({ type: "message", data: fullMsg }));
            // console.log(`✅ Message direct envoyé au destinataire ${receiverId}`);
        }
        else {
            // console.log(`ℹ️ Destinataire ${receiverId} non connecté`);
        }
    }
    catch (err) {
        console.error("❌ Erreur dans handleDirectMessage:", err);
        throw err;
    }
}
// ✅ Fonction pour gérer les messages client → support
async function handleSupportMessage(senderWs, senderId, content, clients) {
    try {
        // console.log(`📝 Message support de ${senderId}`);
        // Récupérer tous les admins (role_id = 1)
        const admins = await user_1.User.findAll({ where: { role_id: 1 } });
        if (admins.length === 0) {
            console.warn("⚠️ Aucun admin trouvé pour recevoir le message");
            if (senderWs.readyState === ws_1.WebSocket.OPEN) {
                senderWs.send(JSON.stringify({
                    type: "error",
                    message: "Aucun admin disponible",
                }));
            }
            return;
        }
        // console.log(`👥 ${admins.length} admin(s) trouvé(s)`);
        let firstMessage = null; // Pour renvoyer au client
        // Créer un message pour chaque admin
        for (const admin of admins) {
            const newMsg = await message_1.Message.create({
                sender_id: senderId,
                receiver_id: admin.user_id,
                content,
                is_read: false,
            });
            // console.log(
            // 	`✅ Message créé pour admin ${admin.user_id}, ID: ${newMsg.id}`,
            // );
            const fullMsg = await message_1.Message.findByPk(newMsg.id, {
                include: [
                    {
                        model: user_1.User,
                        as: "sender",
                        attributes: ["user_id", "first_name", "last_name", "role_id"],
                    },
                    {
                        model: user_1.User,
                        as: "receiver",
                        attributes: ["user_id", "first_name", "last_name", "role_id"],
                        required: false,
                    },
                ],
            });
            // Garder le premier message pour le client
            if (!firstMessage && fullMsg) {
                firstMessage = fullMsg;
            }
            // Envoyer aux admins connectés
            const adminWs = clients.get(admin.user_id);
            if (adminWs && adminWs.readyState === ws_1.WebSocket.OPEN) {
                adminWs.send(JSON.stringify({ type: "message", data: fullMsg }));
                // console.log(`✅ Message support envoyé à l'admin ${admin.user_id}`);
            }
            else {
                // console.log(`ℹ️ Admin ${admin.user_id} non connecté`);
            }
        }
        // ✅ Renvoyer AU CLIENT le premier message créé
        if (senderWs.readyState === ws_1.WebSocket.OPEN && firstMessage) {
            senderWs.send(JSON.stringify({ type: "message", data: firstMessage }));
            // console.log(`✅ Message support renvoyé au client ${senderId}`);
        }
        else {
            console.warn(`⚠️ Impossible de renvoyer le message au client ${senderId}`);
        }
    }
    catch (err) {
        console.error("❌ Erreur dans handleSupportMessage:", err);
        throw err;
    }
}
