import type { Request, Response } from "express";

import { User } from "../models/user";
import { Address } from "../models/adress";

export const getAllUsers = async (_req: Request, res: Response) => {
	try {
		const users = await User.findAll({
			// attributes: { exclude: ["password"] },
			order: [["created_at", "DESC"]],
		});

		if (!users || users.length === 0) {
			return res.status(404).json({ message: "Aucun utilisateur trouvé." });
		}

		res.status(200).json(users);
	} catch (error) {
		console.error("Erreur getAllUsers:", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération des utilisateurs.",
		});
	}
};

export const getUserById = async (req: Request, res: Response) => {
	console.log("dans getUserById");
	const { id } = req.params;
	console.log("id", id);

	try {
		const user = await User.findByPk(id, {
			attributes: { exclude: ["password"] },
			include: [
				{
					model: Address,
					as: "addresses",
				},
			],
		});

		if (!user) {
			return res.status(404).json({ message: "Aucun utilisateur trouvé." });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Erreur getUserById:", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération de l'utilisateur.",
		});
	}
};

export const updateUser = async (req: Request, res: Response) => {
	console.log("➡️ Dans updateUser");
	const { id } = req.params;
	const { first_name, last_name, email, phone, addresses } = req.body;

	console.log("📦 Données reçues:", {
		id,
		first_name,
		last_name,
		email,
		phone,
		addresses,
	});

	try {
		const user = await User.findByPk(id, {
			include: [{ model: Address, as: "addresses" }],
		});

		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé." });
		}

		console.log("👤 Utilisateur trouvé:", user.user_id);
		console.log("🏠 Adresses existantes:", user.addresses);

		// 🧩 Mise à jour des champs utilisateur
		await user.update({
			first_name: first_name ?? user.first_name,
			last_name: last_name ?? user.last_name,
			email: email ?? user.email,
			phone: phone ?? user.phone,
		});

		console.log("✅ Utilisateur mis à jour");

		// 🏠 Gestion des adresses (shipping + billing)
		if (addresses && addresses.length > 0) {
			const existingAddresses = user.addresses || [];
			console.log("🔍 Adresses à traiter:", addresses);
			console.log("🔍 Adresses existantes:", existingAddresses);

			for (const addressData of addresses) {
				console.log("🏷️ Traitement adresse type:", addressData.type);

				// Chercher si l'adresse existe déjà (par type)
				const existingAddress = existingAddresses.find(
					(addr: any) => addr.type === addressData.type,
				);

				if (existingAddress) {
					console.log(
						"♻️ Mise à jour adresse existante:",
						existingAddress.address_id,
					);
					// Mise à jour de l'adresse existante
					await existingAddress.update({
						street_number: addressData.street_number,
						street_name: addressData.street_name,
						zip_code: addressData.zip_code,
						city: addressData.city,
						country: addressData.country,
						complement: addressData.complement,
					});
					console.log("✅ Adresse mise à jour");
				} else {
					console.log("➕ Création nouvelle adresse");
					// Création d'une nouvelle adresse
					await Address.create({
						type: addressData.type,
						street_number: addressData.street_number,
						street_name: addressData.street_name,
						zip_code: addressData.zip_code,
						city: addressData.city,
						country: addressData.country,
						complement: addressData.complement,
						user_id: user.user_id, // 🔥 Utilise user.user_id au lieu de id
					});
					console.log("✅ Adresse créée");
				}
			}

			// Supprimer l'adresse de facturation si elle n'est plus dans addresses
			const billingInRequest = addresses.some(
				(addr: any) => addr.type === "billing",
			);
			if (!billingInRequest) {
				const existingBilling = existingAddresses.find(
					(addr: any) => addr.type === "billing",
				);
				if (existingBilling) {
					console.log("🗑️ Suppression adresse billing");
					await existingBilling.destroy();
				}
			}
		}

		// 🔁 On recharge l'utilisateur complet (avec adresses)
		const updatedUser = await User.findByPk(id, {
			attributes: { exclude: ["password"] },
			include: [{ model: Address, as: "addresses" }],
		});

		console.log("🎉 Profil final:", updatedUser);

		res.status(200).json({
			message: "Utilisateur mis à jour avec succès.",
			user: updatedUser,
		});
	} catch (error) {
		console.error("❌ Erreur updateUser:", error);
		res.status(500).json({
			message: "Erreur serveur lors de la mise à jour de l'utilisateur.",
		});
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé." });
		}

		await user.destroy();
		res.status(200).json({ message: "Compte supprimé avec succès." });
	} catch (error) {
		console.error("❌ Erreur deleteUser:", error);
		res.status(500).json({ message: "Erreur serveur lors de la suppression." });
	}
};
