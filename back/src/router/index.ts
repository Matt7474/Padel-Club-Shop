import { Router } from "express";
import { articlesRouter } from "./articlesRouter";
import { brandsRouter } from "./brandsRouter";

const router = Router();

router.use("/articles", articlesRouter);
router.use("/brands", brandsRouter);

export { router };
