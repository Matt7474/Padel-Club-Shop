import argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UniqueConstraintError } from "sequelize";
import { Address } from "../models/adress";
import { Role } from "../models/role";
import { User } from "../models/user";
import { registerSchema } from "../schemas/registerSchema";
import type { AddressInput } from "../types/UserType";
import { sanitizeInput } from "../utils/sanitize";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_dev";

// controller register avec joi & sanit ok
export async function registerUser(req: Request, res: Response) {
	console.log("🔥 registerUserDebug called");

	try {
		// 1️⃣ Validation Joi
		console.log("Validating input...");
		const { error, value } = registerSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			const messages = error.details.map((d) => d.message);
			console.log("Validation errors:", messages);
			return res.status(400).json({ error: messages });
		}
		console.log("Validation passed:", value);

		// 2️⃣ Nettoyage des champs string

		const first_name = sanitizeInput(value.first_name);
		const last_name = sanitizeInput(value.last_name);
		const email = sanitizeInput(value.email).toLowerCase();
		const phone = value.phone ? sanitizeInput(value.phone) : null;

		console.log({ first_name, last_name, email, phone });

		// 3️⃣ Vérifier si email existe déjà
		console.log("Checking if email exists...");
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			console.log("Email already exists:", email);
			return res
				.status(400)
				.json({ error: "Cette adresse e-mail est déjà enregistrée." });
		}
		console.log("Email is free");

		// 4️⃣ Récupérer le rôle client
		console.log("Fetching role 'client'...");
		const role = await Role.findOne({ where: { label: "client" } });
		if (!role) {
			console.log("Role 'client' not found");
			return res.status(500).json({ error: "Rôle 'client' introuvable" });
		}
		console.log("Role found:", role.label);

		// 5️⃣ Hasher le mot de passe
		console.log("Hashing password...");
		const hashedPassword = await argon2.hash(value.password);
		console.log("Password hashed");

		// 6️⃣ Créer l'utilisateur
		const formattedLastName = last_name.toUpperCase();
		const formattedFirstName = first_name
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");
		console.log("Creating user...");
		const user = await User.create({
			last_name: formattedLastName,
			first_name: formattedFirstName,
			email,
			phone,
			password: hashedPassword,
			role_id: 3,
		});
		console.log("User created:", user.user_id);

		// 7️⃣ Créer les adresses
		const createAddress = async (
			addr: AddressInput,
			type: "shipping" | "billing",
		) => {
			if (!addr) return;
			console.log(`Creating ${type} address...`, addr);
			const _address = await Address.create({
				user_id: user.user_id,
				type,
				street_number: sanitizeInput(addr.street_number),
				street_name: sanitizeInput(addr.street_name),
				complement: addr.additional_info
					? sanitizeInput(addr.additional_info)
					: null,
				zip_code: sanitizeInput(addr.zipcode),
				city: sanitizeInput(addr.city),
				country: sanitizeInput(addr.country),
				is_default: type === "shipping",
			});
		};

		await createAddress(value.shipping_address, "shipping");
		await createAddress(value.billing_address, "billing");

		// 8️⃣ Générer le token JWT
		console.log("Generating JWT...");
		const token = jwt.sign(
			{ id: user.user_id, email: user.email, role: role.label },
			JWT_SECRET,
			{
				expiresIn: "24h",
			},
		);
		console.log("JWT generated");

		return res.status(201).json({
			message: "Utilisateur créé avec succès",
			user: {
				id: user.user_id,
				first_name,
				last_name,
				email,
				role: role.label,
			},
			token,
		});
	} catch (error) {
		console.error("❌ Error creating user:", error);

		if (error instanceof UniqueConstraintError) {
			return res
				.status(400)
				.json({ error: "Cette adresse e-mail est déjà enregistrée." });
		}

		return res
			.status(500)
			.json({ error: "Erreur lors de la création du compte." });
	}
}

export async function loginUser(req: Request, res: Response) {
	const { email, password } = req.body;

	try {
		// 1️⃣ Vérifie si l'utilisateur existe
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ error: "Adresse e-mail non trouvée" });
		}

		// 2️⃣ Vérifie le mot de passe (comparaison hashée)
		const isPasswordValid = await argon2.verify(user.password, password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Mot de passe incorrect" });
		}

		// 3️⃣ Récupère le rôle pour le token (optionnel mais utile)
		const role = await Role.findByPk(user.role_id);

		// 4️⃣ Génère le token JWT
		const token = jwt.sign(
			{
				id: user.user_id,
				email: user.email,
				role: role ? role.label : "client",
			},
			JWT_SECRET,
			{ expiresIn: "24h" },
		);

		// 5️⃣ Réponse au client
		return res.status(200).json({
			message: "Connexion réussie ✅",
			user: {
				id: user.user_id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				phone: user.phone,
				role: role ? role.label : null,
			},
			token,
		});
	} catch (error) {
		console.error("❌ Erreur de connexion :", error);
		return res
			.status(500)
			.json({ error: "Erreur interne lors de la connexion" });
	}
}

export const requestResetPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body as { email: string };
		if (!email) {
			return res.status(400).json({ message: "Email requis." });
		}

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(200).json({
				message:
					"Si cet email existe, un lien de réinitialisation a été envoyé.",
			});
		}

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT_SECRET manquant dans les variables d'environnement");
		}

		const token = jwt.sign({ email: user.email }, jwtSecret, {
			expiresIn: "1h",
		});

		// ✅ Ajouter l'email dans l'URL
		const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(user.email)}&token=${token}`;

		await sendResetPasswordEmail(user.email, resetLink);

		res.status(200).json({
			message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
		});
	} catch (error: unknown) {
		console.error("❌ Erreur requestResetPassword:", error);
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Erreur serveur lors de la demande de réinitialisation.",
			});
		}
	}
};

export const sendResetPasswordEmail = async (
	email: string,
	resetLink: string,
) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_PORT) || 465,
		secure: process.env.EMAIL_SECURE === "true",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: `"Padel Club Shop Support" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Réinitialisation de votre mot de passe",
		html: `
      <p>Bonjour,</p>
      <p>Pour réinitialiser votre mot de passe, cliquez ici :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans une heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce mail.</p>
    `,
	});
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token, password } = req.body as {
			token: string;
			password: string;
		};

		if (!token || !password) {
			return res.status(400).json({ message: "Données manquantes." });
		}

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			return res
				.status(500)
				.json({ message: "Configuration serveur manquante." });
		}

		let decoded: { email: string };
		try {
			decoded = jwt.verify(token, jwtSecret) as { email: string };
		} catch {
			return res.status(400).json({ message: "Lien invalide ou expiré." });
		}

		const user = await User.findOne({ where: { email: decoded.email } });
		if (!user) {
			return res.status(400).json({ message: "Utilisateur introuvable." });
		}

		const hashedPassword = await argon2.hash(password);

		await user.update({ password: hashedPassword });

		res.status(200).json({
			message: "Mot de passe mis à jour avec succès.",
		});
	} catch (error: unknown) {
		console.error("❌ Erreur resetPassword:", error);
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "Erreur serveur inattendue." });
		}
	}
};
