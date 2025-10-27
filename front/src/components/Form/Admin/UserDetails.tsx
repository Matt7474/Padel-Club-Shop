import { useEffect, useState } from "react";
import { getOrders } from "../../../api/Order";
import { updateUserRole } from "../../../api/User";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Order } from "../../../types/Order";
import type { User } from "../../../types/User";
import ConfirmModal from "../../Modal/ConfirmModal";
import Toogle from "../Toogle/Toogle";
import Button from "../Tools/Button";
import Select from "../Tools/Select";
import OrderDetails from "./OrderDetails";
import UsersList from "./UsersList";

interface UserProps {
	user: User;
	orders?: { user_id: number; order_id: number }[];
}

export default function UserDetails({ user }: UserProps) {
	// Stores
	const addToast = useToastStore((state) => state.addToast);
	const currentLoggedUser = useAuthStore((state) => state.user);

	// États
	const [currentUser, setCurrentUser] = useState<User>(user);
	const [clickReturn, setClickReturn] = useState<User | null>(null);
	const [changeUserRole, setChangeUserRole] = useState(false);
	const [showOrder, setShowOrder] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [roleSelected, setRoleSelected] = useState("");
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [userOrders, setUserOrders] = useState<Order[]>([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(false);

	// Récupération des commandes
	useEffect(() => {
		const fetchUserOrders = async () => {
			setIsLoadingOrders(true);
			try {
				const orders = await getOrders();
				const filteredOrders = orders.filter(
					(order: Order) => order.user_id === user.userId,
				);
				setUserOrders(filteredOrders);
			} catch (error) {
				console.error("Erreur lors de la récupération des commandes:", error);
				addToast("Erreur lors du chargement des commandes", "bg-red-500");
			} finally {
				setIsLoadingOrders(false);
			}
		};

		fetchUserOrders();
	}, [user.userId, addToast]);

	console.log("userOrders", userOrders);

	// Variables dérivées
	const hasOrders = userOrders.length > 0;
	const userRole =
		currentUser.role === 1
			? "Super Admin"
			: currentUser.role === 2
				? "Admin"
				: "Client";

	// Utilitaires
	const getRoleAsNumber = (role: string | number | undefined): number => {
		if (role === undefined) return 3;
		if (typeof role === "number") return role;
		const roleLower = role.toLowerCase();
		if (roleLower === "super admin") return 1;
		if (roleLower === "admin") return 2;
		return 3;
	};

	const canModifyRole = (): boolean => {
		if (!currentLoggedUser) return false;
		const currentUserRoleId = getRoleAsNumber(currentLoggedUser.role);
		if (currentLoggedUser.id === user.userId) return false;
		if (user.role === 1 && currentUserRoleId !== 1) return false;
		return true;
	};

	const getAvailableRoles = (): string[] => {
		const allRoles = ["Client", "Admin", "Super Admin"];
		if (!currentLoggedUser) return [];
		const currentUserRoleId = getRoleAsNumber(currentLoggedUser.role);
		if (currentUserRoleId === 2) {
			return allRoles.filter((role) => role !== "Super Admin");
		}
		return allRoles;
	};

	// Handlers
	const handleClick = (user: User) => setClickReturn(user);

	const handleToggleChange = (value: boolean) => {
		if (!canModifyRole()) {
			addToast(
				"Vous n'avez pas les permissions pour modifier ce rôle",
				"bg-red-500",
			);
			return;
		}
		setChangeUserRole(value);
	};

	const handleChangeRole = () => setIsConfirmOpen(true);

	const handleConfirmChange = async () => {
		if (!currentLoggedUser || !canModifyRole()) {
			addToast(
				"Vous n'avez pas les permissions pour cette action",
				"bg-red-500",
			);
			setIsConfirmOpen(false);
			return;
		}

		const roleMap: Record<string, number> = {
			"super admin": 1,
			admin: 2,
			client: 3,
		};

		const roleId = roleMap[roleSelected.toLowerCase()];
		const currentUserRoleId = getRoleAsNumber(currentLoggedUser.role);

		if (currentUserRoleId === 2 && roleId === 1) {
			addToast(
				"Vous ne pouvez pas attribuer le rôle Super Admin",
				"bg-red-500",
			);
			setIsConfirmOpen(false);
			return;
		}

		if (currentLoggedUser.id === user.userId) {
			addToast("Vous ne pouvez pas modifier votre propre rôle", "bg-red-500");
			setIsConfirmOpen(false);
			return;
		}

		if (!user?.userId) {
			addToast("Erreur : utilisateur introuvable", "bg-red-500");
			setIsConfirmOpen(false);
			return;
		}

		try {
			await updateUserRole(user.userId, roleId);
			setCurrentUser((prev) => ({ ...prev, role: roleId }));
			addToast(
				`${user.firstName} ${user.lastName} est maintenant ${roleSelected}`,
				"bg-green-500",
			);
		} catch (error) {
			console.error("Erreur lors du changement de rôle :", error);
			addToast(
				"Une erreur est survenue lors du changement de rôle",
				"bg-red-500",
			);
		} finally {
			setIsConfirmOpen(false);
			setChangeUserRole(false);
		}
	};

	const handleCancelChange = () => setIsConfirmOpen(false);

	const handleSelectOrder = (order: Order) => {
		setSelectedOrder(order);
	};

	// Render conditionnel
	if (clickReturn) return <UsersList />;

	const menuOptions = getAvailableRoles();

	return (
		<div>
			{selectedOrder ? (
				<OrderDetails
					order={selectedOrder}
					onReturn={() => setSelectedOrder(null)}
					onDeleteOrder={() => {}}
					onProcessingOrder={() => {}}
					onReadyOrder={() => {}}
					onShippedOrder={() => {}}
				/>
			) : (
				<div>
					{/* Bouton retour */}
					<button
						type="button"
						onClick={() => handleClick(user)}
						className="flex mt-4 cursor-pointer "
					>
						<img
							src="/icons/arrow.svg"
							alt="fleche retour"
							className="w-4 rotate-180"
						/>
						Retour
					</button>
					<div className="xl:flex xl:flex-col xl:w-2/5 mx-auto text-left border rounded-2xl p-3 bg-white">
						{/* Informations de base de l'utilisateur */}
						<div className="mt-4 pl-1 xl:pl-0 relative ">
							{userRole === "Super Admin" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/superadmin.svg"
										alt="logo-superAdmin"
										className="w-7"
									/>
								</div>
							)}
							{userRole === "Admin" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/tie.svg"
										alt="logo-cravate"
										className="w-7"
									/>
								</div>
							)}
							{userRole === "Client" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/profile.svg"
										alt="logo-utilisateur"
										className="w-7"
									/>
								</div>
							)}
							<div className="grid grid-cols-[2fr_3fr]">
								<p className="font-semibold">Rôle :</p>
								<p className="font-semibold">{userRole}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Nom :</p>
								<p>{user.lastName}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Prénom :</p>
								<p>{user.firstName}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Email :</p>
								<p>{user.email}</p>
							</div>
						</div>

						<div className="w-full border-b my-4 border-gray-200"></div>

						{/* Adresses */}
						<div>
							<div className="flex justify-between">
								<h2 className="mb-2 underline">Adresse de livraison</h2>
								<img
									src="/icons/delivery.svg"
									alt="livraison"
									className="w-8 mr-2"
								/>
							</div>
							<div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>N° rue :</p>
									<p>{user.address?.[0].street_number}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Nom de rue :</p>
									<p>{user.address?.[0].street_name}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Code postal :</p>
									<p>{user.address?.[0].zip_code}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Ville :</p>
									<p>{user.address?.[0].city}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Pays :</p>
									<p>{user.address?.[0].country}</p>
								</div>
							</div>
						</div>

						{user.address?.[1] && (
							<div className="mt-4">
								<div className="flex justify-between">
									<h2 className="mb-2 underline">Adresse de facturation</h2>
									<img
										src="/icons/invoice.svg"
										alt="facturation"
										className="w-8 mr-2"
									/>
								</div>
								<div>
									<div className="grid grid-cols-[2fr_3fr]">
										<p>N° rue :</p>
										<p>{user.address?.[1].street_number}</p>
									</div>
									<div className="grid grid-cols-[2fr_3fr]">
										<p>Nom de rue :</p>
										<p>{user.address?.[1].street_name}</p>
									</div>
									<div className="grid grid-cols-[2fr_3fr]">
										<p>Code postal :</p>
										<p>{user.address?.[1].zip_code}</p>
									</div>
									<div className="grid grid-cols-[2fr_3fr]">
										<p>Ville :</p>
										<p>{user.address?.[1].city}</p>
									</div>
									<div className="grid grid-cols-[2fr_3fr]">
										<p>Pays :</p>
										<p>{user.address?.[1].country}</p>
									</div>
								</div>
							</div>
						)}

						<div className="w-full border-b my-4 border-gray-200"></div>

						{/* Toggle pour modifier le rôle avec gestion des permissions */}
						{canModifyRole() ? (
							<>
								<Toogle
									title={`Modifier le rôle de ${user.lastName} ${user.firstName}`}
									checked={changeUserRole}
									onChange={handleToggleChange}
								/>
								{changeUserRole && (
									<div className="mt-2">
										<Select
											label={`Quel rôle attribuer à ${user.lastName} ${user.firstName} ?`}
											value={roleSelected}
											onChange={setRoleSelected}
											options={menuOptions}
											labels={menuOptions}
										/>
										{roleSelected && roleSelected !== userRole && (
											<div className="-mt-4">
												<Button
													type="submit"
													onClick={handleChangeRole}
													buttonText="CONFIRMER LE CHANGEMENT DE ROLE"
												/>
											</div>
										)}
									</div>
								)}
							</>
						) : (
							<div className="text-gray-500 italic p-2 bg-gray-50 rounded">
								{!currentLoggedUser
									? "Vous devez être connecté pour modifier les rôles."
									: currentLoggedUser.id === user.userId
										? "Vous ne pouvez pas modifier votre propre rôle."
										: "Vous n'avez pas les permissions pour modifier le rôle de cet utilisateur."}
							</div>
						)}

						<div className="w-full border-b my-4 border-gray-200"></div>

						{/* Commandes */}
						{hasOrders && (
							<div>
								<Toogle
									title={`Voir les commandes de ${user.lastName} ${user.firstName}`}
									checked={showOrder}
									onChange={setShowOrder}
								/>
								{showOrder && (
									<div className="mt-6">
										<div className="flex justify-between font-semibold ml-2">
											<h2 className="mb-2 underline">
												{userOrders.length} commande(s) effectuée(s)
											</h2>
											<img
												src="/icons/package.svg"
												alt="commande"
												className="w-8 mr-2 -mt-2"
											/>
										</div>
										<div className="border bg-gray-100 mt-1 px-2 pb-2 h-76 overflow-y-auto">
											{isLoadingOrders ? (
												<div className="text-center py-4">
													<p>Chargement des commandes...</p>
												</div>
											) : userOrders.length === 0 ? (
												<div className="text-center py-4 text-gray-500">
													<p>Aucune commande trouvée</p>
												</div>
											) : (
												<div className="mt-2 space-y-2">
													{userOrders.map((order) => {
														const statusConfig = {
															paid: {
																label: "Payée",
																color: "text-blue-600",
																icon: "/icons/invoice-check.svg",
															},
															processing: {
																label: "En traitement",
																color: "text-orange-600",
																icon: "/icons/package.svg",
															},
															ready: {
																label: "Prête",
																color: "text-purple-600",
																icon: "/icons/package-check.svg",
															},
															shipped: {
																label: "Expédiée",
																color: "text-green-600",
																icon: "/icons/delivery.svg",
															},
															cancelled: {
																label: "Annulée",
																color: "text-red-600",
																icon: "/icons/invoice-cancelled.svg",
															},
														};

														const totalArticles =
															order.items?.reduce(
																(total, item) => total + item.quantity,
																0,
															) || 0;
														const currentStatus = statusConfig[
															order.status as keyof typeof statusConfig
														] || {
															label: order.status || "N/A",
															color: "text-gray-600",
															icon: "/icons/package.svg",
														};

														return (
															<button
																key={order.order_id}
																type="button"
																className="p-2 border bg-white border-gray-200 rounded shadow-sm cursor-pointer w-full hover:bg-gray-50 transition-colors"
																onClick={() => handleSelectOrder(order)}
															>
																<div className="text-start">
																	<p>
																		<strong>Référence :</strong>{" "}
																		{order.reference}
																	</p>
																	<p>
																		<strong>Nombre d'articles :</strong>{" "}
																		{totalArticles}
																	</p>
																	<p>
																		<strong>Montant total :</strong>{" "}
																		{order.total_amount
																			? `${order.total_amount} €`
																			: "N/A"}
																	</p>
																	<div className="flex items-center gap-2 mt-1">
																		<strong>Statut :</strong>
																		<img
																			src={currentStatus.icon}
																			alt={currentStatus.label}
																			className="w-5 h-5"
																		/>
																		<span
																			className={`font-semibold ${currentStatus.color}`}
																		>
																			{currentStatus.label}
																		</span>
																	</div>
																</div>
															</button>
														);
													})}
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Modal de confirmation */}
					{isConfirmOpen && (
						<ConfirmModal
							message={`Voulez-vous vraiment changer le rôle de ${user.firstName} ${user.lastName} en ${roleSelected} ?`}
							onConfirm={handleConfirmChange}
							onCancel={handleCancelChange}
						/>
					)}
				</div>
			)}
		</div>
	);
}
