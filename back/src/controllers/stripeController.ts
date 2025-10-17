import bodyParser from "body-parser";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import Stripe from "stripe";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error("❌ Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req: Request, res: Response) => {
	console.log("📥 Body reçu:", req.body);
	try {
		const { amount, currency = "eur" } = req.body;

		if (!amount) {
			return res.status(400).json({ error: "Missing amount" });
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			automatic_payment_methods: { enabled: true },
		});

		res.status(200).json({ clientSecret: paymentIntent.client_secret });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: "Une erreur inconnue est survenue" });
		}
	}
};

// TEST
export const stripeWebhook = [
	bodyParser.json(),
	(req: Request, res: Response) => {
		const event = req.body;
		console.log("📩 Event reçu:", event);

		switch (event.type) {
			case "payment_intent.succeeded":
				console.log("✅ Payment succeeded:", event.data.object.id);
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

// Webhook Stripe
//PROD
// export const stripeWebhook = [
// 	bodyParser.raw({ type: "application/json" }),
// 	(req: Request, res: Response) => {
// 		const sig = req.headers["stripe-signature"] as string;
// 		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
// 		let event: Stripe.Event;

// 		try {
// 			event = stripe.webhooks.constructEvent(
// 				req.body as Buffer,
// 				sig,
// 				webhookSecret,
// 			);
// 		} catch (err: any) {
// 			console.error("Webhook signature failed:", err.message);
// 			return res.status(400).send(`Webhook Error: ${err.message}`);
// 		}

// 		switch (event.type) {
// 			case "payment_intent.succeeded":
// 				console.log("✅ Payment succeeded:", event.data.object.id);
// 				break;
// 			case "payment_intent.payment_failed":
// 				console.log(
// 					"❌ Payment failed:",
// 					event.data.object.last_payment_error?.message,
// 				);
// 				break;
// 			default:
// 				console.log(`Unhandled event type ${event.type}`);
// 		}

// 		res.json({ received: true });
// 	},
// ];
