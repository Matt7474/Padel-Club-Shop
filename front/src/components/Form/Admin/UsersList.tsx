import { useEffect, useState } from "react";
import { getAllUsers } from "../../../api/User";
import type { User, UserApiResponse } from "../../../types/User";
import { useSortableData } from "../Tools/useSortableData";
import UserDetails from "./UserDetails";

export default function UsersList() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const { items: sortedUsers, requestSort } = useSortableData(users);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data: UserApiResponse[] = await getAllUsers();

				const mappedUsers: User[] = data.map((apiUser) => ({
					userId: apiUser.user_id,
					lastName: apiUser.last_name,
					firstName: apiUser.first_name,
					phone: apiUser.phone,
					email: apiUser.email,
					role: apiUser.role_id,
					address: apiUser.addresses,
				}));

				setUsers(mappedUsers);
				console.log("Users mappés:", mappedUsers);
			} catch (err) {
				const error = err as Error;
				setError(
					error.message || "Erreur lors de la récupération des utilisateurs",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const handleUserClick = (user: User) => setSelectedUser(user);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p>Erreur : {error}</p>;
	if (selectedUser) {
		return <UserDetails user={selectedUser} />;
	}

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Utilisateurs
			</h2>

			<div className="grid grid-cols-[3fr_3fr_3fr_5fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr] h-10 bg-gray-300 mt-4 mb-2 text-sm ">
				<button
					type="button"
					className="border-b pl-1 cursor-pointer"
					onClick={() => requestSort("role")}
				>
					STATUT ↓
				</button>
				<button
					type="button"
					className="border-b pl-1 cursor-pointer text-start"
					onClick={() => requestSort("lastName")}
				>
					NOM ↓
				</button>
				<button
					type="button"
					className="border-b pl-1 cursor-pointer text-start"
					onClick={() => requestSort("firstName")}
				>
					PRENOM ↓
				</button>
				<button
					type="button"
					className="overflow-hidden border-b pl-1 cursor-pointer text-start"
					onClick={() => requestSort("email")}
				>
					EMAIL ↓
				</button>
				<button
					type="button"
					className="overflow-hidden border-b pl-1 cursor-pointer text-center hidden xl:block"
				>
					TELEPHONE
				</button>
			</div>

			{sortedUsers.map((user) => (
				<button
					key={user.userId}
					type="button"
					onClick={() => handleUserClick(user)}
					className="cursor-pointer w-full text-left hover:bg-gray-300"
				>
					<div className="grid grid-cols-[3fr_3fr_3fr_5fr] xl:grid-cols-[2fr_3fr_3fr_3fr_2fr] h-10 items-center border-b">
						<p className="px-1 text-xs flex justify-center">
							{user.role === 1 && (
								<img
									src="/icons/superadmin.svg"
									alt="Super Admin"
									className="w-7 h-7"
								/>
							)}
							{user.role === 2 && (
								<img src="/icons/tie.svg" alt="Admin" className="w-7 h-7" />
							)}
							{user.role === 3 && (
								<img
									src="/icons/profile.svg"
									alt="Client"
									className="w-6 h-6"
								/>
							)}
						</p>
						<p className="px-1 text-xs">{user.lastName}</p>
						<p className="px-1 text-xs">{user.firstName}</p>
						<p className="px-1 text-xs truncate">{user.email}</p>
						<p className="px-1 text-xs text-center hidden xl:block">
							{user.phone}
						</p>
					</div>
				</button>
			))}
		</div>
	);
}
