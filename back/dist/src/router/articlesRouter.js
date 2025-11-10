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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesRouter = void 0;
const express_1 = require("express");
const articlesControllers = __importStar(require("../controllers/articlesControllers"));
const authenticateToken_1 = require("../middlewares/authenticateToken");
const upload_1 = __importDefault(require("../middlewares/upload"));
const articlesRouter = (0, express_1.Router)();
exports.articlesRouter = articlesRouter;
articlesRouter.post("/", authenticateToken_1.authenticateToken, articlesControllers.createArticle);
articlesRouter.post("/:id/images", upload_1.default.array("images"), authenticateToken_1.authenticateToken, articlesControllers.addImagesArticle);
articlesRouter.post("/:id/ratings", authenticateToken_1.authenticateToken, articlesControllers.createTechRatings);
articlesRouter.patch("/:id/ratings", authenticateToken_1.authenticateToken, articlesControllers.updateTechRatings);
articlesRouter.get("/", articlesControllers.getAllArticles);
articlesRouter.get("/id/:id", articlesControllers.getOneArticle);
articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
articlesRouter.get("/name/:name", articlesControllers.getOneArticleByName);
articlesRouter.patch("/:id", authenticateToken_1.authenticateToken, articlesControllers.updateArticle);
articlesRouter.get("/deleted", articlesControllers.getAllArticlesDeleted);
articlesRouter.patch("/archive/:id", authenticateToken_1.authenticateToken, articlesControllers.archiveArticle);
articlesRouter.patch("/restore/:id", authenticateToken_1.authenticateToken, articlesControllers.restoreArticle);
