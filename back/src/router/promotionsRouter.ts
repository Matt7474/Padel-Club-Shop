import { Router } from "express";
import * as promotionsController from "../controllers/promotionsController";

const promotionsRouter = Router();

promotionsRouter.post("/article/:articleId", promotionsController.createPromo);
promotionsRouter.get("/article/:articleId", promotionsController.getPromos);

export { promotionsRouter };
