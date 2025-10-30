import argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UniqueConstraintError } from "sequelize";
import { Address } from "../models/adress";
import { Role } from "../models/role";
import { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_dev";

export async function registerUser(req: Request, res: Response) {
	const {
		last_name,
		first_name,
		phone,
		email,
		password,
		shipping_address,
		billing_address,
	} = req.body;

	try {
		// 1️⃣ Vérifier le rôle par défaut
		const role = await Role.findOne({ where: { label: "client" } });
		if (!role)
			return res.status(500).json({ error: "Rôle 'client' introuvable" });

		// 2️⃣ Hasher le mot de passe avant création
		const hashedPassword = await argon2.hash(password);

		// 3️⃣ Créer l'utilisateur
		const user = await User.create({
			last_name,
			first_name,
			phone,
			email,
			password: hashedPassword,
			role_id: 3,
		});

		// 4️⃣ Créer les adresses associées
		if (shipping_address) {
			await Address.create({
				user_id: user.user_id,
				type: "shipping",
				street_number: shipping_address.street_number,
				street_name: shipping_address.street_name,
				complement: shipping_address.additional_info,
				zip_code: shipping_address.zipcode,
				city: shipping_address.city,
				country: shipping_address.country,
				is_default: true,
			});
		}

		if (billing_address) {
			await Address.create({
				user_id: user.user_id,
				type: "billing",
				street_number: billing_address.street_number,
				street_name: billing_address.street_name,
				complement: billing_address.additional_info,
				zip_code: billing_address.zipcode,
				city: billing_address.city,
				country: billing_address.country,
			});
		}

		// 5️⃣ Générer un token JWT pour l'utilisateur
		const token = jwt.sign(
			{
				id: user.user_id,
				email: user.email,
				role: role.label,
			},
			JWT_SECRET,
			{ expiresIn: "24h" },
		);

		return res.status(201).json({
			message: "Utilisateur créé avec succès",
			user: {
				id: user.user_id,
				last_name,
				first_name,
				email,
				role: role.label,
			},
			token,
		});
	} catch (error) {
		console.error("❌ Erreur création utilisateur :", error);

		// 6️⃣ Gestion spécifique du doublon email
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
