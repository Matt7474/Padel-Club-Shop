import { Router } from "express";
import { articlesRouter } from "./articlesRouter";
import { brandsRouter } from "./brandsRouter";
import { promotionsRouter } from "./promotionsRouter";

const router = Router();

router.use("/articles", articlesRouter);
router.use("/brands", brandsRouter);
router.use("/promotions", promotionsRouter);

export { router };
