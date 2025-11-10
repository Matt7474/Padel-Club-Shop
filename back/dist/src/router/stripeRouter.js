"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeRouter = void 0;
const express_1 = require("express");
const stripeController_1 = require("../controllers/stripeController");
const stripeRouter = (0, express_1.Router)();
exports.stripeRouter = stripeRouter;
stripeRouter.post("/create-payment-intent", stripeController_1.createPaymentIntent);
stripeRouter.post("/webhook", stripeController_1.stripeWebhook);
