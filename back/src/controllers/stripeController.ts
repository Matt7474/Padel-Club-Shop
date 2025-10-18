import bodyParser from "body-parser";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import Stripe from "stripe";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error("❌ Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Interface pour typer les items du panier
interface CartItem {
	id: number | string;
	name: string;
	price: number; // En euros
	quantity: number;
}

export const createPaymentIntent = async (req: Request, res: Response) => {
	console.log("📥 Body reçu:", req.body);

	try {
		const { items, currency = "eur" } = req.body as {
			items: CartItem[];
			currency?: string;
		};

		// ✅ Vérifier que items existe et n'est pas vide
		if (!items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({
				error: "Missing or empty items array",
			});
		}

		// ✅ Calculer le montant total à partir des items (SÉCURITÉ)
		const total = items.reduce((sum, item) => {
			// Validation de chaque item
			if (!item.price || !item.quantity) {
				throw new Error(`Invalid item: ${JSON.stringify(item)}`);
			}
			return sum + item.price * item.quantity;
		}, 0);

		// Convertir en centimes
		const amountInCents = Math.round(total * 100);

		console.log("💰 Total calculé:", {
			euros: total,
			centimes: amountInCents,
			items: items.length,
		});

		// Validation du montant minimum Stripe (50 centimes)
		if (amountInCents < 50) {
			return res.status(400).json({
				error: "Le montant doit être d'au moins 0,50€",
			});
		}

		// ✅ Créer le PaymentIntent avec Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInCents,
			currency,
			automatic_payment_methods: { enabled: true },
			// Ajouter des métadonnées pour traçabilité
			metadata: {
				itemCount: items.length.toString(),
				items: JSON.stringify(
					items.map((i) => ({
						id: i.id,
						name: i.name,
						quantity: i.quantity,
						price: i.price,
					})),
				),
			},
		});

		console.log("✅ PaymentIntent créé:", paymentIntent.id);

		res.status(200).json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error: unknown) {
		console.error("❌ Erreur:", error);

		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: "Une erreur inconnue est survenue" });
		}
	}
};

// TEST - Webhook Stripe
export const stripeWebhook = [
	bodyParser.json(),
	(req: Request, res: Response) => {
		const event = req.body;
		console.log("📩 Event reçu:", event);

		switch (event.type) {
			case "payment_intent.succeeded":
				console.log("✅ Payment succeeded:", event.data.object.id);
				// TODO: Mettre à jour la base de données, envoyer un email, etc.
				break;
			case "payment_intent.payment_failed":
				console.log("❌ Payment failed:", event.data.object);
				break;
			default:
				console.log(`ℹ️ Unhandled event type: ${event.type}`);
		}

		res.json({ received: true });
	},
];

// PROD - Webhook Stripe avec signature
export const stripeWebhookProd = [
	bodyParser.raw({ type: "application/json" }),
	(req: Request, res: Response) => {
		const sig = req.headers["stripe-signature"] as string;
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body as Buffer,
				sig,
				webhookSecret,
			);
		} catch (err: any) {
			console.error("❌ Webhook signature failed:", err.message);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}

		switch (event.type) {
			case "payment_intent.succeeded":
				console.log("✅ Payment succeeded:", event.data.object.id);
				// TODO: Traiter la commande
				break;
			case "payment_intent.payment_failed":
				console.log(
					"❌ Payment failed:",
					event.data.object.last_payment_error?.message,
				);
				break;
			default:
				console.log(`ℹ️ Unhandled event type ${event.type}`);
		}

		res.json({ received: true });
	},
];
