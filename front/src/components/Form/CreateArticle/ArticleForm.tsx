import type { Brand } from "../../../types/Article";
import Input from "../Tools/Input";
import Select from "../Tools/Select";
import TextArea from "../Tools/TextArea";

interface ArticleFormProps {
	articleType: string;
	setArticleType: (val: string) => void;
	articleName: string;
	setArticleName: (val: string) => void;
	articleDescription: string;
	setArticleDescription: (val: string) => void;
	articleReference: string;
	setArticleReference: (val: string) => void;
	articleBrand: number | null;
	setArticleBrand: (val: number) => void;
	brands: Brand[];
	images: { id: string; previewUrl: string }[];
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleDeleteImage: (id: string) => void;
	articlePriceTTC: number | string;
	setArticlePriceTTC: (val: string) => void;
	articleQty: number | string;
	setArticleQty: (val: string) => void;
	articleShippingCost: number | string;
	setArticleShippingCost: (val: string) => void;
	articleStatus: string;
	setArticleStatus: (val: string) => void;
	noImage: boolean;
	mode: "create" | "edit";
}

export default function ArticleForm({
	articleType,
	setArticleType,
	articleName,
	setArticleName,
	articleDescription,
	setArticleDescription,
	articleReference,
	setArticleReference,
	articleBrand,
	setArticleBrand,
	brands,
	images,
	handleImageChange,
	handleDeleteImage,
	articlePriceTTC,
	setArticlePriceTTC,
	articleQty,
	setArticleQty,
	articleStatus,
	setArticleStatus,
	noImage,
	mode,
}: ArticleFormProps) {
	// Quand le stock change
	const handleQtyChange = (val: string | number) => {
		const qty = Number(val);

		setArticleQty(qty.toString());

		if (qty === 0 && articleStatus === "available") {
			setArticleStatus("out_of_stock");
		}

		if (qty > 0) {
			setArticleStatus("available");
		}
	};

	// Quand le statut change
	const handleStatusChange = (val: string) => {
		setArticleStatus(val);

		if (val === "preorder" || val === "out_of_stock") {
			setArticleQty("0");
		}

		if (val === "available" && Number(articleQty) === 0) {
			setArticleQty("1");
		}
	};

	return (
		<>
			<div>
				{/* Type de l'article */}
				<div className="flex gap-4">
					{/* select du type */}
					<div className="w-full ">
						<Select
							label="Choisir un type d'article"
							value={articleType}
							onChange={(val) => setArticleType(val as string)}
							options={[
								"racket",
								"bag",
								"ball",
								"clothing",
								"shoes",
								"accessory",
							]}
							labels={[
								"Raquette",
								"Sac",
								"Balle",
								"Vêtement",
								"Chaussure",
								"Accessoire",
							]}
							disabled={mode === "edit"}
						/>
					</div>

					{/* image du statut */}
					<div className="w-2/10 mt-4 flex justify-center">
						<img
							src={
								articleType
									? `/categories/${articleType}.avif`
									: `/brands/no-image.svg`
							}
							alt={articleBrand ? `logo ${articleType}` : "logo par défaut"}
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
				{mode === "edit" && (
					<div className="-mt-1.5">
						<Input
							htmlFor={"reference"}
							label={"Reférence de l'article"}
							type={"text"}
							value={articleReference}
							onChange={setArticleReference}
							width="w-full"
							readOnly
							disabled={mode === "edit"}
						/>
					</div>
				)}
				<div className="flex gap-4">
					{/* Marque de l'article */}
					<div className="w-full ">
						<Select
							label="Choisir une marque"
							value={articleBrand ?? ""}
							onChange={(val) => setArticleBrand(Number(val))}
							options={brands
								.map((b) => b.brand_id)
								.filter((id): id is number => id !== undefined)}
							labels={brands.map((b) => b.name)}
						/>
					</div>

					{/* image de la marque */}
					<div className="w-2/10 mt-4">
						<img
							src={
								articleBrand
									? (() => {
											const brand = brands.find(
												(b) => b.brand_id === articleBrand,
											);
											if (!brand) return "/brands/no-image.svg";

											// Si c'est déjà une URL complète
											if (
												brand.logo.startsWith("http") ||
												brand.logo.startsWith("https")
											) {
												return brand.logo;
											}

											// Si c'est un fichier uploadé côté backend
											if (brand.logo.startsWith("/uploads/")) {
												return `${import.meta.env.VITE_API_URL}${brand.logo}`;
											}

											// Sinon, c'est une image frontale classique
											return brand.logo;
										})()
									: "/brands/no-image.svg"
							}
							alt={
								articleBrand
									? `logo ${brands.find((b) => b.brand_id === articleBrand)?.name}`
									: "logo par défaut"
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
							className={`border mt-4 h-10 flex max-w-full pt-3 pl-3 z-200 w-full cursor-pointer bg-white ${
								noImage ? "border-red-500" : "border-gray-300"
							}`}
						>
							<p className="absolute text-gray-500 text-xs top-0 left-1">
								Sélectionnez des images
							</p>
						</label>

						<button
							type="button"
							onClick={() => document.getElementById("file-upload")?.click()}
							className="absolute right-1 top-1"
						>
							<img
								src="/icons/add-item.svg"
								alt="Ajouter des images"
								className="w-8"
							/>
						</button>

						{noImage && (
							<p className="text-red-500 mt-0">
								Veuillez ajouter au moins 1 image.
							</p>
						)}
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
				<div className="flex justify-between gap-4 xl:mr-1">
					{/* Prix de l'article */}
					<div className="-mt-2 relative w-1/4">
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
					{articleType !== "clothing" && articleType !== "shoes" && (
						<div className="-mt-2 w-1/5">
							<Input
								htmlFor={"quantity"}
								label={"Quantité"}
								type={"number"}
								value={articleQty}
								onChange={handleQtyChange}
								width="w-full"
							/>
						</div>
					)}

					<div className="-mt-2 relative">
						<div className="flex gap-4">
							<Select
								label="Choisir un statut"
								value={articleStatus}
								onChange={handleStatusChange}
								options={["available", "preorder", "out_of_stock"]}
								labels={["Disponible", "En commande", "Rupture de stock"]}
							/>
							{/* image du statut */}
							<div className="w-3/7 mt-4">
								<img
									src={
										articleStatus
											? `/icons/${articleStatus}.svg`
											: `/brands/no-image.svg`
									}
									alt={
										articleBrand ? `logo ${articleStatus}` : "logo par défaut"
									}
									className="w-full h-9.5"
								/>
							</div>
						</div>
					</div>
					{/* Statut de l'article */}
				</div>
			</div>
			<div className="border-b border-gray-400 xl:border-none mt-4 "></div>
		</>
	);
}
