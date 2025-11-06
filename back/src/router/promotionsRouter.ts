import { Router } from "express";
import * as promotionController from "../controllers/promotionControllers";
import * as promotionsController from "../controllers/promotionsControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const promotionsRouter = Router();

promotionsRouter.post("/article/:articleId", promotionsController.createPromos);
promotionsRouter.get("/article/:articleId", promotionsController.getPromos);

promotionsRouter.patch(
	"/article/:articleId/:promoId",
	promotionsController.updatePromo,
);
promotionsRouter.delete(
	"/article/:articleId/:promoId",
	promotionsController.deletePromo,
);

// promotion juste pour pré remplissage, non lié a un article.
promotionsRouter.post(
	"/promotion",
	authenticateToken,
	promotionController.createPromo,
);
promotionsRouter.get("/promotion", promotionController.getPromo);
promotionsRouter.patch(
	"/promotion/:promoId",
	authenticateToken,
	promotionController.updatePromo,
);
promotionsRouter.delete(
	"/promotion/:promoId",
	authenticateToken,
	promotionController.deletePromo,
);

export { promotionsRouter };
