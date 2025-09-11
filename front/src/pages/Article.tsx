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
	const [isCaracteristiquesOn, setIsCaracteristiquesOn] = useState(true);

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
			<Breadcrumb items={breadcrumbItems} />
			<div>
				{/* Partie grande image */}
				<img
					src={selectedImage}
					alt={article.nom}
					className="border border-gray-300 rounded-sm"
				/>

				{/* Partie petites images */}
				<div className="flex gap-2 mt-2">
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
								className="w-20 h-20 object-cover"
							/>
						</button>
					))}
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
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none"
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
								className="px-3 py-1 text-md font-bold hover:bg-gray-200 focus:outline-none"
								aria-label="Augmenter la quantité"
							>
								+
							</button>
						</div>
					</div>
				</div>

				{/* Partie boutton */}
				<button
					type="button"
					className="bg-amber-300 rounded-lg mt-3 py-2 w-full font-semibold"
					onClick={addOnCart}
				>
					Ajouter au panier
				</button>
				<p className="font-semibold text-lg mt-6">{article.nom}</p>
				<p className="text-sm">{article.reference}</p>

				{/* Partie notes technique */}
				<div className="grid grid-cols-2 gap-4 mt-6 ">
					<div>
						<div>
							<p className="text-center font-semibold">Maniabilité</p>
							<RatingBar value={article.note_tech.maniabilite} />
						</div>
						<div className="mt-3">
							<p className="text-center font-semibold">Confort</p>
							<RatingBar value={article.note_tech.confort} />
						</div>
						<div className="mt-3">
							<p className="text-center font-semibold">Tolérance</p>
							<RatingBar value={article.note_tech.tolerance} />
						</div>
					</div>
					<div>
						<div>
							<p className="text-center font-semibold">Puissance</p>
							<RatingBar value={article.note_tech.puissance} />
						</div>
						<div className="mt-3">
							<p className="text-center font-semibold">Effet</p>
							<RatingBar value={article.note_tech.effet} />
						</div>
						<div className="mt-3">
							<p className="text-center font-semibold">Controle</p>
							<RatingBar value={article.note_tech.controle} />
						</div>
					</div>
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
							className={isDescriptionOn ? "text-black" : "text-gray-400"}
						>
							Description
						</button>
						<button
							type="button"
							onClick={() => {
								setIsDescriptionOn(false);
								setIsCaracteristiquesOn(true);
							}}
							className={isCaracteristiquesOn ? "text-black" : "text-gray-400"}
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
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Poids
								</p>
								<p className="pl-2">{article.carac_tech.poids}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Type
								</p>
								<p className="pl-2">{article.carac_tech.type}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Couleur
								</p>
								<p className="pl-2">{article.carac_tech.couleur}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Forme
								</p>
								<p className="pl-2">{article.carac_tech.forme}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Mousse
								</p>
								<p className="pl-2">{article.carac_tech.mousse}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Surface
								</p>
								<p className="pl-2">{article.carac_tech.surface}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Niveau de jeu
								</p>
								<p className="pl-2">{article.carac_tech.niveau_de_jeu}</p>
							</div>
							<div className="flex border border-gray-300 rounded-lg mt-3">
								<p className="pl-2 bg-gray-300 rounded-l-lg w-1/3 font-semibold">
									Genre
								</p>
								<p className="pl-2">{article.carac_tech.genre}</p>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}
