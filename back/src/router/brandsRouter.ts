import { Router } from "express";
import * as brandsControllers from "../controllers/brandsControllers";

const brandsRouter = Router();

// articlesRouter.post("/", articlesControllers.createArticle);

brandsRouter.get("/", brandsControllers.getAllBrands);
// articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
// articlesRouter.get("/id/:id", articlesControllers.getOneArticle);

// articlesRouter.patch("/:id", articlesControllers.updateArticle);

// articlesRouter.patch("/:id/archive", articlesControllers.archiveArticle);
// articlesRouter.patch("/:id/restore", articlesControllers.restoreArticle);

export { brandsRouter };
