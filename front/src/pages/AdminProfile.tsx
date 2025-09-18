import { useState } from "react";
import ArticlesList from "../components/Form/Admin/ArticlesList";
import CreateArticle from "../components/Form/Admin/CreateArticle";
import CreateBrand from "../components/Form/Admin/CreateBrand";
import UserList from "../components/Form/Admin/UsersList";
import Select from "../components/Form/Tools/Select";

export default function AdminProfile() {
	const [menuSelected, setMenuSelected] = useState("");

	const menuOptions = [
		"Ajouter une marque",
		"Ajouter un article",
		"Liste des articles",
		"Liste des utilisateurs",
	];

	return (
		<>
			<div className="relative">
				<h2 className="p-3 bg-orange-500/80 font-semibold text-lg mt-7 xl:mt-0 xl:mb-4 flex justify-between">
					Gestion d'administration
				</h2>

				{/* menu déroulant en version mobile */}
				<div className="xl:hidden cursor-pointer">
					<Select
						label="Choisissez un menu"
						value={menuSelected}
						onChange={setMenuSelected}
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

				{/* Ajouter un article */}
				{menuSelected === "Ajouter un article" && (
					<div>
						<CreateArticle
							title={"Création d'un article"}
							buttonText="AJOUTER L'ARTICLE"
						/>
					</div>
				)}

				{/* Ajouter un article */}
				{menuSelected === "Ajouter une marque" && (
					<div>
						<CreateBrand />
					</div>
				)}

				{/* Liste des utilisateurs */}
				{menuSelected === "Liste des utilisateurs" && (
					<div>
						<UserList />
					</div>
				)}

				{/* Liste des articles */}
				{menuSelected === "Liste des articles" && (
					<div>
						<ArticlesList />
					</div>
				)}
			</div>
		</>
	);
}
