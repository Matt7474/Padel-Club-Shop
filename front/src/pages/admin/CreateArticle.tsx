import { useMemo, useState } from "react";
import data from "../../../data/dataTest.json";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import TechRatings from "../../components/form/TechRatings";
import TextArea from "../../components/form/TextArea";
import Toogle from "../../components/Toogle/Toogle";
import ToogleType from "../../components/Toogle/ToogleType";

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
	const [articlePromoType, setArticlePromoType] = useState<"€" | "%">("%");
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

	// Si type = Vêtement : Caracteristiques technique
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

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Création d'un article
				</h2>
				<div>
					<form action="">
						<div>
							{/* Type de l'article */}
							<div className="flex gap-4">
								{/* select du type */}
								<div className="w-full ">
									<Select
										label="Choisir un type d'article"
										value={articleType}
										onChange={setArticleType}
										options={[
											"racket",
											"bags",
											"balls",
											"clothing",
											"shoes",
											"accessories",
										]}
										labels={[
											"Raquette",
											"Sac",
											"Balle",
											"Vêtement",
											"Chaussure",
											"Accessoire",
										]}
									/>
								</div>

								{/* image du statut */}
								<div className="w-3/10 mt-4 flex justify-center">
									<img
										src={
											articleType
												? `/categories/${articleType}.avif`
												: `/brands/no-image.svg`
										}
										alt={
											articleBrand ? `logo ${articleType}` : "logo par défaut"
										}
										className="w-9.5 h-10 border border-transparent"
									/>
								</div>
							</div>
							{/* Nom de l'article */}
							<div>
								<Input
									htmlFor={"name"}
									label={"Nom de l'article"}
									type={"text"}
									value={articleName}
									onChange={setArticleName}
									width="w-full"
								/>
							</div>
							{/* Description de l'article */}
							<div className="">
								<TextArea
									label="Description de l'article"
									placeholder="La Bullpadel Vertex 03 Control est une raquette haut de gamme ..."
									length={articleDescription.length}
									value={articleDescription}
									onChange={setArticleDescription}
									maxLength={300}
								/>
							</div>
							{/* Reference de l'article */}
							<div className="-mt-1.5">
								<Input
									htmlFor={"reference"}
									label={"Reférence de l'article"}
									type={"text"}
									value={articleReference}
									onChange={setArticleReference}
									width="w-full"
								/>
							</div>
							<div className="flex gap-4">
								{/* Marque de l'article */}
								<div className="w-full ">
									<Select
										label="Choisir une marque"
										value={articleBrand}
										onChange={setArticleBrand}
										options={brands}
										labels={brands.map(
											(b) => b.charAt(0).toUpperCase() + b.slice(1),
										)}
									/>
								</div>

								{/* image de la marque */}
								<div className="w-3/10 mt-4">
									<img
										src={
											articleBrand
												? `/brands/${articleBrand}.svg`
												: `/brands/no-image.svg`
										}
										alt={
											articleBrand ? `logo ${articleBrand}` : "logo par défaut"
										}
										className="w-25 h-9.5"
									/>
								</div>
							</div>
							{/* image de l'article */}
							<div>
								<div className="relative">
									<input
										id="file-upload"
										type="file"
										multiple
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>

									<label
										htmlFor="file-upload"
										className="border mt-4 h-10 flex max-w-[100%] pt-3 pl-3 z-200 w-full cursor-pointer"
									>
										<p className="absolute text-gray-500 text-xs top-0 left-1">
											Sélectionnez des images
										</p>
									</label>

									<button
										type="button"
										onClick={() =>
											document.getElementById("file-upload")?.click()
										}
										className="absolute right-1 top-1"
									>
										<img
											src="/icons/add-item.svg"
											alt="Ajouter des images"
											className="w-8"
										/>
									</button>
								</div>

								{/* preview */}
								<div className="grid grid-cols-7 w-full gap-2 mt-2">
									{images.map((img) => (
										<div key={img.id} className="relative group w-10 h-10">
											{/* Image */}
											<img
												src={img.previewUrl}
												alt="preview"
												className="w-full h-full object-cover rounded-md group-hover:brightness-50"
											/>

											{/* Bouton X */}
											<button
												type="button"
												onClick={() => handleDeleteImage(img.id)}
												className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-1.5 text-red-500 rounded-full cursor-pointer flex items-center justify-center text-5xl opacity-0 group-hover:opacity-100 "
											>
												×
											</button>
										</div>
									))}
								</div>
							</div>
							<div className="grid grid-cols-3 gap-4">
								{/* Prix de l'article */}
								<div className="-mt-2 relative">
									<Input
										htmlFor={"price_ttc"}
										label={"Prix TTC"}
										type={"number"}
										value={articlePriceTTC}
										onChange={setArticlePriceTTC}
										width="w-full"
										suffixe="€"
									/>
								</div>

								{/* Stock de l'article */}
								<div className="-mt-2">
									<Input
										htmlFor={"quantity"}
										label={"Quantité"}
										type={"number"}
										value={articleQty}
										onChange={setArticleQty}
										width="w-full"
									/>
								</div>

								{/* Frais d'envoi de l'article */}
								<div className="-mt-2 relative">
									<Input
										htmlFor={"shippingCost"}
										label={"Frais d'envoi"}
										type={"number"}
										value={articleShippingCost}
										onChange={setArticleShippingCost}
										width="w-full"
										suffixe="€"
									/>
								</div>
							</div>
							{/* Statut de l'article */}
							<div className="flex gap-4">
								{/* select du statut */}
								<div className="w-full ">
									<Select
										label="Choisir un statut"
										value={articleStatus}
										onChange={setArticleStatus}
										options={["available", "preorder", "out_of_stock"]}
										labels={["Disponible", "En commande", "Pas de stock"]}
									/>
								</div>

								{/* image du statut */}
								<div className="w-3/10 mt-4">
									<img
										src={
											articleStatus
												? `/icons/${articleStatus}.svg`
												: `/brands/no-image.svg`
										}
										alt={
											articleBrand ? `logo ${articleStatus}` : "logo par défaut"
										}
										className="w-25 h-9.5"
									/>
								</div>
							</div>
							<div className="border-b border-gray-400 mt-4 "></div>
							<div className="relative flex flex-col gap-2 mt-5">
								{/* Appliquer une promo ? */}
								<div>
									<Toogle checked={articlePromo} onChange={setArticlePromo} />
								</div>

								{articlePromo && (
									<div className="grid grid-cols-3 gap-4 mt-4 relative">
										{/* Montant de la promo */}
										<div className="-mt-5">
											<div className="relative">
												<Input
													htmlFor={"discount_value"}
													label={"Montant promo"}
													type={"number"}
													value={articleDiscountValue}
													onChange={setArticleDiscountValue}
												/>
											</div>
										</div>

										<div className="flex justify-center">
											<ToogleType
												value={articlePromoType}
												onChange={setArticlePromoType}
											/>
										</div>

										<div>
											<div className="relative border border-orange-400 px-2 pt-3.5 text-md -mt-1 bg-white h-10 ">
												{finalPrice}
												<span className="absolute text-md top-0 pt-4 right-2 pl-2 border-l">
													€
												</span>
												<p className="absolute text-gray-500 text-xs top-0 left-1">
													Prix final vente
												</p>
											</div>
										</div>
									</div>
								)}

								{/* Description de la promo */}
								<div>
									{articlePromo && (
										<div className="-mt-1">
											<TextArea
												label="Description de la promotion"
												placeholder="Jusqu'à épuisement des stock"
												length={articleDescriptionPromo.length}
												value={articleDescriptionPromo}
												onChange={setArticleDescriptionPromo}
												maxLength={50}
											/>
										</div>
									)}
								</div>

								{/* Dates de la promo */}
								{articlePromo && (
									<div className="flex gap-4 -mt-3 text-sm -pr-2">
										<div>
											<Input
												htmlFor={"startDate"}
												label={"Début de la promo"}
												type={"date"}
												value={articlePromoStart}
												onChange={setArticlePromoStart}
												width="w-30"
												// date min = aujourd’hui
												min={today.toISOString().split("T")[0]}
											/>
										</div>

										<div>
											<Input
												htmlFor={"endDate"}
												label={"Fin de la promo"}
												type={"date"}
												value={articlePromoEnd}
												onChange={setArticlePromoEnd}
												width="w-30"
												// date max >= début
												min={
													articlePromoStart || today.toISOString().split("T")[0]
												}
											/>
										</div>

										<div className="w-3/10 mt-4">
											{promoState === "pending" && (
												<div className="w-full border border-[#1CBCF2] h-10 bg-[#1CBCF2] relative flex justify-center items-center">
													<p className="text-md  absolute">En attente</p>
												</div>
											)}
											{promoState === "active" && (
												<div className="w-full border border-[#65D778] h-10 bg-[#65D778] relative flex justify-center items-center">
													<p className="text-md  absolute">Active</p>
												</div>
											)}
											{promoState === "expired" && (
												<div className="w-full border border-[#E64C4C] h-10 bg-[#E64C4C] relative flex justify-center items-center">
													<p className="text-md  absolute">Expiré</p>
												</div>
											)}
											{promoState === "unknown" && (
												<div className="w-full border border-transparent h-10 relative flex justify-center items-center">
													<p className="text-md  absolute">En attente</p>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
							<div className="border-b border-gray-400 mt-4 "></div>

							{/* Si l'article est une raquette  */}
							{articleType === "racket" && (
								<div className="mt-4">
									<div>
										<p>Caracteristiques technique</p>
										<div className="grid grid-cols-2 gap-4 relative">
											{/* Poids de la raquette  */}
											<Input
												htmlFor={"rCharacteristicsWeight"}
												label={"Poids"}
												type={"text"}
												value={rCharacteristicsWeight}
												onChange={setRCharacteristicsWeight}
												width="w-full"
												suffixe="g"
											/>

											{/* Couleur de la raquette  */}
											<Input
												htmlFor={"rCharacteristicsColor"}
												label={"Couleur"}
												type={"text"}
												value={rCharacteristicsColor}
												onChange={setRCharacteristicsColor}
												width="w-full"
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											{/* Forme de la raquette  */}
											<Select
												label="Forme"
												value={rCharacteristicsShape}
												onChange={setRCharacteristicsShape}
												options={["teardrop", "diamond", "spherical"]}
												labels={["Goutte d'eau", "Diamand", "sphérique"]}
											/>

											{/* Mousse de la raquette  */}
											<Input
												htmlFor={"rCharacteristicsFoam"}
												label={"Mousse"}
												type={"text"}
												value={rCharacteristicsFoam}
												onChange={setRCharacteristicsFoam}
												width="w-full"
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											{/* Surface de la raquette  */}
											<Input
												htmlFor={"rCharacteristicsSurface"}
												label={"Surface"}
												type={"text"}
												value={rCharacteristicsSurface}
												onChange={setRCharacteristicsSurface}
												width="w-full"
											/>

											{/* Niveau de la raquette  */}
											<Select
												label="Niveau"
												value={rCharacteristicsLevel}
												onChange={setRCharacteristicsLevel}
												options={[
													"beginner",
													"intermediate",
													"advanced",
													"allLevels",
												]}
												labels={[
													"Débutant",
													"Intermédiaire",
													"Avancé",
													"Tout niveau",
												]}
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											{/* Genre de la raquette  */}
											<Select
												label="Genre"
												value={rCharacteristicsGender}
												onChange={setRCharacteristicsGender}
												options={["men", "woman", "unisex"]}
												labels={["Homme", "Femme", "Mixte"]}
											/>
										</div>
									</div>
									<div className="border-b border-gray-400 mt-4 "></div>
									<div className="mt-4 ">
										<p>Notes technique</p>
										<div className="grid grid-cols-3 gap-4">
											{/* Maniabilité de la raquette  */}
											<TechRatings
												label="Maniabilité"
												value={rcharacteristicsManiability}
												onChange={setRCharacteristicsManiability}
											/>

											{/* Puissance de la raquette  */}
											<TechRatings
												label="Puissance"
												value={rCharacteristicsPower}
												onChange={setRCharacteristicsPower}
											/>

											{/* Confort de la raquette  */}
											<TechRatings
												label="Confort"
												value={rCharacteristicsComfort}
												onChange={setRCharacteristicsComfort}
											/>

											{/* Effet de la raquette  */}
											<TechRatings
												label="Effet"
												value={rCharacteristicsSpin}
												onChange={setRCharacteristicsSpin}
											/>

											{/* Tolérance de la raquette  */}
											<TechRatings
												label="Tolérance"
												value={rCharacteristicsTolerance}
												onChange={setRCharacteristicsTolerance}
											/>

											{/* Contrôle de la raquette  */}
											<TechRatings
												label="Contrôle"
												value={rCharacteristicsControl}
												onChange={setRCharacteristicsControl}
											/>
										</div>
									</div>
									<div className="border-b border-gray-400 mt-4 "></div>
								</div>
							)}

							{/* Si l'article est un sac  */}
							{articleType === "bags" && (
								<div>
									<p className="mt-4">Caracteristiques technique</p>
									<div className="grid grid-cols-3 gap-x-4">
										{/* Poids du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsWeight"}
												label={"Poids"}
												type={"text"}
												value={bCharacteristicsWeight}
												onChange={setBCharacteristicsWeight}
												width="w-full"
												suffixe="g"
											/>
										</div>

										{/* Type du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsType"}
												label={"Type de sac"}
												type={"text"}
												value={bCharacteristicsType}
												onChange={setBCharacteristicsType}
												width="w-full"
											/>
										</div>

										{/* Volume du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsVolume"}
												label={"Volume"}
												type={"text"}
												value={bCharacteristicsVolume}
												onChange={setBCharacteristicsVolume}
												width="w-full"
												suffixe="L"
											/>
										</div>

										{/* Dimensions du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsDimensions"}
												label={"Dimensions"}
												type={"text"}
												value={bCharacteristicsDimensions}
												onChange={setBCharacteristicsDimensions}
												width="w-full"
												suffixe="cm"
											/>
										</div>

										{/* Materiaux du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsMaterial"}
												label={"Materiaux"}
												type={"text"}
												value={bCharacteristicsMaterial}
												onChange={setBCharacteristicsMaterial}
												width="w-full"
											/>
										</div>

										{/* Couleur du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsColor"}
												label={"Couleur"}
												type={"text"}
												value={bCharacteristicsColor}
												onChange={setBCharacteristicsColor}
												width="w-full"
											/>
										</div>

										{/* Compartiments du sac */}
										<div className="relative">
											<Input
												htmlFor={"bCharacteristicsCompartment"}
												label={"Compartiments"}
												type={"text"}
												value={bCharacteristicsCompartment}
												onChange={setBCharacteristicsCompartment}
												width="w-full"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Si l'article est une balle  */}
							{articleType === "balls" && (
								<div>
									<p className="mt-4">Caracteristiques technique</p>
									<div className="grid grid-cols-3 gap-x-4">
										{/* Poids de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsWeight"}
												label={"Poids"}
												type={"text"}
												value={ballCharacteristicsWeight}
												onChange={setBallCharacteristicsWeight}
												width="w-full"
												suffixe="g"
											/>
										</div>

										{/* Diamètre de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsDiameter"}
												label={"Diamètre"}
												type={"text"}
												value={ballCharacteristicsDiameter}
												onChange={setBallCharacteristicsDiameter}
												width="w-full"
												suffixe="cm"
											/>
										</div>

										{/* Rebond de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsRebound"}
												label={"Rebond"}
												type={"text"}
												value={ballCharacteristicsRebound}
												onChange={setBallCharacteristicsRebound}
												width="w-full"
											/>
										</div>

										{/* Préssion de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsPressure"}
												label={"Préssion"}
												type={"text"}
												value={ballCharacteristicsPressure}
												onChange={setBallCharacteristicsPressure}
												width="w-full"
												suffixe="kg/cm²"
											/>
										</div>

										{/* Matière de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsMaterial"}
												label={"Matière"}
												type={"text"}
												value={ballCharacteristicsMaterial}
												onChange={setBallCharacteristicsMaterial}
												width="w-full"
											/>
										</div>

										{/* Couleur de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsColor"}
												label={"Couleur"}
												type={"text"}
												value={ballCharacteristicsColor}
												onChange={setBallCharacteristicsColor}
												width="w-full"
											/>
										</div>

										{/* Type de la balle */}
										<div className="relative">
											<Input
												htmlFor={"ballCharacteristicsType"}
												label={"Type"}
												type={"text"}
												value={ballCharacteristicsType}
												onChange={setBallCharacteristicsType}
												width="w-full"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Si l'article est un vêtement  */}
							{articleType === "clothing" && (
								<div>
									<p className="mt-4">Caracteristiques technique</p>
									<div className="grid grid-cols-2 gap-x-4">
										{/* Type du vêtement */}
										<Select
											label="Type"
											value={cCharacteristicsType}
											onChange={setCCharacteristicsType}
											options={["skirt", "Short", "Polo", "T-shirt"]}
											labels={["Robe", "Short", "Polo", "T-shirt"]}
										/>

										{/* Genre du vêtement  */}
										<div>
											<Select
												label="Genre"
												value={cCharacteristicsGender}
												onChange={setCCharacteristicsGender}
												options={["men", "woman", "unisex"]}
												labels={["Homme", "Femme", "Mixte"]}
											/>
										</div>

										{/* Materiaux du vêtement  */}
										<div className="relative">
											<Input
												htmlFor={"cCharacteristicsMaterial"}
												label={"Materiaux"}
												type={"text"}
												value={cCharacteristicsMaterial}
												onChange={setCCharacteristicsMaterial}
												width="w-full"
											/>
										</div>

										{/* Couleur du vêtement  */}
										<div className="relative">
											<Input
												htmlFor={"cCharacteristicsColor"}
												label={"Couleur"}
												type={"text"}
												value={cCharacteristicsColor}
												onChange={setCCharacteristicsColor}
												width="w-full"
											/>
										</div>
									</div>

									<p className="mt-4 text-sm text-gray-600">
										Quantité d'articles par taille
									</p>
									<div className="grid grid-cols-4 gap-x-4 -mt-3">
										{/* Gestion des tailles de vêtement */}
										{cCharacteristicsSize.map((cCharacteristicsSize, index) => (
											<Input
												key={cCharacteristicsSize.label}
												htmlFor={`size-${cCharacteristicsSize.label}`}
												label={`${cCharacteristicsSize.label} Qté`}
												type="number"
												value={cCharacteristicsSize.stock.toString()}
												onChange={(val) => handleChangeC(index, val)}
												width="w-full"
											/>
										))}
									</div>
								</div>
							)}

							{/* Si l'article est une chaussure  */}
							{articleType === "shoes" && (
								<div>
									<p className="mt-4">Caracteristiques technique</p>
									<div className="grid grid-cols-2 gap-x-4">
										{/* Poids des chaussures */}
										<div className="relative">
											<Input
												htmlFor={"sCharacteristicsWeight"}
												label={"Poids"}
												type={"text"}
												value={sCharacteristicsWeight}
												onChange={setSCharacteristicsWeight}
												width="w-full"
												suffixe="g"
											/>
										</div>

										{/* Couleur des chaussures */}
										<div className="relative">
											<Input
												htmlFor={"sCharacteristicsColor"}
												label={"Couleur"}
												type={"text"}
												value={sCharacteristicsColor}
												onChange={setSCharacteristicsColor}
												width="w-full"
											/>
										</div>

										{/* Semelle des chaussures */}
										<div className="relative">
											<Select
												label="Type"
												value={sCharacteristicsSole}
												onChange={setSCharacteristicsSole}
												options={["hybrid", "clay", "padel", "all-court"]}
												labels={[
													"hybride",
													"terre battue",
													"padel",
													"tous terrains",
												]}
											/>
										</div>

										{/* Genre des chaussures */}
										<div>
											<Select
												label="Genre"
												value={sCharacteristicsGender}
												onChange={setSCharacteristicsGender}
												options={["men", "woman", "unisex"]}
												labels={["Homme", "Femme", "Mixte"]}
											/>
										</div>
									</div>

									<p className="mt-4 text-sm text-gray-600">
										Quantité d'articles par taille
									</p>
									<div className="grid grid-cols-4 gap-x-4 -mt-3">
										{/* Gestion des tailles de vêtement */}
										{sCharacteristicsSize.map((sCharacteristicsSize, index) => (
											<Input
												key={sCharacteristicsSize.label}
												htmlFor={`size-${sCharacteristicsSize.label}`}
												label={`${sCharacteristicsSize.label} Qté`}
												type="number"
												value={sCharacteristicsSize.stock.toString()}
												onChange={(val) => handleChangeS(index, val)}
												width="w-full"
											/>
										))}
									</div>
								</div>
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
