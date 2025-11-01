import { Router } from "express";
import * as messagesControllers from "../controllers/messagesControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const messagesRouter = Router();

messagesRouter.get(
	"/all",
	authenticateToken,
	messagesControllers.getAllUserMessages,
);

messagesRouter.get(
	"/:userId",
	authenticateToken,
	messagesControllers.getUserMessages,
);

messagesRouter.patch(
	"/mark-read/:id",
	authenticateToken,
	messagesControllers.markMessagesAsRead,
);
messagesRouter.patch(
	"/mark-read-r/:id",
	authenticateToken,
	messagesControllers.markMessagesReceiverAsRead,
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
