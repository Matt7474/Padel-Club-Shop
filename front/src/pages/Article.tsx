import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getArticleByName } from "../api/Article";
import CaracteristicsArticle from "../components/Article/CaracteristicsArticle/CaracteristicsArticle";
import ImagesArticle from "../components/Article/ImagesArticle/ImagesArticle";
import PriceArticle from "../components/Article/PriceArticle/PriceArticle";
import RatingArticle from "../components/Article/RatingArticle/RatingArticle";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DisplayPromo from "../components/DisplayPromo/DisplayPromo";
import type ArticleType from "../types/Article";

export default function Article() {
	const [isDescriptionOn, setIsDescriptionOn] = useState(true);
	const [isCaracteristiquesOn, setIsCaracteristiquesOn] = useState(false);
	const { name } = useParams<{ name: string }>();
	const location = useLocation();
	const stateArticle = (location.state as { article?: ArticleType })?.article;

	const [article, setArticle] = useState<ArticleType | null>(
		stateArticle || null,
	);
	const [loading, setLoading] = useState(!stateArticle);

	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	useEffect(() => {
		if (stateArticle) return;
		if (!name) return;

		setLoading(true);
		getArticleByName(name)
			.then((data) => {
				setArticle(data);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [name, stateArticle]);

	if (!name || loading) return <div>Chargement...</div>;
	if (!article) return <div>Cet article n'a pas été trouvé</div>;

	const breadcrumbItems = [
		{ label: "Accueil", href: "/" },
		{
			label: article.type.charAt(0).toUpperCase() + article.type.slice(1),
			href: `/articles/${article.type}`,
		},
		{ label: article.name, href: `/articles/${name}` },
	];

	console.log(article);

	let selectedQty: number | undefined;
	if (selectedSize && article.tech_characteristics?.fit) {
		const sizeObj = article.tech_characteristics.fit
			.split(",")
			.map((pair) => {
				const [size, qty] = pair.split(":");
				return { size, qty: Number(qty) };
			})
			.find((s) => s.size === selectedSize);

		if (sizeObj) selectedQty = sizeObj.qty;
	}
	console.log("selectedSize:", selectedSize);
	console.log("selectedQty:", selectedQty);
	console.log(
		"stockMessage:",
		selectedQty && selectedQty < 5
			? `Il ne reste que ${selectedQty}...`
			: undefined,
	);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />

			{/* LAYOUT MOBILE */}
			<div className="xl:hidden mt-6">
				<ImagesArticle article={article} />
				<div>
					{(article.type === "clothing" || article.type === "shoes") &&
						article.tech_characteristics?.fit && (
							<div className="mb-6 mt-6 xl:mt-0">
								<h3 className="font-semibold text-md mb-2">
									Tailles disponibles
								</h3>
								<div className="flex flex-wrap gap-2">
									{article.tech_characteristics.fit
										.split(",")
										.map((sizeStr) => {
											const [size, qty] = sizeStr.split(":");
											const isSelected = selectedSize === size;

											return (
												<button
													key={size}
													type="button"
													disabled={Number(qty) === 0}
													onClick={() => setSelectedSize(size)}
													className={`
													border px-2 py-1 rounded-md flex flex-col text-xs items-center
													${
														Number(qty) === 0
															? "bg-gray-100 bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_10px,#f9fafb_10px,#f9fafb_15px)] cursor-not-allowed"
															: "cursor-pointer"
													}
													${isSelected && Number(qty) > 0 ? "bg-gray-300" : Number(qty) > 0 ? "hover:bg-gray-300" : ""}
													`}
												>
													<span className="font-semibold h-5 w-7 flex justify-center items-center">
														{size}
													</span>
													{Number(qty) === 0 && (
														<span className="text-[10px] text-red-500" />
													)}
												</button>
											);
										})}
								</div>
							</div>
						)}
				</div>
				<PriceArticle
					article={article}
					selectedSize={selectedSize}
					qty={selectedQty}
					isSelected={!!selectedSize}
				/>
				<p className="font-semibold text-lg mt-6">{article.name}</p>
				<p className="text-sm">{article.reference}</p>

				{/* PROMOTION */}
				<div className="mt-5 -mb-3">
					<DisplayPromo article={article} />
				</div>

				{article.ratings && Object.keys(article.ratings).length > 0 && (
					<RatingArticle article={article} />
				)}

				<div className="mt-10">
					<div className="flex justify-around font-semibold text-lg">
						<button
							type="button"
							onClick={() => {
								setIsDescriptionOn(true);
								setIsCaracteristiquesOn(false);
							}}
							className={`cursor-pointer ${
								isDescriptionOn ? "text-black" : "text-gray-400"
							}`}
						>
							Description
						</button>
						<button
							type="button"
							onClick={() => {
								setIsDescriptionOn(false);
								setIsCaracteristiquesOn(true);
							}}
							className={`cursor-pointer ${
								isCaracteristiquesOn ? "text-black" : "text-gray-400"
							}`}
						>
							Caractéristiques
						</button>
					</div>

					{isDescriptionOn ? (
						<p className="mt-3">{article.description}</p>
					) : (
						isCaracteristiquesOn && <CaracteristicsArticle article={article} />
					)}
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:flex-col xl:gap-8 xl:justify-between mt-6">
				<div className="hidden xl:flex xl:gap-8 xl:justify-between">
					<ImagesArticle article={article} />

					<div className="xl:w-1/2 xl:flex xl:flex-col">
						<div className="xl:flex xl:flex-col xl:h-full xl:justify-between">
							<div>
								<h1 className="font-bold text-2xl mb-2">{article.name}</h1>
								<p className="text-gray-600 text-sm mb-4">
									{article.reference}
								</p>
								<p className="text-base leading-relaxed mb-6">
									{article.description}
								</p>
							</div>
							<div className="flex flex-col justify-between">
								<div>
									{(article.type === "clothing" || article.type === "shoes") &&
										article.tech_characteristics?.fit && (
											<div className="mb-6">
												<h3 className="font-semibold text-md mb-2">
													Tailles disponibles
												</h3>

												<div className=" grid grid-cols-10 gap-2">
													{article.tech_characteristics.fit
														.split(",")
														.map((sizeStr) => {
															const [size, qty] = sizeStr.split(":");
															const isSelected = selectedSize === size;

															return (
																<div className="flex flex-col items-center">
																	<button
																		key={size}
																		type="button"
																		disabled={Number(qty) === 0}
																		onClick={() => setSelectedSize(size)}
																		className={`
        relative border px-2 py-1 w-10 h-10 rounded-md flex flex-col text-xs items-center
        ${Number(qty) === 0 ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"}
        ${isSelected ? "bg-gray-300" : "hover:bg-gray-300"}
      `}
																	>
																		{/* Hachures si stock à 0 */}
																		{Number(qty) === 0 && (
																			<span className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_2px,transparent_1px,transparent_4px)] rounded-md pointer-events-none"></span>
																		)}

																		{/* Contenu au-dessus */}
																		<span className="relative z-10 font-semibold h-8 w-8 flex justify-center items-center">
																			{size}
																		</span>
																	</button>
																</div>
															);
														})}
												</div>
											</div>
										)}
								</div>
								<div className="-mt-4">
									<PriceArticle
										article={article}
										selectedSize={selectedSize}
										qty={selectedQty}
										isSelected={!!selectedSize}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* PROMOTION */}
				<div className="mt-5 -mb-10 flex justify-center">
					<DisplayPromo article={article} />
				</div>

				<div className="hidden xl:flex justify-center gap-6 xl:mt-6">
					{article.type === "racket" && <RatingArticle article={article} />}
					<div className="w-1/2">
						<h3 className="font-semibold text-lg mb-4 xl:text-center xl:mt-10">
							Caractéristiques
						</h3>
						<CaracteristicsArticle article={article} />
					</div>
				</div>
			</div>
		</>
	);
}
