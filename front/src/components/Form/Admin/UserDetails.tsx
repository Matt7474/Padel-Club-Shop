import { useState } from "react";
import data from "../../../../data/dataTest.json";
import type { Order } from "../../../types/Order";
import type { User } from "../../../types/User";
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
	const [clickReturn, setClickReturn] = useState<User | null>(null);
	const [changeUserRole, setChangeUserRole] = useState(false);
	const [showOrder, setShowOrder] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [menuSelected, setMenuSelected] = useState("");

	const userOrders = data.orders.filter((o) => o.user_id === user.user_id);
	const hasOrders = userOrders.length > 0;
	const userRole = user.role === 1 ? "Admin" : "Client";

	const menuOptions = ["Client", "Admin"];

	const handleClick = (user: User) => setClickReturn(user);
	const handleChangeRole = () => setChangeUserRole(true);
	const handleOrder = (order: Order) => setSelectedOrder(order);

	// Retour à la liste des utilisateurs
	if (clickReturn) return <UsersList />;

	return (
		<div>
			{/* Affichage conditionnel : détail commande ou informations supplémentaires */}
			{selectedOrder ? (
				<OrderDetails order={selectedOrder} user={user} />
			) : (
				<>
					{/* Bouton retour */}
					<button
						type="button"
						onClick={() => handleClick(user)}
						className="flex mt-4 cursor-pointer"
					>
						<img
							src="/icons/arrow.svg"
							alt="fleche retour"
							className="w-4 rotate-180"
						/>
						Retour
					</button>

					{/* Informations de base de l'utilisateur */}
					<div className="mt-4 pl-1 relative">
						{userRole === "Admin" && (
							<div className="absolute top-0 right-2">
								<img src="/icons/tie.svg" alt="logo-cravate" className="w-8" />
							</div>
						)}
						<div className="grid grid-cols-[2fr_3fr]">
							<p className="font-semibold">Rôle :</p>
							<p className="font-semibold">{userRole}</p>
						</div>
						<div className="grid grid-cols-[2fr_3fr]">
							<p>Nom :</p>
							<p>{user.lastname}</p>
						</div>
						<div className="grid grid-cols-[2fr_3fr]">
							<p>Prénom :</p>
							<p>{user.firstname}</p>
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
								<p>{user.addresses[0].street_number}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Nom de rue :</p>
								<p>{user.addresses[0].street_name}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Code postal :</p>
								<p>{user.addresses[0].zip_code}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Ville :</p>
								<p>{user.addresses[0].city}</p>
							</div>
							<div className="grid grid-cols-[2fr_3fr]">
								<p>Pays :</p>
								<p>{user.addresses[0].country}</p>
							</div>
						</div>
					</div>

					{user.addresses[1] && (
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
									<p>{user.addresses[1].street_number}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Nom de rue :</p>
									<p>{user.addresses[1].street_name}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Code postal :</p>
									<p>{user.addresses[1].zip_code}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Ville :</p>
									<p>{user.addresses[1].city}</p>
								</div>
								<div className="grid grid-cols-[2fr_3fr]">
									<p>Pays :</p>
									<p>{user.addresses[1].country}</p>
								</div>
							</div>
						</div>
					)}

					<div className="w-full border-b my-4 border-gray-200"></div>
					{/* Toggle pour modifier le rôle */}
					<Toogle
						title={`Modifier le rôle de ${user.lastname} ${user.firstname}`}
						checked={changeUserRole}
						onChange={setChangeUserRole}
					/>
					{changeUserRole && (
						<div className="mt-2">
							<Select
								label={`Quel rôle attribuer à ${user.lastname} ${user.firstname} ?`}
								value={menuSelected}
								onChange={setMenuSelected}
								options={menuOptions}
								labels={menuOptions}
							/>
							{menuSelected &&
								(menuSelected === "Admin" ? 1 : 0) !== user.role && (
									<div className="-mt-4">
										<Button
											type="button"
											onClick={handleChangeRole}
											buttonText="CONFIRMER LE CHANGEMENT DE ROLE"
										/>
									</div>
								)}
						</div>
					)}
					<div className="w-full border-b my-4 border-gray-200"></div>
					{/* Commandes */}
					{hasOrders && (
						<div>
							<Toogle
								title={`Voir les commandes de ${user.lastname} ${user.firstname}`}
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
															<strong>Nombre d’articles :</strong>{" "}
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
				</>
			)}
		</div>
	);
}
