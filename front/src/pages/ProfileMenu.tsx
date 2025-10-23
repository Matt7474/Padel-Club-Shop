import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticlesList from "../components/Form/Admin/ArticlesList";
import BrandList from "../components/Form/Admin/BrandList";
import ClientsMessages from "../components/Form/Admin/ClientsMessages";
import CreateArticle from "../components/Form/Admin/CreateArticle";
import CreateBrand from "../components/Form/Admin/CreateBrand";
import CreatePromo from "../components/Form/Admin/CreatePromo";
import MyMessages from "../components/Form/Admin/MyMessages";
import MyOrders from "../components/Form/Admin/MyOrders";
import OrderList from "../components/Form/Admin/OrderList";
import PromoList from "../components/Form/Admin/PromoList";
import UserList from "../components/Form/Admin/UsersList";
import Select from "../components/Form/Tools/Select";
import { useAuthStore } from "../store/useAuthStore";
import Profile from "./Profile";

export default function ProfileMenu() {
	const [menuSelected, setMenuSelected] = useState("");
	const { user, isAuthenticated } = useAuthStore();
	const navigate = useNavigate();

	// 🔒 Redirection si non connecté
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	// 🧭 Définition des options disponibles selon le rôle
	const adminMenus = [
		"Ajouter un article",
		"Liste des articles",
		"Ajouter une marque",
		"Liste des marques",
		"Ajouter une promotion",
		"Liste des promotions",
		"Liste des utilisateurs",
		"Voir les commandes",
		"Voir mon profil",
		"Mes commandes",
		"Voir les messages client",
		"Mes messages",
	];

	const clientMenus = ["Voir mon profil", "Mes commandes", "Mes messages"];

	const menuOptions =
		user?.role === "admin" || user?.role === "super admin"
			? adminMenus
			: clientMenus;

	return (
		<div className="relative">
			{/* Titre du menu */}
			<h2 className="p-3 bg-orange-500/80 font-semibold text-lg mt-7 xl:mt-0 xl:mb-4 flex justify-between">
				{user?.role === "admin" || user?.role === "super admin"
					? "MENU ADMINISTRATEUR"
					: "MENU CLIENT"}
			</h2>
			{/* Menu déroulant mobile */}
			<div className="xl:hidden cursor-pointer">
				<Select
					label="Choisissez un menu"
					value={menuSelected}
					onChange={(val) => setMenuSelected(val as string)}
					options={menuOptions}
					labels={menuOptions}
				/>
			</div>
			{/* Menu latéral desktop */}
			<div className="hidden xl:flex flex-col w-70 absolute -left-74 top-17 cursor-pointer">
				{menuOptions.map((option) => (
					<button
						type="button"
						key={option}
						onClick={() => setMenuSelected(option)}
						className={`px-4 py-2 border cursor-pointer ${
							menuSelected === option
								? "bg-orange-500 text-white"
								: "bg-gray-100 hover:bg-gray-200"
						}`}
					>
						{option}
					</button>
				))}
			</div>
			{/* Contenu selon le menu sélectionné */}
			{menuSelected === "Ajouter un article" && (
				<CreateArticle
					title="Création d'un article"
					buttonText="AJOUTER L'ARTICLE"
					mode="create"
					onReturn={() => setMenuSelected("Liste des articles")}
				/>
			)}
			{menuSelected === "Liste des articles" && <ArticlesList />}
			{menuSelected === "Ajouter une marque" && <CreateBrand />}
			{menuSelected === "Liste des marques" && <BrandList />}
			{menuSelected === "Ajouter une promotion" && (
				<CreatePromo setMenuSelected={setMenuSelected} />
			)}
			{menuSelected === "Liste des promotions" && (
				<PromoList setMenuSelected={setMenuSelected} />
			)}
			{menuSelected === "Liste des utilisateurs" && <UserList />}
			{menuSelected === "Voir les commandes" && <OrderList />}
			{menuSelected === "Voir mon profil" && <Profile />}
			{menuSelected === "Mes commandes" && <MyOrders />}
			{menuSelected === "Voir les messages client" && <ClientsMessages />}
			{menuSelected === "Mes messages" && <MyMessages />}
		</div>
	);
}
