import { useEffect, useState } from "react";
import { getAllUsers } from "../../../api/User";
import type { User, UserApiResponse } from "../../../types/User";
import Loader from "../Tools/Loader";
import Pagination from "../Tools/Pagination";
import { useSortableData } from "../Tools/useSortableData";
import UserDetails from "./UserDetails";
import { FlaskConical, UserCheck, UserStar } from "lucide-react";

export default function UsersList() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const { items: sortedUsers, requestSort } = useSortableData(users);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

	const roleName: Record<number, string> = {
		1: "Super Admin",
		2: "Admin",
		3: "Client",
		4: "Testeur",
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const data: UserApiResponse[] = await getAllUsers();
				const mappedUsers: User[] = data.map((apiUser) => ({
					userId: apiUser.user_id,
					lastName: apiUser.last_name,
					firstName: apiUser.first_name,
					phone: apiUser.phone,
					email: apiUser.email,
					role: apiUser.role_id,
					roleName: roleName[apiUser.role_id] || "Inconnu",
					address: apiUser.addresses,
				}));

				setUsers(mappedUsers);
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
		const interval = setInterval(fetchUsers, 30000);
		return () => clearInterval(interval);
	}, []);

	const handleUserClick = (user: User) => setSelectedUser(user);

	if (error) return <p>Erreur : {error}</p>;
	if (selectedUser) {
		return <UserDetails user={selectedUser} />;
	}

	if (loading) {
		return <Loader text={"de la liste des utilisateurs	"} />;
	}

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des Utilisateurs
			</h2>
			<div className="grid grid-cols-[3fr_3fr_3fr_5fr] xl:grid-cols-[2fr_2fr_3fr_3fr_3fr_2fr] h-10 bg-gray-300 mt-4 mb-2 text-sm ">
				<button
					type="button"
					className="border-b pl-1 cursor-pointer"
					onClick={() => requestSort("role")}
				>
					STATUT ↓
				</button>
				<button
					type="button"
					className="border-b pl-1 cursor-pointer text-start hidden xl:block"
					onClick={() => requestSort("roleName")}
				>
					ROLE ↓
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
			{paginatedUsers.map((user) => (
				<button
					key={user.userId}
					type="button"
					onClick={() => handleUserClick(user)}
					className="cursor-pointer w-full text-left hover:bg-gray-300"
				>
					<div className="grid grid-cols-[3fr_3fr_3fr_5fr] xl:grid-cols-[2fr_2fr_3fr_3fr_3fr_2fr] h-10 items-center border-b">
						<p className="px-1 text-xs flex justify-center">
							{user.role === 1 && <UserStar className="text-yellow-600" />}
							{user.role === 2 && <UserStar className="text-slate-500" />}
							{user.role === 3 && <UserCheck className="text-gray-800 ml-1" />}
							{user.role === 4 && <FlaskConical className="text-emerald-600" />}
						</p>
						<p className="px-1 text-xs hidden xl:block">{user.roleName}</p>
						<p className="px-1 text-xs">{user.lastName}</p>
						<p className="px-1 text-xs">{user.firstName}</p>
						<p className="px-1 text-xs truncate">{user.email}</p>
						<p className="px-1 text-xs text-center hidden xl:block">
							{user.phone}
						</p>
					</div>
				</button>
			))}
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	);
}
