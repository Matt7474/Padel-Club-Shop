"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoFormSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.promoFormSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100).required().messages({
        "any.required": "Le nom est obligatoire.",
        "string.max": "Le nom est trop long.",
    }),
    description: joi_1.default.string().allow("", null).max(2000).messages({
        "string.base": "La description doit être une chaîne de caractères.",
        "string.max": "La description est trop longue.",
    }),
    start_date: joi_1.default.date().required().messages({
        "date.base": "La date de début doit être valide.",
        "any.required": "La date de début est obligatoire.",
    }),
    end_date: joi_1.default.date().greater(joi_1.default.ref("start_date")).required().messages({
        "date.base": "La date de fin doit être valide.",
        "date.greater": "La date de fin doit être après la date de début.",
        "any.required": "La date de fin est obligatoire.",
    }),
});
