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
orderRouter.delete(
	"/delete/:id",
	authenticateToken,
	orderControllers.deleteOrderById,
);
orderRouter.get("/my-orders", authenticateToken, orderControllers.getMyOrders);
orderRouter.get("/orders", authenticateToken, orderControllers.getAllOrders);

orderRouter.patch(
	"/:id/status",
	authenticateToken,
	orderControllers.updateOrderStatus,
);

export { orderRouter };
