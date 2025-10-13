import { Router } from "express";
import * as articlesControllers from "../controllers/articlesControllers";
import upload from "../middlewares/upload";

const articlesRouter = Router();

articlesRouter.post("/", articlesControllers.createArticle);
articlesRouter.post(
	"/:id/images",
	upload.array("images"),
	articlesControllers.addImagesArticle,
);
articlesRouter.post(
	"/:id/ratings",
	(req, res, next) => {
		console.log("🎯 Route ratings atteinte !", req.params, req.body);
		next();
	},
	articlesControllers.createTechRatings,
);
articlesRouter.patch(
	"/:id/ratings",
	(req, res, next) => {
		console.log("🎯 Route ratings atteinte !", req.params, req.body);
		next();
	},
	articlesControllers.updateTechRatings,
);

articlesRouter.get("/", articlesControllers.getAllArticles);
articlesRouter.get("/id/:id", articlesControllers.getOneArticle);
articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
articlesRouter.get("/name/:name", articlesControllers.getOneArticleByName);

articlesRouter.patch("/:id", articlesControllers.updateArticle);

articlesRouter.get("/deleted", articlesControllers.getAllArticlesDeleted);

articlesRouter.patch("/archive/:id", articlesControllers.archiveArticle);
articlesRouter.patch("/restore/:id", articlesControllers.restoreArticle);

export { articlesRouter };
