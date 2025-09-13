import { useState } from "react";
import LinkMenu from "../LinkMenu/LinkMenu";

export default function MenuModal({ closeMenu }: { closeMenu: () => void }) {
	const [, setIsMenuOpen] = useState(false);

	const handleSearch = () => {
		console.log("Recherche en cours");
		closeMenu();
	};

	return (
		<>
			{/* Overlay - div simple sans interactions */}
			<div
				className="fixed inset-0 z-10  bg-opacity-50"
				onClick={() => setIsMenuOpen(false)}
				onKeyDown={(e) => {
					if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
						setIsMenuOpen(false);
					}
				}}
				tabIndex={0}
				role="button"
				aria-label="Fermer le menu"
			/>

			{/* Contenu du menu - positionné séparément */}
			<div
				className="flex flex-col border border-gray-500 rounded-lg pl-3 text-xl absolute left-3 right-3 shadow-xl px-3 top-1/10 bg-white z-20"
				tabIndex={-1}
				role="dialog"
				aria-label="Menu de navigation"
			>
				{/* Bouton fermer invisible pour l'accessibilité */}
				<button
					type="button"
					onClick={() => setIsMenuOpen(false)}
					className="sr-only"
					aria-label="Fermer le menu"
				>
					Fermer
				</button>

				<div className="relative mb-3 flex items-center">
					<input
						type="text"
						className="bg-white mt-5 h-10 w-full border-1 border-gray-500 rounded-md relative pl-2 text-gray-700 pb-1"
						placeholder="Rechercher"
					/>

					<button
						type="button"
						onClick={handleSearch}
						className="absolute right-2 mt-5.5 opacity-60"
						aria-label="Rechercher"
					>
						<img
							src="/icons/glass.svg"
							alt=""
							className="w-4 hover:cursor-pointer"
						/>
					</button>
				</div>

				<div className="flex flex-col gap-y-3 mt-4">
					<LinkMenu
						to="promotion"
						name="Promotions"
						color="text-orange-500"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="raquette"
						name="Raquettes"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="sac"
						name="Sacs"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="balle"
						name="Balles"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="vetement"
						name="Vêtements"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="chaussure"
						name="Chaussures"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="accessoire"
						name="Accessoires"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="marque"
						name="Marques"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
				</div>
			</div>
		</>
	);
}
