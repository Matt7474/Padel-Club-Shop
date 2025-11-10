"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
// validation/registerSchema.ts
const joi_1 = __importDefault(require("joi"));
// Schéma le login
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().empty("").required().messages({
        "string.email": "Le format de l'email est invalide.",
        "any.required": "Le champ email est obligatoire.",
        "string.empty": "Le champ email est obligatoire.",
    }),
    password: joi_1.default.string()
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9\-!@#$%^&*()_+=]{8,}$/)
        .required()
        .empty("")
        .messages({
        "string.pattern.base": "Le mot de passe doit contenir au moins 8 caractères, dont 1 chiffre et 1 majuscule.",
        "any.required": "Le champ password est obligatoire.",
        "string.empty": "Le champ password est obligatoire.",
    }),
});
