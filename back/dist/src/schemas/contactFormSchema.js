"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactFormSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.contactFormSchema = joi_1.default.object({
    user_id: joi_1.default.number().integer().optional().allow(null),
    first_name: joi_1.default.string().min(1).max(100).required(),
    last_name: joi_1.default.string().min(1).max(100).required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().optional().allow(null, ""),
    subject: joi_1.default.string().min(1).max(200).required(),
    order_number: joi_1.default.string().max(20).optional().allow(null, ""),
    message: joi_1.default.string().min(1).max(5000).required(),
});
