import { useState } from "react";
import { useParams } from "react-router-dom";
import articlesData from "../../data/dataTest.json";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import RatingBar from "../components/RatingBar/RatingBar";

export default function Article() {
	const { type, nom } = useParams();

	const article = articlesData.articles.find(
		(art) => art.carac_tech.type === type && art.nom === nom,
	);

	if (!type || !nom) {
		return <div>Chargement...</div>;
	}

	if (!article) {
		return <div>Cet article n'à pas été trouvé</div>;
	}

	const [selectedImage, setSelectedImage] = useState(article?.image[0] || "");
	const [quantity, setQuantity] = useState(1);
	const [isDescriptionOn, setIsDescriptionOn] = useState(true);
	const [isCaracteristiquesOn, setIsCaracteristiquesOn] = useState(false);

	const increment = () => setQuantity((prev) => prev + 1);
	const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	const breadcrumbItems = [
		{ label: "Accueil", href: "/homepage" },
		{
			label: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
			href: `/articles/${type}`,
		},
		{
			label: nom,
			href: `/articles/${type}/${nom}`,
		},
	];

	let displayPrice: number = article.prix_ttc;
	if (article.promos && article.promos.length > 0) {
		const promo = article.promos[0];
		if (promo.type_remise === "pourcentage") {
			displayPrice = (article.prix_ttc * (100 - promo.valeur_remise)) / 100;
		} else if (promo.type_remise === "montant") {
			displayPrice = article.prix_ttc - promo.valeur_remise;
		}
	}
	displayPrice = Math.max(displayPrice, 0);

	const addOnCart = () => {
		console.log("ajouter au panier");
	};

	return (
		<>
			<div className="xl:mb-6">
				<Breadcrumb items={breadcrumbItems} />
			</div>

			{/* LAYOUT MOBILE (conservé tel quel) */}
			<div className="xl:hidden">
				<div className="xl:flex-row-reverse xl:flex xl:flex-col-2 ">
					{/* Partie grande image */}
					<img
						src={selectedImage}
						alt={article.nom}
						className="border border-gray-300 rounded-sm xl:w-4/10"
					/>

					{/* Partie petites images */}
					<div className="flex gap-2 mt-2 xl:flex-col xl:mt-0 xl:mr-2">
						{article.image.map((imgPath) => (
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
									alt={`${article.nom}`}
									className="w-20 h-20 object-cover "
								/>
							</button>
						))}
					</div>
				</div>

				<div className="flex mt-3">
					{/* Colonne gauche */}
					<div className="flex flex-col w-1/2 justify-between">
						{/* Partie promo */}
						<div>
							{article.promos.length > 0 && (
								<div className="flex">
									<p className="text-xs bg-gray-300 rounded-md font-semibold px-1 max-h-4 mt-0.5 ml-1">
										{article.promos[0].type_remise === "pourcentage"
											? `-${article.promos[0].valeur_remise}%`
											: `-${article.promos[0].valeur_remise}€`}
									</p>
									<p className="text-xs bg-red-300 rounded-md text-white font-semibold px-1 max-h-4 mt-0.5 ml-3">
										PROMO
									</p>
								</div>
							)}
						</div>

						{/* Partie prix */}
						<div>
							{article.promos && article.promos.length > 0 ? (
								<p className="font-bold text-red-600 text-sm">
									{displayPrice.toFixed(2)} €{" "}
									<span className="line-through text-black text-sm">
										{article.prix_ttc.toFixed(2)} €
									</span>
								</p>
							) : (
								<p className="font-bold text-sm">
									{article.prix_ttc.toFixed(2)} €
								</p>
							)}
						</div>
					</div>

					{/* Colonne droite */}
					<div className="w-1/2 flex flex-col items-end -mt-1">
						<p className="font-semibold">Quantité</p>
						<div className="inline-flex items-center border rounded-lg overflow-hidden">
							<button
								type="button"
								onClick={decrement}
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
								aria-label="Diminuer la quantité"
							>
								-
							</button>
							<span className="w-10 text-center py-1 text-md font-semibold select-none">
								{quantity}
							</span>
							<button
								type="button"
								onClick={increment}
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
								aria-label="Augmenter la quantité"
							>
								+
							</button>
						</div>
					</div>
				</div>

				{/* Partie bouton */}
				<button
					type="button"
					className="bg-amber-300 rounded-lg mt-3 py-2 w-full font-semibold cursor-pointer hover:brightness-80"
					onClick={addOnCart}
				>
					Ajouter au panier
				</button>
				<p className="font-semibold text-lg mt-6">{article.nom}</p>
				<p className="text-sm">{article.reference}</p>

				{/* Partie notes technique */}
				<div className="grid grid-cols-2 gap-4 mt-6">
					{[
						[
							{ label: "Maniabilité", value: article.note_tech.maniabilite },
							{ label: "Confort", value: article.note_tech.confort },
							{ label: "Tolérance", value: article.note_tech.tolerance },
						],
						[
							{ label: "Puissance", value: article.note_tech.puissance },
							{ label: "Effet", value: article.note_tech.effet },
							{ label: "Contrôle", value: article.note_tech.controle },
						],
					].map((col) => (
						<div key={col.map((note) => note.label).join("-")}>
							{col.map((note) => (
								<div key={note.label} className="mt-3 first:mt-0">
									<p className="text-center font-semibold">{note.label}</p>
									<RatingBar value={note.value} />
								</div>
							))}
						</div>
					))}
				</div>

				{/* Partie description & caracteristiques */}
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
							}
								`}
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
						<div>
							<p className="mt-3">{article.description}</p>
						</div>
					) : isCaracteristiquesOn ? (
						<div>
							{[
								{ label: "Poids", value: article.carac_tech.poids },
								{ label: "Type", value: article.carac_tech.type },
								{ label: "Couleur", value: article.carac_tech.couleur },
								{ label: "Forme", value: article.carac_tech.forme },
								{ label: "Mousse", value: article.carac_tech.mousse },
								{ label: "Surface", value: article.carac_tech.surface },
								{
									label: "Niveau de jeu",
									value: article.carac_tech.niveau_de_jeu,
								},
								{ label: "Genre", value: article.carac_tech.genre },
							].map((carac) => (
								<div
									key={carac.label}
									className="flex border border-gray-300 rounded-lg mt-3"
								>
									<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
										{carac.label}
									</p>
									<p className="pl-2">{carac.value}</p>
								</div>
							))}
						</div>
					) : null}
				</div>
			</div>

			{/* LAYOUT DESKTOP */}
			<div className="hidden xl:flex xl:gap-8 xl:justify-between">
				{/* Images */}
				<div className="xl:flex xl:gap-4 xl:w-1/2 ">
					{/* Petites images à gauche */}
					<div className="xl:flex xl:flex-col xl:gap-2 xl:w-24">
						{article.image.map((imgPath) => (
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
									alt={`${article.nom}`}
									className="w-20 h-20 object-cover"
								/>
							</button>
						))}
					</div>

					{/* Grande image à droite */}
					<div className="xl:w-full">
						<img
							src={selectedImage}
							alt={article.nom}
							className="border border-gray-300 rounded-sm w-full"
						/>
					</div>
				</div>

				<div className="xl:w-1/2 xl:flex xl:flex-col">
					{/* Infos produit dans un conteneur qui peut grandir */}
					{/* <div className="xl:flex-grow xl:">*/}
					<div className="xl:flex xl:flex-col xl:h-full xl:justify-between">
						<div>
							{/* Marque (si disponible) */}
							{/* <p className="text-gray-600 mb-2">{article.marque}</p> */}

							{/* Nom de l'article */}
							<h1 className="font-bold text-2xl mb-2">{article.nom}</h1>

							{/* Référence */}
							<p className="text-gray-600 text-sm mb-4">{article.reference}</p>

							{/* Description */}
							<p className="text-base leading-relaxed mb-6">
								{article.description}
							</p>
						</div>
						<div>
							{/* Prix et promo */}
							<div className="mb-6">
								{article.promos.length > 0 && (
									<div className="flex mb-2">
										<p className="text-xs bg-gray-300 rounded-md font-semibold px-2 py-1">
											{article.promos[0].type_remise === "pourcentage"
												? `-${article.promos[0].valeur_remise}%`
												: `-${article.promos[0].valeur_remise}€`}
										</p>
										<p className="text-xs bg-red-500 rounded-md text-white font-semibold px-2 py-1 ml-2">
											PROMO
										</p>
									</div>
								)}

								{article.promos && article.promos.length > 0 ? (
									<p className="font-bold text-red-600 text-xl">
										{displayPrice.toFixed(2)} €{" "}
										<span className="line-through text-black text-base ml-2">
											{article.prix_ttc.toFixed(2)} €
										</span>
									</p>
								) : (
									<p className="font-bold text-xl">
										{article.prix_ttc.toFixed(2)} €
									</p>
								)}
							</div>

							{/* Quantité */}
							<div className="mb-6">
								<p className="font-semibold mb-2">Quantité</p>
								<div className="inline-flex items-center border rounded-lg overflow-hidden">
									<button
										type="button"
										onClick={decrement}
										className="px-4 py-2 text-lg font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
										aria-label="Diminuer la quantité"
									>
										-
									</button>
									<span className="w-12 text-center py-2 text-lg font-semibold select-none">
										{quantity}
									</span>
									<button
										type="button"
										onClick={increment}
										className="px-4 py-2 text-lg font-bold hover:bg-gray-200 focus:outline-none cursor-pointer"
										aria-label="Augmenter la quantité"
									>
										+
									</button>
								</div>
							</div>

							{/* Bouton ajouter au panier */}
							<button
								type="button"
								className="bg-amber-300 rounded-lg py-3 w-full font-semibold cursor-pointer hover:brightness-80 text-lg mb-8 xl:mb-0"
								onClick={addOnCart}
							>
								Ajouter au panier
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="hidden xl:flex justify-center gap-6">
				{/* Notes techniques en dessous des images */}
				<div className="w-1/2">
					<h3 className="font-semibold text-lg mb-4 xl:text-center xl:mt-10">
						Notes
					</h3>
					<div className="hidden xl:grid xl:grid-cols-2 xl:gap-4 xl:mt-8">
						{[
							[
								{
									label: "Maniabilité",
									value: article.note_tech.maniabilite,
								},
								{ label: "Confort", value: article.note_tech.confort },
								{ label: "Tolérance", value: article.note_tech.tolerance },
							],
							[
								{ label: "Puissance", value: article.note_tech.puissance },
								{ label: "Effet", value: article.note_tech.effet },
								{ label: "Contrôle", value: article.note_tech.controle },
							],
						].map((col) => (
							<div key={col.map((note) => note.label).join("-")}>
								{col.map((note) => (
									<div key={note.label} className="mt-4 first:mt-0">
										<p className="text-center font-semibold">{note.label}</p>
										<RatingBar value={note.value} />
									</div>
								))}
							</div>
						))}
					</div>
				</div>
				{/* Caractéristiques en bas à droite */}
				<div className="w-1/2">
					<h3 className="font-semibold text-lg mb-4 xl:text-center xl:mt-10">
						Caractéristiques
					</h3>
					<div className="hidden xl:grid xl:grid-cols-2 xl:gap-4 xl:mt-8">
						<div className="space-y-2 ">
							{[
								{ label: "Poids", value: article.carac_tech.poids },
								{ label: "Type", value: article.carac_tech.type },
								{ label: "Couleur", value: article.carac_tech.couleur },
								{ label: "Forme", value: article.carac_tech.forme },
							].map((carac) => (
								<div
									key={carac.label}
									className="flex border border-gray-300 rounded-lg overflow-hidden"
								>
									<p className="bg-gray-300 px-3 py-2 w-1/3 font-semibold xl:w-1/2">
										{carac.label}
									</p>
									<p className="px-3 py-2 flex-1">{carac.value}</p>
								</div>
							))}
						</div>
						<div className="space-y-2 mt-2 xl:mt-0">
							{[
								{ label: "Mousse", value: article.carac_tech.mousse },
								{ label: "Surface", value: article.carac_tech.surface },
								{
									label: "Niveau de jeu",
									value: article.carac_tech.niveau_de_jeu,
								},
								{ label: "Genre", value: article.carac_tech.genre },
							].map((carac) => (
								<div
									key={carac.label}
									className="flex border border-gray-300 rounded-lg overflow-hidden"
								>
									<p className="bg-gray-300 px-3 py-2 w-1/3 font-semibold xl:w-1/2">
										{carac.label}
									</p>
									<p className="px-3 py-2 flex-1">{carac.value}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
