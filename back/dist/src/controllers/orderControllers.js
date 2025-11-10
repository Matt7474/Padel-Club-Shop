"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundOrder = exports.updateOrderStatus = exports.deleteOrderById = exports.getAllOrders = exports.getMyOrders = exports.createOrderAndUpdateStock = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../database/db");
const article_1 = require("../models/article");
const articleImage_1 = require("../models/articleImage");
const order_1 = require("../models/order");
const orderItem_1 = require("../models/orderItem");
const user_1 = require("../models/user");
const mailer_1 = require("../services/mailer");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createOrderAndUpdateStock = async (req, res) => {
    try {
        const { userId, cart, paymentIntentId } = req.body;
        if (!userId || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Utilisateur ou panier invalide",
            });
        }
        const order = await db_1.sequelize.transaction(async (t) => {
            const now = new Date();
            const tempRef = `TMP-${now.getTime()}`; // référence temporaire
            // 1️⃣ Crée la commande avec référence temporaire
            const newOrder = await order_1.Order.create({
                user_id: userId,
                total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                reference: tempRef,
                payment_intent_id: paymentIntentId,
            }, { transaction: t });
            // 2️⃣ Crée les OrderItems et décrémente le stock
            for (const item of cart) {
                const article = await article_1.Article.findByPk(item.id, {
                    attributes: [
                        "article_id",
                        "name",
                        "stock_quantity",
                        "tech_characteristics",
                        "price_ttc",
                    ],
                    transaction: t,
                    lock: t.LOCK.UPDATE, // Verrouillage pour éviter les conditions de concurrence
                });
                if (!article)
                    throw new Error(`Article introuvable : ${item.id}`);
                // Normalise le nom de la propriété size (accepte "size" ou "selectedSize")
                const selectedSize = item.selectedSize || item.size;
                // --- Gestion article avec tailles ---
                if (article.tech_characteristics?.fit) {
                    // Si l'article a des tailles, on DOIT avoir une taille sélectionnée
                    if (!selectedSize) {
                        throw new Error(`Veuillez sélectionner une taille pour ${article.name}`);
                    }
                    let fitMap = {};
                    // Parse si fit est une string
                    if (typeof article.tech_characteristics.fit === "string") {
                        article.tech_characteristics.fit.split(",").forEach((pair) => {
                            const [label, qty] = pair.split(":");
                            fitMap[label.trim()] = Number(qty);
                        });
                    }
                    else if (typeof article.tech_characteristics.fit === "object") {
                        fitMap = { ...article.tech_characteristics.fit };
                    }
                    const sizeStock = fitMap[selectedSize] ?? 0;
                    if (sizeStock < item.quantity) {
                        throw new Error(`Stock insuffisant pour ${article.name} (${selectedSize}). Disponible: ${sizeStock}, demandé: ${item.quantity}`);
                    }
                    // Décrémente le stock de cette taille avec Math.max pour éviter valeurs négatives
                    const newSizeStock = Math.max(0, sizeStock - item.quantity);
                    fitMap[selectedSize] = newSizeStock;
                    // Met à jour le JSONB - utilise une copie pour forcer la détection du changement
                    const fitString = Object.entries(fitMap)
                        .map(([label, qty]) => `${label}:${qty}`)
                        .join(",");
                    const updatedCharacteristics = {
                        ...article.tech_characteristics,
                        fit: fitString,
                    };
                    await article.update({
                        tech_characteristics: updatedCharacteristics,
                        updated_at: new Date(),
                    }, { transaction: t });
                }
                // --- Gestion article sans tailles ---
                else {
                    const stockQty = article.stock_quantity ?? 0;
                    if (stockQty < item.quantity) {
                        throw new Error(`Stock insuffisant pour ${article.name}. Disponible: ${stockQty}, demandé: ${item.quantity}`);
                    }
                    // Utilise Math.max pour éviter valeurs négatives
                    const newQuantity = Math.max(0, stockQty - item.quantity);
                    await article.update({
                        stock_quantity: newQuantity,
                        updated_at: new Date(),
                    }, { transaction: t });
                }
                // --- Création OrderItem (UNE SEULE FOIS) ---
                await orderItem_1.OrderItem.create({
                    order_id: newOrder.order_id,
                    article_id: item.id,
                    quantity: item.quantity,
                    price: item.price ?? article.price_ttc, // <-- ici on prend le prix promo si fourni
                    size: selectedSize ?? null,
                }, { transaction: t });
            }
            // 3️⃣ Génère la vraie référence maintenant que order_id existe
            const ref = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(newOrder.order_id).padStart(3, "0")}`;
            await newOrder.update({ reference: ref, updated_at: new Date() }, { transaction: t });
            // 4️⃣ Envoie le mail avec la vraie référence
            const user = await user_1.User.findByPk(userId);
            if (user) {
                await (0, mailer_1.sendMail)({
                    to: user.email,
                    subject: `Votre commande ${ref} a été confirmée`,
                    html: `
		<!DOCTYPE html>
		<html lang="fr">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Confirmation de commande</title>
		</head>
		<body style="font-family: Arial, sans-serif; margin:0; padding:0;">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center">
						<table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin:20px 0; padding:20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
							<tr>
								<td align="center" style="padding-bottom: 20px;">
									<h1 style="color: #333;">Merci pour votre commande !</h1>
								</td>
							</tr>
							<tr>
								<td>
									<p style="font-size: 16px; color: #555;">Bonjour ${user.first_name || ""},</p>
									<p style="font-size: 16px; color: #555;">
										Nous avons bien reçu votre commande. Voici les détails :
									</p>
									<table width="100%" cellpadding="5" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
										<tr>
											<td style="font-weight: bold; border-bottom: 1px solid #ddd;">Référence :</td>
											<td style="border-bottom: 1px solid #ddd;">${ref}</td>
										</tr>
										<tr>
											<td style="font-weight: bold; border-bottom: 1px solid #ddd;">Montant total :</td>
											<td style="border-bottom: 1px solid #ddd;">${newOrder.total_amount} €</td>
										</tr>
										<tr>
											<td style="font-weight: bold; border-bottom: 1px solid #ddd;">Statut :</td>
											<td style="border-bottom: 1px solid #ddd;">En cours de préparation</td>
										</tr>
									</table>
									<p style="font-size: 16px; color: #555;">
										Nous préparons votre commande et vous tiendrons informé dès son expédition.
									</p>
									<p style="font-size: 16px; color: #555;">Merci de votre confiance,<br/><strong>L'équipe de PCS</strong></p>
								</td>
							</tr>
							<tr>
								<td align="center" style="padding-top: 20px; font-size: 12px; color: #999;">
									<p>© ${new Date().getFullYear()} PCS. Tous droits réservés.</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
		</html>
		`,
                });
            }
            return newOrder;
        });
        return res.status(200).json({
            status: "ok",
            message: "Commande créée et stock mis à jour",
            order,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Erreur création commande :", err.message);
            return res.status(500).json({ status: "error", message: err.message });
        }
        else {
            console.error("Erreur inconnue création commande :", err);
            return res.status(500).json({
                status: "error",
                message: "Erreur serveur lors de la création de la commande",
            });
        }
    }
};
exports.createOrderAndUpdateStock = createOrderAndUpdateStock;
const getMyOrders = async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId)
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        console.log("userId", userId);
        const orders = await order_1.Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: orderItem_1.OrderItem,
                    as: "items",
                    attributes: ["quantity", "price", "size"],
                    include: [
                        {
                            model: article_1.Article,
                            as: "article",
                            attributes: [
                                "article_id",
                                "name",
                                "reference",
                                "type",
                                "price_ttc",
                            ],
                            include: [
                                {
                                    model: articleImage_1.ArticleImage,
                                    as: "images",
                                    attributes: ["url", "is_main"],
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [
                ["created_at", "DESC"],
                [
                    { model: orderItem_1.OrderItem, as: "items" },
                    { model: article_1.Article, as: "article" },
                    { model: articleImage_1.ArticleImage, as: "images" },
                    "is_main",
                    "DESC",
                ],
                [
                    { model: orderItem_1.OrderItem, as: "items" },
                    { model: article_1.Article, as: "article" },
                    { model: articleImage_1.ArticleImage, as: "images" },
                    "image_id",
                    "ASC",
                ],
            ],
            attributes: [
                "order_id",
                "reference",
                "total_amount",
                "status",
                "created_at",
            ],
        });
        res.status(200).json({ orders });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des commandes",
        });
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (_req, res) => {
    try {
        const orders = await order_1.Order.findAll({
            include: [
                {
                    model: orderItem_1.OrderItem,
                    as: "items",
                    attributes: ["quantity", "price", "size"],
                    include: [
                        {
                            model: article_1.Article,
                            as: "article",
                            attributes: [
                                "article_id",
                                "name",
                                "reference",
                                "type",
                                "price_ttc",
                            ],
                            include: [
                                {
                                    model: articleImage_1.ArticleImage,
                                    as: "images",
                                    attributes: ["url", "is_main"],
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [
                ["created_at", "DESC"],
                [
                    { model: orderItem_1.OrderItem, as: "items" },
                    { model: article_1.Article, as: "article" },
                    { model: articleImage_1.ArticleImage, as: "images" },
                    "is_main",
                    "DESC",
                ],
                [
                    { model: orderItem_1.OrderItem, as: "items" },
                    { model: article_1.Article, as: "article" },
                    { model: articleImage_1.ArticleImage, as: "images" },
                    "image_id",
                    "ASC",
                ],
            ],
            attributes: [
                "order_id",
                "reference",
                "total_amount",
                "status",
                "user_id",
                "created_at",
                "updated_at",
                "is_deleted",
                "payment_intent_id",
                "refund_id",
                "refunded_at",
            ],
        });
        res.status(200).json({ orders });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des commandes",
        });
    }
};
exports.getAllOrders = getAllOrders;
const deleteOrderById = async (req, res) => {
    console.log("Dans le controller deleteOrderById");
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID de commande manquant dans la requête." });
        }
        const order = await order_1.Order.findByPk(Number(id));
        if (!order) {
            return res.status(404).json({ error: "Commande non trouvée." });
        }
        order.is_deleted = true;
        await order.save();
        return res.status(200).json({
            message: `Commande ${id} marquée comme supprimée avec succès.`,
            deletedOrder: order,
        });
    }
    catch (err) {
        console.error("❌ Erreur lors de la suppression :", err);
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Erreur serveur lors de la suppression de la commande.",
                error: err.message,
            });
        }
        return res.status(500).json({
            message: "Erreur inconnue lors de la suppression de la commande.",
        });
    }
};
exports.deleteOrderById = deleteOrderById;
const updateOrderStatus = async (req, res) => {
    console.log("➡️  Dans le controller updateOrderStatus");
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID de commande manquant." });
        }
        if (!status) {
            return res.status(400).json({ message: "Statut manquant." });
        }
        const allowedStatuses = [
            "paid",
            "processing",
            "ready",
            "shipped",
            "cancelled",
            "refund",
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Statut '${status}' invalide. Valeurs autorisées : ${allowedStatuses.join(", ")}.`,
            });
        }
        const order = (await order_1.Order.findByPk(Number(id), {
            include: [{ model: user_1.User, as: "user" }],
        }));
        order.status = status;
        await order.save();
        if (order.user?.email) {
            let subject = "";
            let message = "";
            switch (status) {
                case "paid":
                    subject = "Votre commande a été payée 🎉";
                    message =
                        "Merci pour votre paiement ! Nous préparons votre commande.";
                    break;
                case "processing":
                    subject = "Votre commande est en préparation 🛠️";
                    message = "Nos équipes préparent soigneusement vos articles.";
                    break;
                case "ready":
                    subject = "Votre commande est prête 📦";
                    message = "Votre commande est prête à être expédiée !";
                    break;
                case "shipped":
                    subject = "Votre commande a été expédiée 🚚";
                    message =
                        "Votre commande est en route ! Vous la recevrez très bientôt.";
                    break;
            }
            await (0, mailer_1.sendMail)({
                to: order.user.email,
                subject,
                html: `
					<h2>${subject}</h2>
					<p>Bonjour ${order.user.first_name ?? ""},</p>
					<p>${message}</p>
					<p><strong>Commande n°${order.reference}</strong></p>
					<p>Merci de votre confiance,<br/>L’équipe PCS</p>
				`,
            });
        }
        return res.status(200).json({
            message: `Commande ${id} mise à jour avec le statut '${status}'.`,
            order,
        });
    }
    catch (err) {
        console.error("❌ Erreur updateOrderStatus :", err);
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(500).json({ message: "Erreur inconnue." });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const refundOrder = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🟢 Début refundOrder pour ID :", id);
        if (!id) {
            console.warn("⚠️ Aucun ID fourni");
            return res.status(400).json({ message: "ID de commande manquant." });
        }
        const order = await order_1.Order.findByPk(id);
        console.log("📦 Commande trouvée :", order?.toJSON?.() ?? "aucune");
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable." });
        }
        if (order.status === "refund") {
            return res.status(400).json({ message: "Commande déjà remboursée." });
        }
        if (order.status !== "cancelled") {
            return res.status(400).json({
                message: "La commande doit etre annulée avant d'etre remboursée.",
            });
        }
        if (!order.payment_intent_id) {
            console.warn("⚠️ Pas d'ID Stripe pour cette commande");
            return res.status(400).json({
                message: "Aucun identifiant de paiement Stripe trouvé pour cette commande.",
            });
        }
        console.log("💳 Tentative remboursement Stripe sur :", order.payment_intent_id);
        const refund = await stripe.refunds.create({
            payment_intent: order.payment_intent_id,
        });
        console.log("✅ Refund Stripe OK :", refund.id);
        await order.update({
            status: "refund",
            refund_id: refund.id,
            refunded_at: new Date(),
        });
        console.log("📘 Commande mise à jour :", order.order_id);
        return res.status(200).json({
            message: `Commande ${id} remboursée avec succès.`,
            refund,
            order,
        });
    }
    catch (err) {
        console.error("❌ Erreur refundOrder :", err);
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(500).json({ message: "Erreur inconnue." });
    }
};
exports.refundOrder = refundOrder;
