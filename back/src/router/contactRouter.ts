import { Router } from "express";
import * as contactControllers from "../controllers/contactControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const contactRouter = Router();

// Routes de contact
contactRouter.post("/contact", contactControllers.createContact);
contactRouter.get(
	"/messages",
	authenticateToken,
	contactControllers.getMessages,
);
contactRouter.get(
	"/messages/:email",
	authenticateToken,
	contactControllers.getMessagesByUserEmail,
);

contactRouter.patch(
	`/messages/markMessageAsRead/:id`,
	authenticateToken,
	contactControllers.markMessageAsRead,
);

contactRouter.patch(
	`/messages/response/:id`,
	authenticateToken,
	contactControllers.addResponse,
);

export { contactRouter };
