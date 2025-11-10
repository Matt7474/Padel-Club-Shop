"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminMessage = exports.sendUserMessage = exports.markMessagesReceiverAsRead = exports.markMessagesAsRead = exports.getUserMessages = exports.getAllUserMessages = void 0;
const sequelize_1 = require("sequelize");
const message_1 = require("../models/message");
const user_1 = require("../models/user");
// ---------------- Messages d'un utilisateur ----------------
const getAllUserMessages = async (_req, res) => {
    try {
        const messages = await message_1.Message.findAll({
            order: [["created_at", "ASC"]],
            include: [
                {
                    model: user_1.User,
                    as: "sender",
                    attributes: [
                        ["user_id", "id"],
                        "first_name",
                        "last_name",
                        "email",
                        "role_id",
                    ],
                },
                {
                    model: user_1.User,
                    as: "receiver",
                    attributes: [
                        ["user_id", "id"],
                        "first_name",
                        "last_name",
                        "email",
                        "role_id",
                    ],
                    required: false,
                },
            ],
        });
        await message_1.Message.update({ is_read: false }, {
            where: {
                is_read: false,
            },
        });
        return res.status(200).json(messages);
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.getAllUserMessages = getAllUserMessages;
// ---------------- Messages d'un utilisateur ----------------
const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            return res.status(400).json({ message: "Utilisateur manquant" });
        const messages = await message_1.Message.findAll({
            where: {
                [sequelize_1.Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
            },
            order: [["created_at", "ASC"]],
            include: [
                {
                    model: user_1.User,
                    as: "sender",
                    attributes: [
                        ["user_id", "id"],
                        "first_name",
                        "last_name",
                        "email",
                        "role_id",
                    ],
                },
                {
                    model: user_1.User,
                    as: "receiver",
                    attributes: [
                        ["user_id", "id"],
                        "first_name",
                        "last_name",
                        "email",
                        "role_id",
                    ],
                    required: false,
                },
            ],
        });
        await message_1.Message.update({ is_read: true }, {
            where: {
                receiver_id: userId,
                is_read: false,
            },
        });
        return res.status(200).json(messages);
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.getUserMessages = getUserMessages;
// ---------------- Marquer les messages comme lus ----------------
const markMessagesAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const senderId = Number(id);
        console.log("senderId reçu:", senderId);
        if (Number.isNaN(senderId)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const messagesToUpdate = await message_1.Message.findAll({
            where: { sender_id: senderId, is_read: false },
        });
        console.log("Messages à mettre à jour :", messagesToUpdate.length);
        console.log("Messages details:", messagesToUpdate.map((m) => ({
            id: m.id,
            sender_id: m.sender_id,
            is_read: m.is_read,
        })));
        const [updatedCount] = await message_1.Message.update({ is_read: true }, {
            where: {
                sender_id: senderId,
                is_read: false,
            },
        });
        return res.status(200).json({
            message: `${updatedCount} message(s) marqué(s) comme lu(s)`,
            count: updatedCount,
        });
    }
    catch (err) {
        console.error("Erreur:", err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.markMessagesAsRead = markMessagesAsRead;
const markMessagesReceiverAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const receiverId = Number(id);
        console.log("receiverId reçu:", receiverId);
        if (Number.isNaN(receiverId)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const messagesToUpdate = await message_1.Message.findAll({
            where: { receiver_id: receiverId, is_read: false },
        });
        console.log("Messages à mettre à jour :", messagesToUpdate.length);
        console.log("Messages details:", messagesToUpdate.map((m) => ({
            id: m.id,
            receiver_id: m.receiver_id,
            is_read: m.is_read,
        })));
        const [updatedCount] = await message_1.Message.update({ is_read: true }, {
            where: {
                receiver_id: receiverId,
                is_read: false,
            },
        });
        return res.status(200).json({
            message: `${updatedCount} message(s) marqué(s) comme lu(s)`,
            count: updatedCount,
        });
    }
    catch (err) {
        console.error("Erreur:", err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.markMessagesReceiverAsRead = markMessagesReceiverAsRead;
// ---------------- Envoyer un message utilisateur → admin ----------------
const sendUserMessage = async (req, res) => {
    try {
        const { sender_id, content } = req.body;
        if (!sender_id || !content?.trim())
            return res
                .status(400)
                .json({ message: "Champs manquants ou message vide" });
        // Récupérer tous les admins
        const ADMIN_ROLE_IDS = [1, 2];
        const admins = await user_1.User.findAll({
            where: { role_id: ADMIN_ROLE_IDS },
        });
        // Créer un message pour chaque admin
        const messages = await Promise.all(admins.map((admin) => message_1.Message.create({
            sender_id,
            receiver_id: admin.id,
            content,
            is_read: false,
        })));
        return res.status(201).json(messages); // renvoie un tableau de messages
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.sendUserMessage = sendUserMessage;
// ---------------- Envoyer un message adminS → utilisateur ----------------
const sendAdminMessage = async (req, res) => {
    try {
        const { admin_id, user_id, content } = req.body;
        if (!admin_id || !user_id || !content?.trim())
            return res
                .status(400)
                .json({ message: "Champs manquants ou message vide" });
        const message = await message_1.Message.create({
            sender_id: admin_id,
            receiver_id: user_id,
            content,
            is_read: false,
        });
        return res.status(201).json(message);
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Erreur inconnue",
        });
    }
};
exports.sendAdminMessage = sendAdminMessage;
