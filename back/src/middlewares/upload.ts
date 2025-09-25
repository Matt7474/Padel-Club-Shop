// middlewares/upload.ts
import path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads/"); // dossier où tu stockes les images
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

export default upload;
