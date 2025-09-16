import { useMemo, useState } from "react";
import data from "../../../data/dataTest.json";
import ArticleForm from "../../components/Form/CreateArticle/ArticleForm";
import BagForm from "../../components/Form/CreateArticle/BagForm";
import BallForm from "../../components/Form/CreateArticle/BallForm";
import ClothingForm from "../../components/Form/CreateArticle/ClothingForm";
import PromoForm from "../../components/Form/CreateArticle/PromoForm";
import RacketForm from "../../components/Form/CreateArticle/RacketForm";
import ShoesForm from "../../components/Form/CreateArticle/ShoesForm";
import Toogle from "../../components/Form/Toogle/Toogle";

type ImageWithId = {
	id: string;
	file: File;
	previewUrl: string;
};

export default function CreateArticle() {
	const today = new Date();

	const [articleType, setArticleType] = useState("");
	const [articleName, setArticleName] = useState("");
	const [articleDescription, setArticleDescription] = useState("");
	const [articleReference, setArticleReference] = useState("");
	const [articleBrand, setArticleBrand] = useState("");
	const [images, setImages] = useState<ImageWithId[]>([]);
	const [articlePriceTTC, setArticlePriceTTC] = useState("");
	const [articleQty, setArticleQty] = useState("");
	const [articleShippingCost, setArticleShippingCost] = useState("");
	const [articleStatus, setArticleStatus] = useState("");

	const [articlePromo, setArticlePromo] = useState(false);
	const [articleDiscountValue, setArticleDiscountValue] = useState("");
	const [articlePromoType, setArticlePromoType] = useState<string>("%");
	const [articleDescriptionPromo, setArticleDescriptionPromo] = useState("");
	const [articlePromoStart, setArticlePromoStart] = useState("");
	const [articlePromoEnd, setArticlePromoEnd] = useState("");

	// Si type = raquette : Caracteristiques technique
	const [rCharacteristicsWeight, setRCharacteristicsWeight] = useState("");
	const [rCharacteristicsColor, setRCharacteristicsColor] = useState("");
	const [rCharacteristicsShape, setRCharacteristicsShape] = useState("");
	const [rCharacteristicsFoam, setRCharacteristicsFoam] = useState("");
	const [rCharacteristicsSurface, setRCharacteristicsSurface] = useState("");
	const [rCharacteristicsLevel, setRCharacteristicsLevel] = useState("");
	const [rCharacteristicsGender, setRCharacteristicsGender] = useState("");
	// Si type = raquette : Notes technique
	const [rcharacteristicsManiability, setRCharacteristicsManiability] =
		useState("");
	const [rCharacteristicsPower, setRCharacteristicsPower] = useState("");
	const [rCharacteristicsComfort, setRCharacteristicsComfort] = useState("");
	const [rCharacteristicsSpin, setRCharacteristicsSpin] = useState("");
	const [rCharacteristicsTolerance, setRCharacteristicsTolerance] =
		useState("");
	const [rCharacteristicsControl, setRCharacteristicsControl] = useState("");

	// Si type = sac : Caracteristiques technique
	const [bCharacteristicsWeight, setBCharacteristicsWeight] = useState("");
	const [bCharacteristicsType, setBCharacteristicsType] = useState("");
	const [bCharacteristicsVolume, setBCharacteristicsVolume] = useState("");
	const [bCharacteristicsDimensions, setBCharacteristicsDimensions] =
		useState("");
	const [bCharacteristicsMaterial, setBCharacteristicsMaterial] = useState("");
	const [bCharacteristicsColor, setBCharacteristicsColor] = useState("");
	const [bCharacteristicsCompartment, setBCharacteristicsCompartment] =
		useState("");

	// Si type = balles : Caracteristiques technique
	const [ballCharacteristicsWeight, setBallCharacteristicsWeight] =
		useState("");
	const [ballCharacteristicsDiameter, setBallCharacteristicsDiameter] =
		useState("");
	const [ballCharacteristicsRebound, setBallCharacteristicsRebound] =
		useState("");
	const [ballCharacteristicsPressure, setBallCharacteristicsPressure] =
		useState("");
	const [ballCharacteristicsMaterial, setBallCharacteristicsMaterial] =
		useState("");
	const [ballCharacteristicsColor, setBallCharacteristicsColor] = useState("");
	const [ballCharacteristicsType, setBallCharacteristicsType] = useState("");

	// Si type = Vêtement : Caracteristiques technique
	const [cCharacteristicsType, setCCharacteristicsType] = useState("");
	const [cCharacteristicsGender, setCCharacteristicsGender] = useState("");
	const [cCharacteristicsMaterial, setCCharacteristicsMaterial] = useState("");
	const [cCharacteristicsColor, setCCharacteristicsColor] = useState("");
	const [cCharacteristicsSize, setCCharacteristicsSize] = useState([
		{ label: "XS", stock: 0 },
		{ label: "S", stock: 0 },
		{ label: "M", stock: 0 },
		{ label: "L", stock: 0 },
		{ label: "XL", stock: 0 },
		{ label: "2XL", stock: 0 },
		{ label: "3XL", stock: 0 },
		{ label: "4XL", stock: 0 },
	]);

	// Si type = Chaussures : Caracteristiques technique
	const [sCharacteristicsWeight, setSCharacteristicsWeight] = useState("");
	const [sCharacteristicsColor, setSCharacteristicsColor] = useState("");
	const [sCharacteristicsSole, setSCharacteristicsSole] = useState("");
	const [sCharacteristicsGender, setSCharacteristicsGender] = useState("");
	const [sCharacteristicsSize, setSCharacteristicsSize] = useState([
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
		const newSizes = [...cCharacteristicsSize];
		newSizes[index].stock = Number(value);
		setSCharacteristicsSize(newSizes);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("soumission du formulaire");
	};

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Création d'un article
				</h2>
				<div>
					<form onSubmit={handleSubmit}>
						<div>
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
							<div className="border-b border-gray-400 mt-4 "></div>
							<div className="relative flex flex-col gap-2 mt-5">
								{/* Appliquer une promo ? */}
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
							<div className="border-b border-gray-400 mt-4 "></div>

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
									setBCharacteristicsDimensions={setBCharacteristicsDimensions}
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
									setBallCharacteristicsRebound={setBallCharacteristicsRebound}
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
						<button
							type="submit"
							className="w-full bg-green-500 text-white font-semibold p-2 rounded-lg mt-6"
						>
							AJOUTER L'ARTICLE
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
