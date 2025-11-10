"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = sanitizeInput;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
function sanitizeInput(value) {
    return (0, sanitize_html_1.default)(value, {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();
}
