import { useState } from "react";
import type Article from "../../../types/Article";

export default function ImagesArticle({ article }: { article: Article }) {
	const BASE_URL = import.meta.env.VITE_API_URL;

	const defaultImage = "/icons/default.svg";
	const [selectedImage, setSelectedImage] = useState(
		article.images[0]?.url ? BASE_URL + article.images[0].url : defaultImage,
	);

	return (
		<>
			{/* LAYOUT MOBILE */}
			<div className="xl:hidden">
				<div className="xl:flex-row-reverse xl:flex xl:flex-col-2">
					{/* Partie grande image */}
					<img
						src={selectedImage}
						alt={article.name}
						className="border border-gray-300 rounded-sm w-full aspect-square"
					/>

					{/* Partie petites images avec scroll horizontal */}
					<div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-2">
						{article.images.map((img) => (
							<button
								type="button"
								key={img.image_id}
								className={`flex-shrink-0 border rounded-sm cursor-pointer transition-all duration-200 ${
									BASE_URL + img.url === selectedImage
										? "border-blue-500 ring-2 ring-blue-200"
										: "border-gray-300 hover:border-gray-400"
								}`}
								onClick={() => setSelectedImage(BASE_URL + img.url)}
							>
								<img
									src={BASE_URL + img.url}
									alt={article.name}
									className="w-20 h-20 object-cover rounded-sm"
								/>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:gap-4 xl:w-1/2">
				{/* Petites images à gauche avec scroll vertical */}
				<div className="xl:flex xl:flex-col xl:gap-2 xl:w-24">
					<div className="flex flex-col gap-2 max-h-113 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
						{article.images.map((img) => (
							<button
								type="button"
								key={img.image_id}
								className={`flex-shrink-0 border rounded-sm cursor-pointer transition-all duration-200 ${
									BASE_URL + img.url === selectedImage
										? "border-blue-500 ring-2 ring-blue-200"
										: "border-gray-300 hover:border-gray-400"
								}`}
								onClick={() => setSelectedImage(BASE_URL + img.url)}
							>
								<img
									src={BASE_URL + img.url}
									alt={article.name}
									className="w-20 h-20 object-cover rounded-sm"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Grande image à droite */}
				<div className="xl:w-full">
					<img
						src={selectedImage}
						alt={article.name}
						className="border border-gray-300 rounded-sm w-full aspect-square"
					/>
				</div>
			</div>
		</>
	);
}
