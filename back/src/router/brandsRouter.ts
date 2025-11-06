import { Router } from "express";
import * as brandsControllers from "../controllers/brandsControllers";
import { authenticateToken } from "../middlewares/authenticateToken";
import upload from "../middlewares/upload";

const brandsRouter = Router();

brandsRouter.post(
	"/",
	upload.single("image"),
	authenticateToken,
	brandsControllers.createBrand,
);
brandsRouter.get("/", brandsControllers.getAllBrands);
brandsRouter.patch("/:id", authenticateToken, brandsControllers.updateBrand);
brandsRouter.delete("/:id", authenticateToken, brandsControllers.deleteBrand);

export { brandsRouter };

// wait axios.delete(`${API_URL}/brands/${brandId}`);
