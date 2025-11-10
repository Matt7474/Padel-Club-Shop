"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionsRouter = void 0;
const express_1 = require("express");
const promotionController = __importStar(require("../controllers/promotionControllers"));
const promotionsController = __importStar(require("../controllers/promotionsControllers"));
const authenticateToken_1 = require("../middlewares/authenticateToken");
const promotionsRouter = (0, express_1.Router)();
exports.promotionsRouter = promotionsRouter;
promotionsRouter.post("/article/:articleId", promotionsController.createPromos);
promotionsRouter.get("/article/:articleId", promotionsController.getPromos);
promotionsRouter.patch("/article/:articleId/:promoId", promotionsController.updatePromo);
promotionsRouter.delete("/article/:articleId/:promoId", promotionsController.deletePromo);
// promotion juste pour pré remplissage, non lié a un article.
promotionsRouter.post("/promotion", authenticateToken_1.authenticateToken, promotionController.createPromo);
promotionsRouter.get("/promotion", promotionController.getPromo);
promotionsRouter.patch("/promotion/:promoId", authenticateToken_1.authenticateToken, promotionController.updatePromo);
promotionsRouter.delete("/promotion/:promoId", authenticateToken_1.authenticateToken, promotionController.deletePromo);
