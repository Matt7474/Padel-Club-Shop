import { Router } from "express";
import * as authControllers from "../controllers/authControllers";
import * as userControllers from "../controllers/userControllers";
import { authenticateToken } from "../middlewares/authenticateToken ";

const userRouter = Router();

// Routes d'authentifications
userRouter.post("/register", authControllers.registerUser);
userRouter.post("/login", authControllers.loginUser);

console.log("dans userRouter");
// Routes utilisateurs
userRouter.get("/:id", authenticateToken, userControllers.getUserById);
userRouter.get("/", userControllers.getAllUsers);

userRouter.patch("/:id", authenticateToken, userControllers.updateUser);

userRouter.delete("/:id", authenticateToken, userControllers.deleteUser);

export { userRouter };
