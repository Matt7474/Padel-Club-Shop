/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <explanation> */
import { useEffect, useMemo, useState } from "react";
import {
	addArticle,
	addTechRatings,
	attachPromoToArticle,
	deleteArticleById,
	detachPromoFromArticle,
	restoreArticleById,
	updateArticle,
	updatePromo,
	updateTechRatings,
	uploadArticleImages,
} from "../../../api/Article";
import { getBrands } from "../../../api/Brand";
import type Article from "../../../types/Article";
import type { ArticleImage, Brand, NewArticle } from "../../../types/Article";
import { getTechCharacteristicsState } from "../../../utils/ArticleHelpers";
import ArticleForm from "../CreateArticle/ArticleForm";
import BagForm from "../CreateArticle/BagForm";
import BallForm from "../CreateArticle/BallForm";
import ClothingForm from "../CreateArticle/ClothingForm";
import PromoForm from "../CreateArticle/PromoForm";
import RacketForm from "../CreateArticle/RacketForm";
import ShoesForm from "../CreateArticle/ShoesForm";
import Toogle from "../Toogle/Toogle";
import Button from "../Tools/Button";
import InfoModal from "../../Modal/InfoModal";
import type { Promotion } from "../../../types/Promotions";

type ImageWithId = {
	id: string;
	file: File;
	previewUrl: string;
	isExisting?: boolean;
	image_id?: number;
};

interface CreateArticlePropos {
	title?: string;
	buttonText?: string;
	article?: Article;
	mode: "create" | "edit";
	setMenuSelected?: React.Dispatch<React.SetStateAction<string>>;
	onReturn?: () => void;
	onUpdated?: () => void;
}

interface SizeOption {
	label: string;
	stock: number;
}

export default function CreateArticle({
	title,
	buttonText,
	article,
	mode,
	setMenuSelected,
	onReturn,
	onUpdated,
}: CreateArticlePropos) {
	const today = new Date();
	const [infoModal, setInfoModal] = useState<{ id: number; text: string }[]>(
		[],
	);
	const [noImage, setNoImage] = useState(false);

	const [articleType, setArticleType] = useState(article?.type || "");
	const [articleName, setArticleName] = useState(article?.name || "");
	const [articleDescription, setArticleDescription] = useState(
		article?.description || "",
	);
	const [articleReference, setArticleReference] = useState(
		article?.reference || "",
	);
	const [articleBrand, setArticleBrand] = useState<number | null>(
		article?.brand?.brand_id ?? null,
	);

	const [images, setImages] = useState<ImageWithId[]>(() => {
		if (!article?.images) return [];

		return article.images.map((img: ArticleImage) => ({
			id: img.image_id?.toString() || crypto.randomUUID(),
			file: {} as File,
			previewUrl: `${import.meta.env.VITE_API_URL}${img.url}`,
			isExisting: true,
			image_id: img.image_id,
		}));
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

	const [articleNamePromo, setArticleNamePromo] = useState(
		article?.promotions?.[0]?.name || "",
	);

	const [articleDescriptionPromo, setArticleDescriptionPromo] = useState(
		article?.promotions?.[0]?.description || "",
	);
	const formatDateForInput = (dateString?: string) => {
		if (!dateString) return "";
		return dateString.split("T")[0];
	};

	const [articlePromoStart, setArticlePromoStart] = useState(
		formatDateForInput(article?.promotions?.[0]?.start_date),
	);
	const [articlePromoEnd, setArticlePromoEnd] = useState(
		formatDateForInput(article?.promotions?.[0]?.end_date),
	);

	//
	//
	// Si type = raquette : Caractéristiques technique
	const [rCharacteristicsWeight, setRCharacteristicsWeight] = useState(
		article?.tech_characteristics?.weight || "",
	);
	const [rCharacteristicsColor, setRCharacteristicsColor] = useState(
		article?.tech_characteristics?.color || "",
	);
	const [rCharacteristicsShape, setRCharacteristicsShape] = useState(
		article?.tech_characteristics?.shape || "",
	);
	const [rCharacteristicsFoam, setRCharacteristicsFoam] = useState(
		article?.tech_characteristics?.foam || "",
	);
	const [rCharacteristicsSurface, setRCharacteristicsSurface] = useState(
		article?.tech_characteristics?.surface || "",
	);
	const [rCharacteristicsLevel, setRCharacteristicsLevel] = useState(
		article?.tech_characteristics?.level || "",
	);
	const [rCharacteristicsGender, setRCharacteristicsGender] = useState(
		article?.tech_characteristics?.gender || "",
	);
	//
	// Si type = raquette : Notes technique
	const [rcharacteristicsManiability, setRCharacteristicsManiability] =
		useState<number>(article?.ratings?.maneuverability ?? 0);
	const [rCharacteristicsPower, setRCharacteristicsPower] = useState<number>(
		article?.ratings?.power ?? 0,
	);
	const [rCharacteristicsComfort, setRCharacteristicsComfort] =
		useState<number>(article?.ratings?.comfort ?? 0);
	const [rCharacteristicsSpin, setRCharacteristicsSpin] = useState<number>(
		article?.ratings?.spin ?? 0,
	);
	const [rCharacteristicsTolerance, setRCharacteristicsTolerance] =
		useState<number>(article?.ratings?.tolerance ?? 0);
	const [rCharacteristicsControl, setRCharacteristicsControl] =
		useState<number>(article?.ratings?.control ?? 0);

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

	const [brands, setBrands] = useState<Brand[]>([]);

	useEffect(() => {
		getBrands()
			.then((data) => {
				console.log("brands API:", data);
				setBrands(data);
			})
			.catch((err) => console.error(err));
	}, []);

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
		const imageToDelete = images.find((img) => img.id === id);

		// Si c'est une image existante (de la BDD)
		if (imageToDelete?.isExisting && imageToDelete.image_id) {
		}
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

	// Arrondi à 2 décimales
	finalPrice = Number(finalPrice.toFixed(2));

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!articleBrand) {
				alert("⚠️ Veuillez sélectionner une marque");
				return;
			}

			// Prépare l'objet commun pour création ou édition
			const newArticle: NewArticle = {
				type: articleType,
				name: articleName,
				description: articleDescription || undefined,
				// reference: articleReference || undefined,
				brand_id: articleBrand,
				price_ttc: Number(articlePriceTTC),
				stock_quantity: Number(articleQty) || 0,
				status: articleStatus as
					| "available"
					| "preorder"
					| "out_of_stock"
					| undefined,
				shipping_cost: articleShippingCost
					? Number(articleShippingCost)
					: undefined,
				tech_characteristics: getTechCharacteristicsState(articleType, {
					// Raquette
					rCharacteristicsWeight,
					rCharacteristicsColor,
					rCharacteristicsShape,
					rCharacteristicsFoam,
					rCharacteristicsSurface,
					rCharacteristicsLevel,
					rCharacteristicsGender,
					// Sac
					bCharacteristicsWeight,
					bCharacteristicsType,
					bCharacteristicsVolume,
					bCharacteristicsDimensions,
					bCharacteristicsMaterial,
					bCharacteristicsColor,
					bCharacteristicsCompartment,
					// Balles
					ballCharacteristicsWeight,
					ballCharacteristicsDiameter,
					ballCharacteristicsRebound,
					ballCharacteristicsPressure,
					ballCharacteristicsMaterial,
					ballCharacteristicsColor,
					ballCharacteristicsType,
					// Vêtements
					cCharacteristicsType,
					cCharacteristicsGender,
					cCharacteristicsMaterial,
					cCharacteristicsColor,
					cCharacteristicsSize,
					// Chaussures
					sCharacteristicsWeight,
					sCharacteristicsColor,
					sCharacteristicsSole,
					sCharacteristicsGender,
					sCharacteristicsSize,
				}),
				promotions:
					articleDiscountValue && Number(articleDiscountValue) > 0
						? [
								{
									name: articleNamePromo,
									description: articleDescriptionPromo,
									discount_type: articlePromoType || "%",
									discount_value: Number(articleDiscountValue),
									start_date: articlePromoStart,
									end_date: articlePromoEnd,
									status: "active",
								},
							]
						: undefined,
			};

			console.log("articlePromo", articlePromo);

			// Si aucune image sélectionnée en création
			if (mode === "create" && images.length === 0) {
				setNoImage(true);
				return;
			}

			let articleRes: Article | undefined;
			let articleId: number;

			if (mode === "create") {
				articleRes = await addArticle(newArticle);
				articleId = articleRes.article_id;

				if (images.length > 0) {
					await uploadArticleImages(articleId, images);
				}

				if (articleType === "racket") {
					await addTechRatings(articleId, {
						maneuverability: rcharacteristicsManiability,
						power: rCharacteristicsPower,
						comfort: rCharacteristicsComfort,
						spin: rCharacteristicsSpin,
						tolerance: rCharacteristicsTolerance,
						control: rCharacteristicsControl,
					});
				}

				// if (newArticle.promotions?.[0]) {
				// 	await attachPromoToArticle(articleId, newArticle.promotions[0]);
				// }
			}

			onReturn?.();

			// 🟠 MODE ÉDITION
			if (mode === "edit" && article) {
				articleId = article.article_id;

				await updateArticle(articleId, newArticle);

				const newImages = images.filter((img) => !img.isExisting);
				if (newImages.length > 0) {
					await uploadArticleImages(articleId, newImages);
				}

				if (articleType === "racket") {
					await updateTechRatings(articleId, {
						maneuverability: rcharacteristicsManiability,
						power: rCharacteristicsPower,
						comfort: rCharacteristicsComfort,
						spin: rCharacteristicsSpin,
						tolerance: rCharacteristicsTolerance,
						control: rCharacteristicsControl,
					});
				}

				// ✅ Gestion des promotions
				const existingPromo = article.promotions?.[0] ?? null;
				const newPromoData = newArticle.promotions?.[0] ?? null;

				// L'utilisateur veut une promo
				if (articlePromo === true) {
					if (newPromoData) {
						if (existingPromo) {
							// Modifier la promo existante
							console.log("📝 Modification de la promo existante");
							await updatePromo(
								existingPromo.promo_id,
								newPromoData,
								articleId,
							);
						} else {
							// Créer une nouvelle promo
							console.log("➕ Création d'une nouvelle promo");
							await attachPromoToArticle(articleId, newPromoData);
						}
					}
				}
				// L'utilisateur ne veut plus de promo
				else if (articlePromo === false) {
					if (existingPromo) {
						console.log("🗑️ Suppression de la promo existante");
						await detachPromoFromArticle(articleId, existingPromo.promo_id);
					}
				}
				// Cas 3 : Pas de promo avant, pas de promo après → rien à faire
			}

			setInfoModal((prev) => [
				...prev,
				{
					id: Date.now(),
					text:
						mode === "edit"
							? "Article modifié avec succès"
							: "Article créé avec succès",
				},
			]);

			onUpdated?.();
			onReturn?.();
			if (setMenuSelected) setMenuSelected("null");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la sauvegarde de l'article");
		}
	};

	const handleDelete = (id: number | undefined) => {
		if (!id) return;
		deleteArticleById(id);
		console.log("handleDelete", id);
		alert("Article supprimé avec succés");
	};
	const handleRestore = (id: number | undefined) => {
		if (!id) return;
		restoreArticleById(id);
		console.log("handleRestore", id);
		alert("Article restauré avec succés");
	};

	const removeInfoModal = (id: number) => {
		setInfoModal((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<>
			<div>
				{mode === "edit" && (
					<button
						type="button"
						onClick={onReturn}
						className="flex mt-4 cursor-pointer"
					>
						<img
							src="/icons/arrow.svg"
							alt="fleche retour"
							className="w-4 rotate-180"
						/>
						Retour
					</button>
				)}

				<div className="flex justify-between bg-gray-500/80 p-3 mt-7 xl:mt-4 h10">
					<h2 className="font-semibold text-lg xl:mt-0 flex justify-between">
						{title}
					</h2>
					{mode === "edit" &&
						(article?.is_deleted === false ? (
							<div className="flex items-center">
								<p>Archiver l'article ?</p>
								<button
									type="button"
									onClick={() => handleDelete(article?.article_id)}
								>
									<img
										src="/icons/trash2.svg"
										alt="poubelle"
										className="w-6 cursor-pointer ml-2"
									/>
								</button>
							</div>
						) : (
							<div className="flex items-center">
								<p>Restaurer l'article ?</p>
								<button
									type="button"
									onClick={() => handleRestore(article?.article_id)}
								>
									<img
										src="/icons/restore3.svg"
										alt="restaurer"
										className="w-8 cursor-pointer ml-2"
									/>
								</button>
							</div>
						))}
				</div>
				<div>
					<form onSubmit={handleSubmit}>
						<div className="xl:grid xl:grid-cols-3 gap-4">
							<div>
								<div className="border-b border-gray-400 xl:border-none mt-2 "></div>
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
									noImage={noImage}
									mode={mode}
								/>
							</div>

							<div>
								{/* Appliquer une promo ? */}
								<div className="relative flex flex-col gap-2 mt-5">
									<div>
										<Toogle
											title="Appliquer une promo à cet article ?"
											checked={articlePromo}
											onChange={setArticlePromo}
										/>
									</div>

									{articlePromo && (
										<PromoForm
											articleDiscountValue={articleDiscountValue}
											setArticleDiscountValue={setArticleDiscountValue}
											articlePromoType={articlePromoType}
											setArticlePromoType={setArticlePromoType}
											finalPrice={finalPrice}
											articleNamePromo={articleNamePromo}
											setArticleNamePromo={setArticleNamePromo}
											articleDescriptionPromo={articleDescriptionPromo}
											setArticleDescriptionPromo={setArticleDescriptionPromo}
											articlePromoStart={articlePromoStart}
											setArticlePromoStart={setArticlePromoStart}
											articlePromoEnd={articlePromoEnd}
											setArticlePromoEnd={setArticlePromoEnd}
											promoState={promoState}
											today={today}
											formatDateForInput={formatDateForInput}
											promoId={
												(article?.promotions?.[0] as unknown as Promotion)
													?.promo_id
											}
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
								{articleType === "bag" && (
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
								{articleType === "ball" && (
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
						<div className="xl:flex xl:justify-center xl:w-1/3 mx-auto">
							<Button type="submit" buttonText={`${buttonText}`} />
						</div>
					</form>
				</div>
			</div>
			{infoModal.map((infoModal) => (
				<InfoModal
					key={infoModal.id}
					id={infoModal.id}
					bg="bg-green-500"
					text={infoModal.text}
					onClose={removeInfoModal}
				/>
			))}
		</>
	);
}
