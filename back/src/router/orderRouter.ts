import { Router } from "express";
import * as orderControllers from "../controllers/orderControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const orderRouter = Router();

// Routes de stock
orderRouter.post(
	"/create",
	authenticateToken,
	orderControllers.createOrderAndUpdateStock,
);
orderRouter.get("/my-orders", authenticateToken, orderControllers.getMyOrders);

export { orderRouter };
