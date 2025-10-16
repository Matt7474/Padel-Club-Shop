import { useState } from "react";
import ArticlesList from "../components/Form/Admin/ArticlesList";
import BrandList from "../components/Form/Admin/BrandList";
import CreateArticle from "../components/Form/Admin/CreateArticle";
import CreateBrand from "../components/Form/Admin/CreateBrand";
import CreatePromo from "../components/Form/Admin/CreatePromo";
import OrderList from "../components/Form/Admin/OrderList";
import PromoList from "../components/Form/Admin/PromoList";
import UserList from "../components/Form/Admin/UsersList";
import Select from "../components/Form/Tools/Select";
import Profile from "./Profile";

export default function AdminMenu() {
	const [menuSelected, setMenuSelected] = useState("");

	const menuOptions = [
		"Ajouter un article",
		"Liste des articles",
		"Ajouter une marque",
		"Liste des marques",
		"Ajouter une promotion",
		"Liste des promotions",
		"Liste des utilisateurs",
		"Voir les commandes",
		"Voir mon profil",
	];

	return (
		<>
			<div className="relative">
				<h2 className="p-3 bg-orange-500/80 font-semibold text-lg mt-7 xl:mt-0 xl:mb-4 flex justify-between">
					MENU ADMINISTRATEUR
				</h2>
				{/* menu déroulant en version mobile */}
				<div className="xl:hidden cursor-pointer">
					<Select
						label="Choisissez un menu"
						value={menuSelected}
						// onChange={setMenuSelected}
						onChange={(val) => setMenuSelected(val as string)}
						options={menuOptions}
						labels={menuOptions}
					/>
				</div>
				{/* menu latéral en version desktop */}
				<div className="hidden xl:flex flex-col w-70 absolute -left-74 top-17 cursor-pointer">
					{menuOptions.map((option) => (
						<button
							type="button"
							key={option}
							onClick={() => setMenuSelected(option)}
							className={`px-4 py-2 border ${
								menuSelected === option
									? "bg-orange-500 text-white cursor-pointer"
									: "bg-gray-100 hover:bg-gray-200 cursor-pointer"
							}`}
						>
							{option}
						</button>
					))}
				</div>

				{/* Articles */}
				{/* Ajouter un article */}
				{menuSelected === "Ajouter un article" && (
					<div>
						<CreateArticle
							title="Création d'un article"
							buttonText="AJOUTER L'ARTICLE"
							mode="create"
							onReturn={() => setMenuSelected("Liste des articles")}
						/>
					</div>
				)}
				{/* Liste des articles */}
				{menuSelected === "Liste des articles" && (
					<div>
						<ArticlesList />
					</div>
				)}

				{/* Marques */}
				{/* Ajouter une marque */}
				{menuSelected === "Ajouter une marque" && (
					<div>
						<CreateBrand />
					</div>
				)}
				{/* Liste des marques */}
				{menuSelected === "Liste des marques" && (
					<div>
						<BrandList />
					</div>
				)}

				{/* Promotions */}
				{/* Ajouter une promotion */}
				{menuSelected === "Ajouter une promotion" && (
					<div>
						<CreatePromo setMenuSelected={setMenuSelected} />
					</div>
				)}
				{/* Liste des promotions */}
				{menuSelected === "Liste des promotions" && (
					<div>
						<div>
							<PromoList setMenuSelected={setMenuSelected} />
						</div>
					</div>
				)}

				{/* Utlisateurs */}
				{/* Liste des utilisateurs */}
				{menuSelected === "Liste des utilisateurs" && (
					<div>
						<UserList />
					</div>
				)}

				{/* Commandes */}
				{/*	Voir les commandes */}
				{menuSelected === "Voir les commandes" && (
					<div>
						<OrderList />
					</div>
				)}

				{/* Profil */}
				{/*	Voir mon profil */}
				{menuSelected === "Voir mon profil" && (
					<div>
						<Profile />
					</div>
				)}
			</div>
		</>
	);
}
