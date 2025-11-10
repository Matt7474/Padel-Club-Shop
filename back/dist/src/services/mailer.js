"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async ({ to, subject, html, }) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "pcs.matt-dev.fr", // ton domaine O2Switch
        port: 465,
        secure: true, // SSL
        auth: {
            user: "no-reply@pcs.matt-dev.fr",
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        debug: true,
    });
    await transporter.sendMail({
        from: `"Padel Club Shop" <no-reply@pcs.matt-dev.fr>`,
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
