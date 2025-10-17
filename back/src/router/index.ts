import { Router } from "express";
import { articlesRouter } from "./articlesRouter";
import { brandsRouter } from "./brandsRouter";
import { promotionsRouter } from "./promotionsRouter";
import { stripeRouter } from "./stripeRouter";
import { userRouter } from "./userRouter";

const router = Router();

router.use("/articles", articlesRouter);
router.use("/brands", brandsRouter);
router.use("/promotions", promotionsRouter);
router.use("/user", userRouter);
router.use("/stripe", stripeRouter);

export { router };
