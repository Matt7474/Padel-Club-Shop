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
	articleBrand: string;
	setArticleBrand: (val: string) => void;
	brands: string[];
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
	articleShippingCost,
	setArticleShippingCost,
	articleStatus,
	setArticleStatus,
}: ArticleFormProps) {
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
							onChange={setArticleType}
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
							labels={brands.map((b) => b.charAt(0).toUpperCase() + b.slice(1))}
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
							alt={articleBrand ? `logo ${articleBrand}` : "logo par défaut"}
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
							className="border mt-4 h-10 flex max-w-[100%] pt-3 pl-3 z-200 w-full cursor-pointer bg-white"
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
							alt={articleBrand ? `logo ${articleStatus}` : "logo par défaut"}
							className="w-25 h-9.5"
						/>
					</div>
				</div>
			</div>
			<div className="border-b border-gray-400 xl:border-none mt-4 "></div>
		</>
	);
}
