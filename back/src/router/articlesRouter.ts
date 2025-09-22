import { Router } from "express";
import * as articlesControllers from "../controllers/articlesControllers";

const articlesRouter = Router();

articlesRouter.post("/", articlesControllers.createArticle);

articlesRouter.get("/", articlesControllers.getAllArticles);
articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
articlesRouter.get("/id/:id", articlesControllers.getOneArticle);

articlesRouter.patch("/:id", articlesControllers.updateArticle);

articlesRouter.patch("/:id/archive", articlesControllers.archiveArticle);
articlesRouter.patch("/:id/restore", articlesControllers.restoreArticle);

export { articlesRouter };
