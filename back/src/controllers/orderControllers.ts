import type { Request, Response } from "express";
import { sequelize } from "../database/db";
import { Article } from "../models/article";
import { Order } from "../models/order";
import { OrderItem } from "../models/orderItem";

export const createOrderAndUpdateStock = async (
	req: Request,
	res: Response,
) => {
	try {
		const { userId, cart } = req.body;

		if (!userId || !Array.isArray(cart) || cart.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "Utilisateur ou panier invalide",
			});
		}

		const order = await sequelize.transaction(async (t) => {
			const now = new Date();
			const tempRef = `TMP-${now.getTime()}`; // temporaire

			// 1️⃣ Crée la commande avec référence temporaire
			const newOrder = await Order.create(
				{
					user_id: userId,
					total_amount: cart.reduce(
						(sum, item) => sum + item.price * item.quantity,
						0,
					),
					reference: tempRef,
				},
				{ transaction: t },
			);

			// 2️⃣ Crée les OrderItems et décrémente le stock
			for (const item of cart) {
				const article = await Article.findByPk(item.id, {
					attributes: ["article_id", "name", "stock_quantity"],
					transaction: t,
				});
				if (!article) throw new Error(`Article introuvable : ${item.id}`);
				if (article.stock_quantity < item.quantity)
					throw new Error(`Stock insuffisant pour ${article.name}`);

				await OrderItem.create(
					{
						order_id: newOrder.order_id,
						article_id: item.id,
						quantity: item.quantity,
						price: item.price,
					},
					{ transaction: t },
				);

				await article.update(
					{
						stock_quantity: article.stock_quantity - item.quantity,
						updated_at: new Date(),
					},
					{ transaction: t },
				);
			}

			// 3️⃣ Génère la vraie référence maintenant que order_id existe
			const ref = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(newOrder.order_id).padStart(3, "0")}`;
			await newOrder.update(
				{ reference: ref, updated_at: new Date() },
				{ transaction: t },
			);

			return newOrder;
		});

		return res.status(200).json({
			status: "ok",
			message: "Commande créée et stock mis à jour",
			order,
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur création commande :", err.message);
			return res.status(500).json({ status: "error", message: err.message });
		} else {
			console.error("Erreur inconnue création commande :", err);
			return res.status(500).json({
				status: "error",
				message: "Erreur serveur lors de la création de la commande",
			});
		}
	}
};
