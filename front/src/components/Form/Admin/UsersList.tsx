import data from "../../../../data/dataTest.json";

export default function UsersList() {
	const usersData = data.users;

	const handleUserClick = () => {
		console.log("handleUserClick");
	};
	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Liste des Utilisateurs
				</h2>
				<div className="grid grid-cols-3 bg-gray-300 mt-4 mb-2">
					<p className="border-b pl-1">NOM ↓</p>
					<p className="border-b pl-1">PRENOM ↓</p>
					<p className="overflow-hidden border-b pl-1">EMAIL ↓</p>
				</div>
				{usersData.map((user) => (
					<div key={user.user_id}>
						<button
							type="button"
							onClick={handleUserClick}
							className="cursor-pointer w-full text-left"
						>
							<div className="grid grid-cols-3">
								<p className="border-b px-1 py-1 text-xs">{user.lastname}</p>
								<p className="border-b px-1 py-1 text-xs">{user.firstname}</p>
								<p className="border-b px-1 py-1 text-xs truncate">
									{user.email}
								</p>
							</div>
						</button>
					</div>
				))}
			</div>
		</>
	);
}
