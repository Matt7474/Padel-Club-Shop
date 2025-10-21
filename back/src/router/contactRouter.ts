import { Router } from "express";
import * as contactControllers from "../controllers/contactControllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const contactRouter = Router();

// Routes de contact
contactRouter.post("/contact", contactControllers.createContact);
contactRouter.get(
	"/contact",
	authenticateToken,
	contactControllers.getContacts,
);

export { contactRouter };
