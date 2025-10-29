// import { Router } from "express";
// import * as conversationControllers from "../controllers/conversationControllers";
// import { authenticateToken } from "../middlewares/authenticateToken";

// const conversationRouter = Router();

// // Routes de stock
// conversationRouter.get(
// 	"/conversations",
// 	authenticateToken,
// 	conversationControllers.getAllConversations,
// );
// conversationRouter.get(
// 	"/conversations/:id",
// 	authenticateToken,
// 	conversationControllers.getConversationById,
// );
// conversationRouter.post(
// 	"/conversations",
// 	authenticateToken,
// 	conversationControllers.createNewConversation,
// );

// conversationRouter.get(
// 	"/messages/:conversationId",
// 	authenticateToken,
// 	conversationControllers.getAlleMessagesFronConversation,
// );

// conversationRouter.post(
// 	"/messages",
// 	authenticateToken,
// 	conversationControllers.createMessage,
// );

// export { conversationRouter };
