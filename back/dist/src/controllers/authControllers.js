"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendResetPasswordEmail = exports.requestResetPassword = void 0;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sequelize_1 = require("sequelize");
const adress_1 = require("../models/adress");
const role_1 = require("../models/role");
const user_1 = require("../models/user");
const registerSchema_1 = require("../schemas/registerSchema");
const sanitize_1 = require("../utils/sanitize");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key_dev";
// controller register avec joi & sanit ok
async function registerUser(req, res) {
    console.log("🔥 registerUserDebug called");
    try {
        // 1️⃣ Validation Joi
        console.log("Validating input...");
        const { error, value } = registerSchema_1.registerSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const messages = error.details.map((d) => d.message);
            console.log("Validation errors:", messages);
            return res.status(400).json({ error: messages });
        }
        console.log("Validation passed:", value);
        // 2️⃣ Nettoyage des champs string
        const first_name = (0, sanitize_1.sanitizeInput)(value.first_name);
        const last_name = (0, sanitize_1.sanitizeInput)(value.last_name);
        const email = (0, sanitize_1.sanitizeInput)(value.email).toLowerCase();
        const phone = value.phone ? (0, sanitize_1.sanitizeInput)(value.phone) : null;
        console.log({ first_name, last_name, email, phone });
        // 3️⃣ Vérifier si email existe déjà
        console.log("Checking if email exists...");
        const existingUser = await user_1.User.findOne({ where: { email } });
        if (existingUser) {
            console.log("Email already exists:", email);
            return res
                .status(400)
                .json({ error: "Cette adresse e-mail est déjà enregistrée." });
        }
        console.log("Email is free");
        // 4️⃣ Récupérer le rôle client
        console.log("Fetching role 'client'...");
        const role = await role_1.Role.findOne({ where: { label: "client" } });
        if (!role) {
            console.log("Role 'client' not found");
            return res.status(500).json({ error: "Rôle 'client' introuvable" });
        }
        console.log("Role found:", role.label);
        // 5️⃣ Hasher le mot de passe
        console.log("Hashing password...");
        const hashedPassword = await argon2_1.default.hash(value.password);
        console.log("Password hashed");
        // 6️⃣ Créer l'utilisateur
        const formattedLastName = last_name.toUpperCase();
        const formattedFirstName = first_name
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        console.log("Creating user...");
        const user = await user_1.User.create({
            last_name: formattedLastName,
            first_name: formattedFirstName,
            email,
            phone,
            password: hashedPassword,
            role_id: 3,
        });
        console.log("User created:", user.user_id);
        // 7️⃣ Créer les adresses
        const createAddress = async (addr, type) => {
            if (!addr)
                return;
            console.log(`Creating ${type} address...`, addr);
            const _address = await adress_1.Address.create({
                user_id: user.user_id,
                type,
                street_number: (0, sanitize_1.sanitizeInput)(addr.street_number),
                street_name: (0, sanitize_1.sanitizeInput)(addr.street_name),
                complement: addr.additional_info
                    ? (0, sanitize_1.sanitizeInput)(addr.additional_info)
                    : null,
                zip_code: (0, sanitize_1.sanitizeInput)(addr.zipcode),
                city: (0, sanitize_1.sanitizeInput)(addr.city),
                country: (0, sanitize_1.sanitizeInput)(addr.country),
                is_default: type === "shipping",
            });
        };
        await createAddress(value.shipping_address, "shipping");
        await createAddress(value.billing_address, "billing");
        // 8️⃣ Générer le token JWT
        console.log("Generating JWT...");
        const token = jsonwebtoken_1.default.sign({ id: user.user_id, email: user.email, role: role.label }, JWT_SECRET, {
            expiresIn: "24h",
        });
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
    }
    catch (error) {
        console.error("❌ Error creating user:", error);
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return res
                .status(400)
                .json({ error: "Cette adresse e-mail est déjà enregistrée." });
        }
        return res
            .status(500)
            .json({ error: "Erreur lors de la création du compte." });
    }
}
async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        // 1️⃣ Vérifie si l'utilisateur existe
        const user = await user_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Adresse e-mail non trouvée" });
        }
        // 2️⃣ Vérifie le mot de passe (comparaison hashée)
        const isPasswordValid = await argon2_1.default.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }
        // 3️⃣ Récupère le rôle pour le token (optionnel mais utile)
        const role = await role_1.Role.findByPk(user.role_id);
        // 4️⃣ Génère le token JWT
        const token = jsonwebtoken_1.default.sign({
            id: user.user_id,
            email: user.email,
            role: role ? role.label : "client",
        }, JWT_SECRET, { expiresIn: "24h" });
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
    }
    catch (error) {
        console.error("❌ Erreur de connexion :", error);
        return res
            .status(500)
            .json({ error: "Erreur interne lors de la connexion" });
    }
}
const requestResetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email requis." });
        }
        const user = await user_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(200).json({
                message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET manquant dans les variables d'environnement");
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, jwtSecret, {
            expiresIn: "1h",
        });
        // ✅ Ajouter l'email dans l'URL
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(user.email)}&token=${token}`;
        await (0, exports.sendResetPasswordEmail)(user.email, resetLink);
        res.status(200).json({
            message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
        });
    }
    catch (error) {
        console.error("❌ Erreur requestResetPassword:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Erreur serveur lors de la demande de réinitialisation.",
            });
        }
    }
};
exports.requestResetPassword = requestResetPassword;
const sendResetPasswordEmail = async (email, resetLink) => {
    const transporter = nodemailer_1.default.createTransport({
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
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Données manquantes." });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res
                .status(500)
                .json({ message: "Configuration serveur manquante." });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch {
            return res.status(400).json({ message: "Lien invalide ou expiré." });
        }
        const user = await user_1.User.findOne({ where: { email: decoded.email } });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur introuvable." });
        }
        const hashedPassword = await argon2_1.default.hash(password);
        await user.update({ password: hashedPassword });
        res.status(200).json({
            message: "Mot de passe mis à jour avec succès.",
        });
    }
    catch (error) {
        console.error("❌ Erreur resetPassword:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erreur serveur inattendue." });
        }
    }
};
exports.resetPassword = resetPassword;
