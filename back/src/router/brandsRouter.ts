import { Router } from "express";
import * as brandsControllers from "../controllers/brandsControllers";
import upload from "../middlewares/upload";

const brandsRouter = Router();

brandsRouter.post("/", upload.single("image"), brandsControllers.createBrand);

brandsRouter.get("/", brandsControllers.getAllBrands);

export { brandsRouter };
