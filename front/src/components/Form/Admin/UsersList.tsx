import { useState } from "react";
import data from "../../../../data/dataTest.json";
import type { User } from "../../../types/User";
import UserDetails from "./UserDetails";

export default function UsersList() {
	const usersData = data.users as User[];
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const handleUserClick = (user: User) => {
		console.log("handleUserClick");
		setSelectedUser(user);
	};

	if (selectedUser) {
		return <UserDetails user={selectedUser} />;
	}

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Liste des Utilisateurs
				</h2>
				<div className="grid grid-cols-[2fr_3fr_3fr_5fr] bg-gray-300 mt-4 mb-2 text-sm">
					<p className="border-b pl-1">STATUT</p>
					<p className="border-b pl-1">NOM</p>
					<p className="border-b pl-1">PRENOM</p>
					<p className="overflow-hidden border-b pl-1">EMAIL</p>
				</div>
				{usersData.map((user) => (
					<div key={user.user_id}>
						<button
							type="button"
							onClick={() => handleUserClick(user)}
							className="cursor-pointer w-full text-left hover:bg-gray-300"
						>
							<div className="grid grid-cols-[2fr_3fr_3fr_5fr] h-8 items-center border-b">
								<p className="px-1 text-xs flex justify-center">
									{user.role === 1 && (
										<img src="/icons/tie.svg" alt="Admin" className="w-4 h-4" />
									)}
								</p>
								<p className="px-1 text-xs">{user.lastname}</p>
								<p className="px-1 text-xs">{user.firstname}</p>
								<p className="px-1 text-xs truncate">{user.email}</p>
							</div>
						</button>
					</div>
				))}
			</div>
		</>
	);
}
