import { useState } from "react";
import data from "../../../../data/dataTest.json";
import { updateUserRole } from "../../../api/User";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Order } from "../../../types/Order";
import type { User } from "../../../types/User";
import ConfirmModal from "../../Modal/ConfirmModal";
import Toogle from "../Toogle/Toogle";
import Button from "../Tools/Button";
import Select from "../Tools/Select";
import OrderDetails from "./ClientOrderDetails";
import UsersList from "./UsersList";

interface UserProps {
	user: User;
	orders?: { user_id: number; order_id: number }[];
}

export default function UserDetails({ user }: UserProps) {
	const addToast = useToastStore((state) => state.addToast);
	const currentLoggedUser = useAuthStore((state) => state.user);

	const [currentUser, setCurrentUser] = useState<User>(user);
	const [clickReturn, setClickReturn] = useState<User | null>(null);
	const [changeUserRole, setChangeUserRole] = useState(false);
	const [showOrder, setShowOrder] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [roleSelected, setRoleSelected] = useState("");
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const userOrders = data.orders.filter((o) => o.user_id === user.userId);
	const hasOrders = userOrders.length > 0;
	const userRole =
		currentUser.role === 1
			? "Super Admin"
			: currentUser.role === 2
				? "Admin"
				: "Client";

	// Fonction utilitaire pour convertir le role en number
	const getRoleAsNumber = (role: string | number | undefined): number => {
		if (role === undefined) return 3; // Par défaut client si undefined
		if (typeof role === "number") return role;
		const roleLower = role.toLowerCase();
		if (roleLower === "super admin") return 1;
		if (roleLower === "admin") return 2;
		return 3; // client
	};

	// Fonction pour vérifier si l'utilisateur connecté peut modifier ce rôle
	const canModifyRole = (): boolean => {
		// Si pas d'utilisateur connecté, pas de modification possible
		if (!currentLoggedUser) {
			return false;
		}

		const currentUserRoleId = getRoleAsNumber(currentLoggedUser.role);

		// Règle 3: Personne ne peut modifier son propre rôle
		if (currentLoggedUser.id === user.userId) {
			return false;
		}

		// Règle 1: Seul un Super Admin peut modifier le rôle d'un Super Admin
		if (user.role === 1 && currentUserRoleId !== 1) {
			return false;
		}

		return true;
	};

	// Fonction pour filtrer les options de rôle disponibles
	const getAvailableRoles = (): string[] => {
		const allRoles = ["Client", "Admin", "Super Admin"];

		// Si pas d'utilisateur connecté, pas d'options
		if (!currentLoggedUser) {
			return [];
		}

		const currentUserRoleId = getRoleAsNumber(currentLoggedUser.role);

		// Règle 2: Un Admin ne peut pas attribuer le rôle Super Admin
		if (currentUserRoleId === 2) {
			return allRoles.filter((role) => role !== "Super Admin");
		}

		return allRoles;
	};

	const menuOptions = getAvailableRoles();

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

	const handleChangeRole = () => {
		setIsConfirmOpen(true);
	};

	const handleConfirmChange = async () => {
		// Vérification de sécurité supplémentaire
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

		// Règle 2: Vérification supplémentaire - Un Admin ne peut pas attribuer Super Admin
		if (currentUserRoleId === 2 && roleId === 1) {
			addToast(
				"Vous ne pouvez pas attribuer le rôle Super Admin",
				"bg-red-500",
			);
			setIsConfirmOpen(false);
			return;
		}

		// Règle 3: Vérification supplémentaire - Pas de modification de son propre rôle
		if (currentLoggedUser.id === user.userId) {
			addToast("Vous ne pouvez pas modifier votre propre rôle", "bg-red-500");
			setIsConfirmOpen(false);
			return;
		}

		if (!user?.userId) {
			addToast("Erreur : utilisateur introuvable", "bg-red-500");
			return;
		}

		try {
			console.log(
				`${user.firstName} ${user.lastName} est maintenant ${roleSelected} (ID: ${roleId})`,
			);

			await updateUserRole(user?.userId, roleId);

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
		}

		setIsConfirmOpen(false);
		setChangeUserRole(false);
	};

	const handleCancelChange = () => {
		setIsConfirmOpen(false);
	};

	const handleOrder = (order: Order) => setSelectedOrder(order);

	if (clickReturn) return <UsersList />;

	return (
		<div>
			{selectedOrder ? (
				<OrderDetails order={selectedOrder} user={user} />
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
					<div className="xl:flex xl:flex-col xl:w-2/5 mx-auto text-left">
						{/* Informations de base de l'utilisateur */}
						<div className="mt-4 pl-1 xl:pl-0 relative ">
							{userRole === "Super Admin" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/superadmin.svg"
										alt="logo-cravate"
										className="w-8"
									/>
								</div>
							)}
							{userRole === "Admin" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/tie.svg"
										alt="logo-cravate"
										className="w-8"
									/>
								</div>
							)}
							{userRole === "Client" && (
								<div className="absolute top-0 right-2">
									<img
										src="/icons/profile.svg"
										alt="logo-cravate"
										className="w-8"
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
											<div className="mt-2 space-y-2">
												{userOrders.map((order) => (
													<button
														key={order.order_id}
														type="button"
														className="p-2 border bg-white border-gray-200 rounded shadow-sm cursor-pointer w-full"
														onClick={() => handleOrder(order)}
													>
														<div className="text-start">
															<p>
																<strong>Référence :</strong> {order.reference}
															</p>
															<p>
																<strong>Nombre d'articles :</strong>{" "}
																{order.order_lines.length}
															</p>
															<p>
																<strong>Paiement :</strong>{" "}
																{order.payment?.payment_method || "N/A"}
															</p>
														</div>
													</button>
												))}
											</div>
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
