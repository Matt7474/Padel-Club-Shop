import { Router } from "express";
import * as stockControllers from "../controllers/stockControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const stockRouter = Router();

// Routes de stock
stockRouter.post(
	"/check-before-payment",
	authenticateToken,
	stockControllers.checkStockBeforePayment,
);

stockRouter.post(
	"/update-after-payment",
	authenticateToken,
	stockControllers.updateStockAfterPayment,
);

export { stockRouter };
