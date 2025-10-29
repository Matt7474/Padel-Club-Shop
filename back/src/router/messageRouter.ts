import { Router } from "express";
import * as messagesControllers from "../controllers/messagesControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const messagesRouter = Router();

messagesRouter.get(
	"/:userId",
	authenticateToken,
	messagesControllers.getUserMessages,
);

messagesRouter.post(
	"/user",
	authenticateToken,
	messagesControllers.sendUserMessage,
);

messagesRouter.post(
	"/admin",
	authenticateToken,
	messagesControllers.sendAdminMessage,
);

export { messagesRouter };
