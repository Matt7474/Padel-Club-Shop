import { Link, useNavigate } from "react-router-dom";
import data from "../../data/dataTest.json";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

interface ArticlesProps {
	type: string;
}

export default function Articles({ type }: ArticlesProps) {
	const navigate = useNavigate();

	const breadcrumbItems = [
		{ label: "Accueil", href: "/homepage" },
		{
			label: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
			href: `/articles/${type}`,
		},
	];

	const articles = data.articles.filter(
		(article) => article.carac_tech.type === type,
	);

	const handleBrandClick = (e: React.MouseEvent, brand: string) => {
		e.stopPropagation();
		navigate(`/marque/${brand}`);
	};

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="mt-4">
				<h1 className="text-xl font-bold mb-4">
					{articles.length} {type.charAt(0).toUpperCase() + type.slice(1)}s
					disponibles
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-1">
					{articles.map((article) => {
						const shortDesc = article.description
							? `${article.description.split(" ").slice(0, 8).join(" ")} ... voir plus`
							: "";

						// Calcul prix avec promo si elle existe
						let displayPrice: number = article.prix_ttc;
						if (article.promos && article.promos.length > 0) {
							const promo = article.promos[0];
							if (promo.type_remise === "pourcentage") {
								displayPrice =
									(article.prix_ttc * (100 - promo.valeur_remise)) / 100;
							} else if (promo.type_remise === "montant") {
								displayPrice = article.prix_ttc - promo.valeur_remise;
							}
						}
						displayPrice = Math.max(displayPrice, 0);

						return (
							<Link
								to={`/articles/${type}/${article.nom}`}
								key={article.code_article}
								className="border rounded-lg shadow-lg bg-white cursor-pointer flex flex-col h-40 hover:-translate-y-2"
							>
								<div className="flex h-full">
									{/* Colonne image */}
									<div className="w-1/3 border-r flex items-center justify-center p-2">
										<img
											src={`/images/${article.image}`}
											alt={article.nom}
											className="max-h-32 object-contain"
											onError={(e) => {
												e.currentTarget.src = "/icons/default.svg";
											}}
										/>
									</div>

									{/* Colonne texte */}
									<div className="w-2/3 pl-2 flex flex-col justify-between bg-gray-50 rounded-lg">
										<div>
											<div className="bg-gray-300 inline-block mt-1 -ml-1 rounded-lg">
												<button
													type="button"
													onClick={(e) => handleBrandClick(e, article.marque)}
													className="px-2 hover:underline"
												>
													{article.marque}
												</button>
											</div>
											<h2 className="font-semibold">{article.nom}</h2>
											<p className="text-sm text-gray-600">{shortDesc}</p>
										</div>

										<div>
											{article.promos && article.promos.length > 0 && (
												<div className="bg-gray-300 inline-block rounded-sm px-1 mt-2 text-sm">
													- {article.promos[0].valeur_remise}{" "}
													{article.promos[0].type_remise === "pourcentage"
														? "%"
														: "€"}
												</div>
											)}

											{/* Prix */}
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
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</>
	);
}
