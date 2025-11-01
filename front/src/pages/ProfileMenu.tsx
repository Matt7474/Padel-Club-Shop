import { useState } from "react";
import ArticlesList from "../components/Form/Admin/ArticlesList";
import BrandList from "../components/Form/Admin/BrandList";
import ClientsMessages from "../components/Form/Admin/ClientsMessages";
import MessagesForm from "../components/Form/Admin/ClientsMessagesForm";
import CreateArticle from "../components/Form/Admin/CreateArticle";
import CreateBrand from "../components/Form/Admin/CreateBrand";
import CreatePromo from "../components/Form/Admin/CreatePromo";
import Dashboard from "../components/Form/Admin/Dashboard/Dashbord";
import MyMessages from "../components/Form/Admin/MyMessages";
import MyOrders from "../components/Form/Admin/MyOrders";
import OrderList from "../components/Form/Admin/OrderList";
import PromoList from "../components/Form/Admin/PromoList";
import UserList from "../components/Form/Admin/UsersList";
import Select from "../components/Form/Tools/Select";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import Profile from "./Profile";

export default function ProfileMenu() {
	const {
		lowStockCount,
		orderPaid,
		unreadMessageCount,
		unreadFormCount,
		messages,
	} = useNotificationStore();
	const [menuSelected, setMenuSelected] = useState("");
	const { user } = useAuthStore();
	const [unreadMessage] = useState(0);

	// Définition des options disponibles selon le rôle
	const adminMenus = [
		"Dashboard",
		"Ajouter une marque",
		"Ajouter une promotion",
		"Ajouter un article",
		"Liste des marques",
		"Liste des promotions",
		"Liste des articles",
		"Liste des utilisateurs",
		"Liste des commandes client",
		"Liste des messages client",
		"Liste des messages formulaire",
		"Mon profil",
		"Mes commandes",
	];

	const clientMenus = ["Mon profil", "Mes commandes", "Mes messages"];

	const menuOptions =
		user?.role === "admin" || user?.role === "super admin"
			? adminMenus
			: clientMenus;

	const personalMessages = messages.filter((m) => m.receiver_id === user?.id);
	const unreadPersonalCount = personalMessages.filter((m) => !m.is_read).length;

	return (
		<div className="relative min-h-220 max-h-350">
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
			<div className="hidden xl:flex flex-col w-77 absolute -left-81 top-17 cursor-pointer ">
				{menuOptions.map((option) => (
					<button
						type="button"
						key={option}
						onClick={() => setMenuSelected(option)}
						className={`px-4 py-2 border cursor-pointer relative ${
							menuSelected === option
								? "bg-linear-to-r from-orange-500/80 to-orange-300/80 text-white"
								: "bg-gray-100 hover:bg-gray-200"
						}`}
					>
						{option}

						{/* Pastille de notification */}
						{option === "Liste des articles" && lowStockCount > 0 && (
							<span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
								!
							</span>
						)}
						{option === "Liste des commandes client" && orderPaid > 0 && (
							<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
								{orderPaid > 99 ? "99+" : orderPaid}
							</span>
						)}
						{option === "Liste des messages client" && unreadMessage > 0 && (
							<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
								{unreadMessage > 99 ? "99+" : unreadMessage}
							</span>
						)}
						{option === "Liste des messages formulaire" &&
							unreadFormCount > 0 && (
								<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
									{unreadFormCount > 99 ? "99+" : unreadFormCount}
								</span>
							)}
						{option === "Liste des messages client" &&
							unreadMessageCount > 0 && (
								<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
									{unreadMessageCount > 99 ? "99+" : unreadMessageCount}
								</span>
							)}

						{option === "Mes messages" && unreadPersonalCount > 0 && (
							<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
								{unreadPersonalCount > 99 ? "99+" : unreadPersonalCount}
							</span>
						)}
					</button>
				))}
			</div>
			{/* Contenu selon le menu sélectionné */}
			{menuSelected === "Dashboard" && <Dashboard />}{" "}
			{menuSelected === "Ajouter une marque" && <CreateBrand />}
			{menuSelected === "Ajouter une promotion" && (
				<CreatePromo setMenuSelected={setMenuSelected} />
			)}
			{menuSelected === "Ajouter un article" && (
				<CreateArticle
					title="Création d'un article"
					buttonText="AJOUTER L'ARTICLE"
					mode="create"
					onReturn={() => setMenuSelected("Liste des articles")}
				/>
			)}
			{menuSelected === "Liste des marques" && <BrandList />}
			{menuSelected === "Liste des promotions" && (
				<PromoList setMenuSelected={setMenuSelected} />
			)}
			{menuSelected === "Liste des articles" && <ArticlesList />}
			{menuSelected === "Liste des utilisateurs" && <UserList />}
			{menuSelected === "Liste des commandes client" && <OrderList />}
			{menuSelected === "Liste des messages client" && (
				<ClientsMessages messagesP={messages} />
			)}
			{menuSelected === "Liste des messages formulaire" && <MessagesForm />}
			{menuSelected === "Mon profil" && <Profile />}
			{menuSelected === "Mes commandes" && <MyOrders />}
			{menuSelected === "Mes messages" && <MyMessages />}
		</div>
	);
}
