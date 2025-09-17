import { useMemo, useState } from "react";
import data from "../../../../data/dataTest.json";
import type Article from "../../../types/Article";
import ArticleForm from "../CreateArticle/ArticleForm";
import BagForm from "../CreateArticle/BagForm";
import BallForm from "../CreateArticle/BallForm";
import ClothingForm from "../CreateArticle/ClothingForm";
import PromoForm from "../CreateArticle/PromoForm";
import RacketForm from "../CreateArticle/RacketForm";
import ShoesForm from "../CreateArticle/ShoesForm";
import Toogle from "../Toogle/Toogle";

type ImageWithId = {
	id: string;
	file: File;
	previewUrl: string;
};

interface CreateArticlePropos {
	title: string;
	button: string;
	article?: Article;
}

interface SizeOption {
	label: string;
	stock: number;
}

export default function CreateArticle({
	title,
	button,
	article,
}: CreateArticlePropos) {
	const today = new Date();

	const [articleType, setArticleType] = useState(article?.type || "");
	const [articleName, setArticleName] = useState(article?.name || "");
	const [articleDescription, setArticleDescription] = useState(
		article?.description || "",
	);
	const [articleReference, setArticleReference] = useState(
		article?.reference || "",
	);
	const [articleBrand, setArticleBrand] = useState(article?.brand || "");
	const [images, setImages] = useState<ImageWithId[]>(() => {
		return (
			article?.images?.map((url: string) => ({
				id: crypto.randomUUID(),
				file: {} as File,
				previewUrl: url,
			})) || []
		);
	});
	const [articlePriceTTC, setArticlePriceTTC] = useState(
		article?.price_ttc?.toString() || "",
	);
	const [articleQty, setArticleQty] = useState(
		article?.stock_quantity?.toString() || "",
	);
	const [articleShippingCost, setArticleShippingCost] = useState(
		article?.shipping_cost?.toString() || "",
	);
	const [articleStatus, setArticleStatus] = useState(article?.status || "");
	//
	//

	const [articlePromo, setArticlePromo] = useState(
		(article?.promotions ?? []).length > 0,
	);
	const [articleDiscountValue, setArticleDiscountValue] = useState(
		article?.promotions?.[0]?.discount_value || "",
	);
	const [articlePromoType, setArticlePromoType] = useState<string>(
		article?.promotions?.[0]?.discount_type || "%",
	);
	const [articleDescriptionPromo, setArticleDescriptionPromo] = useState(
		article?.promotions?.[0]?.description || "",
	);
	const [articlePromoStart, setArticlePromoStart] = useState(
		article?.promotions?.[0]?.start_date || "",
	);
	const [articlePromoEnd, setArticlePromoEnd] = useState(
		article?.promotions?.[0]?.end_date || "",
	);

	//
	//
	// Si type = raquette : Caractéristiques technique
	const [rCharacteristicsWeight, setRCharacteristicsWeight] = useState(
		article?.tech_characteristics?.poids || "",
	);
	const [rCharacteristicsColor, setRCharacteristicsColor] = useState(
		article?.tech_characteristics?.couleur || "",
	);
	const [rCharacteristicsShape, setRCharacteristicsShape] = useState(
		article?.tech_characteristics?.forme || "",
	);
	const [rCharacteristicsFoam, setRCharacteristicsFoam] = useState(
		article?.tech_characteristics?.mousse || "",
	);
	const [rCharacteristicsSurface, setRCharacteristicsSurface] = useState(
		article?.tech_characteristics?.surface || "",
	);
	const [rCharacteristicsLevel, setRCharacteristicsLevel] = useState(
		article?.tech_characteristics?.niveau || "",
	);
	const [rCharacteristicsGender, setRCharacteristicsGender] = useState(
		article?.tech_characteristics?.genre || "",
	);
	//
	// Si type = raquette : Notes technique
	const [rcharacteristicsManiability, setRCharacteristicsManiability] =
		useState<number>(article?.tech_ratings?.maniabilité ?? 0);
	const [rCharacteristicsPower, setRCharacteristicsPower] = useState<number>(
		article?.tech_ratings?.puissance ?? 0,
	);
	const [rCharacteristicsComfort, setRCharacteristicsComfort] =
		useState<number>(article?.tech_ratings?.confort ?? 0);
	const [rCharacteristicsSpin, setRCharacteristicsSpin] = useState<number>(
		article?.tech_ratings?.effet ?? 0,
	);
	const [rCharacteristicsTolerance, setRCharacteristicsTolerance] =
		useState<number>(article?.tech_ratings?.tolerance ?? 0);
	const [rCharacteristicsControl, setRCharacteristicsControl] =
		useState<number>(article?.tech_ratings?.contrôle ?? 0);

	//
	//
	// Si type = sac : Caracteristiques technique
	const [bCharacteristicsWeight, setBCharacteristicsWeight] = useState(
		article?.tech_characteristics?.weight || "",
	);
	const [bCharacteristicsType, setBCharacteristicsType] = useState(
		article?.tech_characteristics?.type || "",
	);
	const [bCharacteristicsVolume, setBCharacteristicsVolume] = useState(
		article?.tech_characteristics?.volume || "",
	);
	const [bCharacteristicsDimensions, setBCharacteristicsDimensions] = useState(
		article?.tech_characteristics?.dimensions || "",
	);
	const [bCharacteristicsMaterial, setBCharacteristicsMaterial] = useState(
		article?.tech_characteristics?.material || "",
	);
	const [bCharacteristicsColor, setBCharacteristicsColor] = useState(
		article?.tech_characteristics?.color || "",
	);
	const [bCharacteristicsCompartment, setBCharacteristicsCompartment] =
		useState(article?.tech_characteristics?.compartment || "");
	//
	//
	// Si type = balles : Caracteristiques technique
	const [ballCharacteristicsWeight, setBallCharacteristicsWeight] = useState(
		article?.tech_characteristics?.weight || "",
	);
	const [ballCharacteristicsDiameter, setBallCharacteristicsDiameter] =
		useState(article?.tech_characteristics?.diameter || "");
	const [ballCharacteristicsRebound, setBallCharacteristicsRebound] = useState(
		article?.tech_characteristics?.rebound || "",
	);
	const [ballCharacteristicsPressure, setBallCharacteristicsPressure] =
		useState(article?.tech_characteristics?.pressure || "");
	const [ballCharacteristicsMaterial, setBallCharacteristicsMaterial] =
		useState(article?.tech_characteristics?.material || "");
	const [ballCharacteristicsColor, setBallCharacteristicsColor] = useState(
		article?.tech_characteristics?.color || "",
	);
	const [ballCharacteristicsType, setBallCharacteristicsType] = useState(
		article?.tech_characteristics?.type || "",
	);

	//
	//
	// Si type = Vêtement : Caracteristiques technique
	const [cCharacteristicsType, setCCharacteristicsType] = useState(
		article?.tech_characteristics?.type || "",
	);
	const [cCharacteristicsGender, setCCharacteristicsGender] = useState(
		article?.tech_characteristics?.gender || "",
	);
	const [cCharacteristicsMaterial, setCCharacteristicsMaterial] = useState(
		article?.tech_characteristics?.material || "",
	);
	const [cCharacteristicsColor, setCCharacteristicsColor] = useState(
		article?.tech_characteristics?.color || "",
	);
	const [cCharacteristicsSize, setCCharacteristicsSize] = useState<
		SizeOption[]
	>([
		{ label: "XS", stock: 0 },
		{ label: "S", stock: 0 },
		{ label: "M", stock: 0 },
		{ label: "L", stock: 0 },
		{ label: "XL", stock: 0 },
		{ label: "2XL", stock: 0 },
		{ label: "3XL", stock: 0 },
		{ label: "4XL", stock: 0 },
	]);
	//
	//
	// Si type = Chaussures : Caracteristiques technique
	const [sCharacteristicsWeight, setSCharacteristicsWeight] = useState(
		article?.tech_characteristics?.weight || "",
	);
	const [sCharacteristicsColor, setSCharacteristicsColor] = useState(
		article?.tech_characteristics?.color || "",
	);
	const [sCharacteristicsSole, setSCharacteristicsSole] = useState(
		article?.tech_characteristics?.sole || "",
	);
	const [sCharacteristicsGender, setSCharacteristicsGender] = useState(
		article?.tech_characteristics?.gender || "",
	);
	const [sCharacteristicsSize, setSCharacteristicsSize] = useState<
		SizeOption[]
	>([
		{ label: "36", stock: 0 },
		{ label: "37", stock: 0 },
		{ label: "38", stock: 0 },
		{ label: "39", stock: 0 },
		{ label: "40", stock: 0 },
		{ label: "41", stock: 0 },
		{ label: "42", stock: 0 },
		{ label: "43", stock: 0 },
		{ label: "44", stock: 0 },
		{ label: "45", stock: 0 },
		{ label: "46", stock: 0 },
	]);

	// gestion des marques
	const brands = Array.from(
		new Set(data.articles.map((article) => article.brand)),
	);

	// gestion des images
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const filesArray = Array.from(e.target.files).map((file) => ({
			id: crypto.randomUUID(), // ID unique
			file,
			previewUrl: URL.createObjectURL(file),
		}));

		setImages((prev) => [...prev, ...filesArray]);
		e.target.value = "";
	};

	// Suppression des images
	const handleDeleteImage = (id: string) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
	};

	// gestion du prix final apres promo
	let finalPrice = Number(articlePriceTTC);

	if (articlePromoType === "€") {
		finalPrice = finalPrice - Number(articleDiscountValue ?? 0);
	} else if (articlePromoType === "%") {
		finalPrice =
			finalPrice - (finalPrice * Number(articleDiscountValue ?? 0)) / 100;
	}

	if (finalPrice < 0) {
		finalPrice = 0;
	}

	// gestion des dates
	// Conversion en Date
	const startDate = articlePromoStart ? new Date(articlePromoStart) : null;
	const endDate = articlePromoEnd ? new Date(articlePromoEnd) : null;

	// Déterminer l'état
	const promoState = useMemo(() => {
		if (startDate && today < startDate) return "pending"; // pas commencé
		if (startDate && endDate && today >= startDate && today <= endDate)
			return "active"; // en cours
		if (endDate && today > endDate) return "expired"; // terminé
		return "unknown";
	}, [startDate, endDate, today]);

	// Gestion des taille de vêtements
	const handleChangeC = (index: number, value: string) => {
		const newSizes = [...cCharacteristicsSize];
		newSizes[index].stock = Number(value);
		setCCharacteristicsSize(newSizes);
	};

	// Gestion des taille de chaussures
	const handleChangeS = (index: number, value: string) => {
		const newSizes = [...sCharacteristicsSize];
		newSizes[index].stock = Number(value);
		setSCharacteristicsSize(newSizes);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("soumission du formulaire");
	};

	const handleDelete = () => {
		console.log("handleDelete");
	};

	return (
		<>
			<div>
				<div className="flex justify-between bg-gray-500/80 p-3 mt-7  h10">
					<h2 className="font-semibold text-lg xl:mt-0 flex justify-between">
						{title}
					</h2>
					<button type="button" onClick={handleDelete}>
						<img
							src="/icons/trash.svg"
							alt="poubelle"
							className="w-7 cursor-pointer"
						/>
					</button>
				</div>
				<div>
					<form onSubmit={handleSubmit}>
						<div className="xl:grid xl:grid-cols-3 gap-4">
							<div>
								<div className="border-b border-gray-400 xl:border-none mt-4 "></div>
								<ArticleForm
									articleType={articleType}
									setArticleType={setArticleType}
									articleName={articleName}
									setArticleName={setArticleName}
									articleDescription={articleDescription}
									setArticleDescription={setArticleDescription}
									articleReference={articleReference}
									setArticleReference={setArticleReference}
									articleBrand={articleBrand}
									setArticleBrand={setArticleBrand}
									brands={brands}
									images={images}
									handleImageChange={handleImageChange}
									handleDeleteImage={handleDeleteImage}
									articlePriceTTC={articlePriceTTC}
									setArticlePriceTTC={setArticlePriceTTC}
									articleQty={articleQty}
									setArticleQty={setArticleQty}
									articleShippingCost={articleShippingCost}
									setArticleShippingCost={setArticleShippingCost}
									articleStatus={articleStatus}
									setArticleStatus={setArticleStatus}
								/>
							</div>

							<div>
								{/* Appliquer une promo ? */}
								<div className="relative flex flex-col gap-2 mt-5">
									<div>
										<Toogle checked={articlePromo} onChange={setArticlePromo} />
									</div>

									{articlePromo && (
										<PromoForm
											articleDiscountValue={articleDiscountValue}
											setArticleDiscountValue={setArticleDiscountValue}
											articlePromoType={articlePromoType}
											setArticlePromoType={setArticlePromoType}
											finalPrice={finalPrice}
											articleDescriptionPromo={articleDescriptionPromo}
											setArticleDescriptionPromo={setArticleDescriptionPromo}
											articlePromoStart={articlePromoStart}
											setArticlePromoStart={setArticlePromoStart}
											articlePromoEnd={articlePromoEnd}
											setArticlePromoEnd={setArticlePromoEnd}
											promoState={promoState}
											today={today}
										/>
									)}
								</div>
								<div className="border-b border-gray-400 xl:border-none mt-4 "></div>
							</div>

							<div>
								{/* Si l'article est une raquette  */}
								{articleType === "racket" && (
									<RacketForm
										type={articleType}
										rCharacteristicsWeight={rCharacteristicsWeight}
										setRCharacteristicsWeight={setRCharacteristicsWeight}
										rCharacteristicsColor={rCharacteristicsColor}
										setRCharacteristicsColor={setRCharacteristicsColor}
										rCharacteristicsShape={rCharacteristicsShape}
										setRCharacteristicsShape={setRCharacteristicsShape}
										rCharacteristicsFoam={rCharacteristicsFoam}
										setRCharacteristicsFoam={setRCharacteristicsFoam}
										rCharacteristicsSurface={rCharacteristicsSurface}
										setRCharacteristicsSurface={setRCharacteristicsSurface}
										rCharacteristicsLevel={rCharacteristicsLevel}
										setRCharacteristicsLevel={setRCharacteristicsLevel}
										rCharacteristicsGender={rCharacteristicsGender}
										setRCharacteristicsGender={setRCharacteristicsGender}
										rcharacteristicsManiability={rcharacteristicsManiability}
										setRCharacteristicsManiability={
											setRCharacteristicsManiability
										}
										rCharacteristicsPower={rCharacteristicsPower}
										setRCharacteristicsPower={setRCharacteristicsPower}
										rCharacteristicsComfort={rCharacteristicsComfort}
										setRCharacteristicsComfort={setRCharacteristicsComfort}
										rCharacteristicsSpin={rCharacteristicsSpin}
										setRCharacteristicsSpin={setRCharacteristicsSpin}
										rCharacteristicsTolerance={rCharacteristicsTolerance}
										setRCharacteristicsTolerance={setRCharacteristicsTolerance}
										rCharacteristicsControl={rCharacteristicsControl}
										setRCharacteristicsControl={setRCharacteristicsControl}
									/>
								)}

								{/* Si l'article est un sac  */}
								{articleType === "bags" && (
									<BagForm
										type={articleType}
										bCharacteristicsWeight={bCharacteristicsWeight}
										setBCharacteristicsWeight={setBCharacteristicsWeight}
										bCharacteristicsType={bCharacteristicsType}
										setBCharacteristicsType={setBCharacteristicsType}
										bCharacteristicsVolume={bCharacteristicsVolume}
										setBCharacteristicsVolume={setBCharacteristicsVolume}
										bCharacteristicsDimensions={bCharacteristicsDimensions}
										setBCharacteristicsDimensions={
											setBCharacteristicsDimensions
										}
										bCharacteristicsMaterial={bCharacteristicsMaterial}
										setBCharacteristicsMaterial={setBCharacteristicsMaterial}
										bCharacteristicsColor={bCharacteristicsColor}
										setBCharacteristicsColor={setBCharacteristicsColor}
										bCharacteristicsCompartment={bCharacteristicsCompartment}
										setBCharacteristicsCompartment={
											setBCharacteristicsCompartment
										}
									/>
								)}

								{/* Si l'article est une balle  */}
								{articleType === "balls" && (
									<BallForm
										type={articleType}
										ballCharacteristicsWeight={ballCharacteristicsWeight}
										setBallCharacteristicsWeight={setBallCharacteristicsWeight}
										ballCharacteristicsDiameter={ballCharacteristicsDiameter}
										setBallCharacteristicsDiameter={
											setBallCharacteristicsDiameter
										}
										ballCharacteristicsRebound={ballCharacteristicsRebound}
										setBallCharacteristicsRebound={
											setBallCharacteristicsRebound
										}
										ballCharacteristicsPressure={ballCharacteristicsPressure}
										setBallCharacteristicsPressure={
											setBallCharacteristicsPressure
										}
										ballCharacteristicsMaterial={ballCharacteristicsMaterial}
										setBallCharacteristicsMaterial={
											setBallCharacteristicsMaterial
										}
										ballCharacteristicsColor={ballCharacteristicsColor}
										setBallCharacteristicsColor={setBallCharacteristicsColor}
										ballCharacteristicsType={ballCharacteristicsType}
										setBallCharacteristicsType={setBallCharacteristicsType}
									/>
								)}

								{/* Si l'article est un vêtement  */}
								{articleType === "clothing" && (
									<ClothingForm
										type={articleType}
										cCharacteristicsType={cCharacteristicsType}
										setCCharacteristicsType={setCCharacteristicsType}
										cCharacteristicsGender={cCharacteristicsGender}
										setCCharacteristicsGender={setCCharacteristicsGender}
										cCharacteristicsMaterial={cCharacteristicsMaterial}
										setCCharacteristicsMaterial={setCCharacteristicsMaterial}
										cCharacteristicsColor={cCharacteristicsColor}
										setCCharacteristicsColor={setCCharacteristicsColor}
										cCharacteristicsSize={cCharacteristicsSize}
										handleChangeC={handleChangeC}
									/>
								)}

								{/* Si l'article est une chaussure  */}
								{articleType === "shoes" && (
									<ShoesForm
										type={articleType}
										sCharacteristicsWeight={sCharacteristicsWeight}
										setSCharacteristicsWeight={setSCharacteristicsWeight}
										sCharacteristicsColor={sCharacteristicsColor}
										setSCharacteristicsColor={setSCharacteristicsColor}
										sCharacteristicsSole={sCharacteristicsSole}
										setSCharacteristicsSole={setSCharacteristicsSole}
										sCharacteristicsGender={sCharacteristicsGender}
										setSCharacteristicsGender={setSCharacteristicsGender}
										sCharacteristicsSize={sCharacteristicsSize}
										handleChangeS={handleChangeS}
									/>
								)}
							</div>
						</div>
						<div className="flex justify-center">
							<button
								type="submit"
								className="w-full xl:w-1/3  bg-green-500 text-white font-semibold p-2 rounded-lg mt-6"
							>
								{button}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
