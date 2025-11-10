"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsFormSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.brandsFormSchema = joi_1.default.object({
    brandName: joi_1.default.string()
        .trim()
        .pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ'’().,\- \s]{2,100}$/u)
        .required()
        .messages({
        "string.pattern.base": "Le nom ne doit contenir que des lettres, chiffres, espaces et ponctuation basique (.,-'()).",
        "any.required": "Le nom de la marque est obligatoire.",
    }),
    image_url: joi_1.default.string()
        .uri({ scheme: ["http", "https"] })
        .allow("", null)
        .messages({
        "string.uri": "L'URL de l'image doit être valide.",
    }),
});
