import { Router } from "express";
import { articlesRouter } from "./articlesRouter";
import { brandsRouter } from "./brandsRouter";
import { contactRouter } from "./contactRouter";
import { orderRouter } from "./orderRouter";
import { promotionsRouter } from "./promotionsRouter";
import { stockRouter } from "./stockRouter";
import { stripeRouter } from "./stripeRouter";
import { userRouter } from "./userRouter";

const router = Router();

router.use("/articles", articlesRouter);
router.use("/brands", brandsRouter);
router.use("/contact", contactRouter);
router.use("/order", orderRouter);
router.use("/promotions", promotionsRouter);
router.use("/stock", stockRouter);
router.use("/stripe", stripeRouter);
router.use("/user", userRouter);

export { router };
