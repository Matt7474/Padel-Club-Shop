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

articlesRouter.get("/", articlesControllers.getAllArticles);
articlesRouter.get("/id/:id", articlesControllers.getOneArticle);
articlesRouter.get("/type/:type", articlesControllers.getArticlesByType);
articlesRouter.get("/name/:name", articlesControllers.getOneArticleByName);

articlesRouter.patch("/:id", articlesControllers.updateArticle);

articlesRouter.patch("/:id/archive", articlesControllers.archiveArticle);
articlesRouter.patch("/:id/restore", articlesControllers.restoreArticle);

export { articlesRouter };
