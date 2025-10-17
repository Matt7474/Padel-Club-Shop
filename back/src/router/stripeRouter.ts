import { Router } from "express";
import {
	createPaymentIntent,
	stripeWebhook,
} from "../controllers/stripeController";

const stripeRouter = Router();

stripeRouter.post("/create-payment-intent", createPaymentIntent);
stripeRouter.post("/webhook", stripeWebhook);

export { stripeRouter };
