import { Router } from "express";
import * as contactControllers from "../controllers/contactControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const contactRouter = Router();

// Routes de contact

contactRouter.post("/message", contactControllers.createContactMessage);
contactRouter.get("/messages", contactControllers.getMessages);

contactRouter.patch(
	`/messages/markMessageAsRead/:id`,
	authenticateToken,
	contactControllers.markMessageAsRead,
);

contactRouter.patch(
	`/messages/response/:id`,
	authenticateToken,
	contactControllers.responseMessage,
);

contactRouter.patch(
	"/delete/:id",
	authenticateToken,
	contactControllers.deleteContactMessageById,
);

contactRouter.patch(
	"/restore/:id",
	authenticateToken,
	contactControllers.restoreContactMessageById,
);

contactRouter.patch(
	"/status/:id",
	authenticateToken,
	contactControllers.updateStatusContactMessageById,
);

// contactRouter.post("/contact", contactControllers.createContact);
// contactRouter.post("/contact/:id/responses", contactControllers.createResponse);

// contactRouter.get(
// 	"/messages",
// 	authenticateToken,
// 	contactControllers.getMessages,
// );
// contactRouter.get(
// 	"/messages/:email",
// 	authenticateToken,
// 	contactControllers.getMessagesByUserEmail,
// );

// contactRouter.patch(
// 	`/messages/response/:id`,
// 	authenticateToken,
// 	contactControllers.addResponse,
// );

// contactRouter.patch(
// 	`/messages/delete/:id`,
// 	authenticateToken,
// 	contactControllers.deleteMessageById,
// );

// contactRouter.patch(
// 	`/messages/restore/:id`,
// 	authenticateToken,
// 	contactControllers.restoreMessageById,
// );

export { contactRouter };
