"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRole = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const argon2_1 = __importDefault(require("argon2"));
const adress_1 = require("../models/adress");
const user_1 = require("../models/user");
const getAllUsers = async (_req, res) => {
    try {
        const users = await user_1.User.findAll({
            // attributes: { exclude: ["password"] },
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: adress_1.Address,
                    as: "addresses",
                },
            ],
        });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé." });
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Erreur getAllUsers:", error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des utilisateurs.",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    console.log("dans getUserById");
    const { id } = req.params;
    console.log("id", id);
    try {
        const user = await user_1.User.findByPk(id, {
            // attributes: { exclude: ["password"] },
            include: [
                {
                    model: adress_1.Address,
                    as: "addresses",
                },
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Erreur getUserById:", error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération de l'utilisateur.",
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, addresses, password } = req.body;
    try {
        const user = await user_1.User.findByPk(id, {
            include: [{ model: adress_1.Address, as: "addresses" }],
        });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        const hashedPassword = password
            ? await argon2_1.default.hash(password)
            : undefined;
        // 🧩 Mise à jour des champs utilisateur
        await user.update({
            first_name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            email: email ?? user.email,
            phone: phone ?? user.phone,
            ...(hashedPassword && { password: hashedPassword }),
        });
        // 🏠 Gestion des adresses (shipping + billing)
        if (addresses && addresses.length > 0) {
            const existingAddresses = user.addresses || [];
            console.log("🔍 Adresses à traiter:", addresses);
            console.log("🔍 Adresses existantes:", existingAddresses);
            for (const addressData of addresses) {
                console.log("🏷️ Traitement adresse type:", addressData.type);
                // Chercher si l'adresse existe déjà (par type)
                const existingAddress = existingAddresses.find((addr) => addr.type === addressData.type);
                if (existingAddress) {
                    console.log("♻️ Mise à jour adresse existante:", existingAddress.address_id);
                    // Mise à jour de l'adresse existante
                    await existingAddress.update({
                        street_number: addressData.street_number,
                        street_name: addressData.street_name,
                        zip_code: addressData.zip_code,
                        city: addressData.city,
                        country: addressData.country,
                        complement: addressData.complement,
                    });
                }
                else {
                    // Création d'une nouvelle adresse
                    await adress_1.Address.create({
                        type: addressData.type,
                        street_number: addressData.street_number,
                        street_name: addressData.street_name,
                        zip_code: addressData.zip_code,
                        city: addressData.city,
                        country: addressData.country,
                        complement: addressData.complement,
                        user_id: user.user_id,
                    });
                }
            }
            // Supprimer l'adresse de facturation si elle n'est plus dans addresses
            const billingInRequest = addresses.some((addr) => addr.type === "billing");
            if (!billingInRequest) {
                const existingBilling = existingAddresses.find((addr) => addr.type === "billing");
                if (existingBilling) {
                    console.log("🗑️ Suppression adresse billing");
                    await existingBilling.destroy();
                }
            }
        }
        // 🔁 On recharge l'utilisateur complet (avec adresses)
        const updatedUser = await user_1.User.findByPk(id, {
            attributes: { exclude: ["password"] },
            include: [{ model: adress_1.Address, as: "addresses" }],
        });
        console.log("🎉 Profil final:", updatedUser);
        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("❌ Erreur updateUser:", error);
        res.status(500).json({
            message: "Erreur serveur lors de la mise à jour de l'utilisateur.",
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await user_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        await user.destroy();
        res.status(200).json({ message: "Compte supprimé avec succès." });
    }
    catch (error) {
        console.error("❌ Erreur deleteUser:", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression." });
    }
};
exports.deleteUser = deleteUser;
const changeUserRole = async (req, res) => {
    console.log("➡️ Dans changeUserRole");
    const { id } = req.params;
    const { roleId } = req.body;
    console.log("id =", id);
    console.log("roleId =", roleId);
    try {
        const user = await user_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        // 🧩 Mise à jour des champs utilisateur
        await user.update({
            role_id: roleId,
        });
        console.log("✅ Utilisateur mis à jour");
        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
        });
    }
    catch (error) {
        console.error("❌ Erreur updateUser:", error);
        res.status(500).json({
            message: "Erreur serveur lors de la mise à jour de l'utilisateur.",
        });
    }
};
exports.changeUserRole = changeUserRole;
