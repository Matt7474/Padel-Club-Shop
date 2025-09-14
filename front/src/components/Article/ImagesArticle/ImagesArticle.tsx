import { useState } from "react";
import type Article from "../../../types/Article";

export default function ImagesArticle({ article }: { article: Article }) {
	const [selectedImage, setSelectedImage] = useState(article?.images[0] || "");
	return (
		<>
			{/* LAYOUT MOBILE */}
			<div className="xl:hidden">
				<div className="xl:flex-row-reverse xl:flex xl:flex-col-2 ">
					{/* Partie grande image */}
					<img
						src={selectedImage}
						alt={article.name}
						className="border border-gray-300 rounded-sm xl:w-4/10"
					/>

					{/* Partie petites images */}
					<div className="flex gap-2 mt-2 xl:flex-col xl:mt-0 xl:mr-2">
						{article.images.map((imgPath) => (
							<button
								type="button"
								key={imgPath}
								className={`border rounded-sm cursor-pointer ${
									imgPath === selectedImage
										? "border-blue-500"
										: "border-gray-300"
								}`}
								onClick={() => setSelectedImage(imgPath)}
							>
								<img
									src={imgPath}
									alt={`${article.name}`}
									className="w-20 h-20 object-cover "
								/>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:gap-4 xl:w-1/2 ">
				{/* Petites images à gauche */}
				<div className="xl:flex xl:flex-col xl:gap-2 xl:w-24">
					{article.images.map((imgPath) => (
						<button
							type="button"
							key={imgPath}
							className={`border rounded-sm cursor-pointer xl:w-20 xl:h-20 ${
								imgPath === selectedImage
									? "border-blue-500"
									: "border-gray-300"
							}`}
							onClick={() => setSelectedImage(imgPath)}
						>
							<img
								src={imgPath}
								alt={`${article.name}`}
								className="w-20 h-20 object-cover"
							/>
						</button>
					))}
				</div>

				{/* Grande image à droite */}
				<div className="xl:w-full">
					<img
						src={selectedImage}
						alt={article.name}
						className="border border-gray-300 rounded-sm w-full"
					/>
				</div>
			</div>
		</>
	);
}
