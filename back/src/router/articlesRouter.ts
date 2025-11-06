import { Router } from "express";
import * as articlesControllers from "../controllers/articlesControllers";
import { authenticateToken } from "../middlewares/authenticateToken";
import upload from "../middlewares/upload";

const articlesRouter = Router();

articlesRouter.post("/", authenticateToken, articlesControllers.createArticle);
articlesRouter.post(
	"/:id/images",
	upload.array("images"),
	authenticateToken,
	articlesControllers.addImagesArticle,
);
articlesRouter.post(
	"/:id/ratings",
	authenticateToken,
	articlesControllers.createTechRatings,
);
articlesRouter.patch(
	"/:id/ratings",
	authenticateToken,
	articlesControllers.updateTechRatings,
);

articlesRouter.get("/", articlesControllers.getAllArticles);
articlesRouter.get("/id/:id", articlesControllers.getOneArticle);
articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
articlesRouter.get("/name/:name", articlesControllers.getOneArticleByName);

articlesRouter.patch(
	"/:id",
	authenticateToken,
	articlesControllers.updateArticle,
);

articlesRouter.get("/deleted", articlesControllers.getAllArticlesDeleted);

articlesRouter.patch(
	"/archive/:id",
	authenticateToken,
	articlesControllers.archiveArticle,
);
articlesRouter.patch(
	"/restore/:id",
	authenticateToken,
	articlesControllers.restoreArticle,
);

export { articlesRouter };
