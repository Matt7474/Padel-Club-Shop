import { useState } from "react";
import { Link } from "react-router-dom";
import LinkMenu from "../LinkMenu/LinkMenu";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
		console.log(isMenuOpen ? "Fermeture du menu" : "Ouverture du menu");
	};

	const handleSearch = () => {
		console.log("Recherche en cours");
		setIsMenuOpen(false);
	};

	// Fonction pour fermer le menu (à passer aux LinkMenu)
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	// Fonction pour gérer la fermeture du menu avec le clavier
	const handleCloseMenuKeyDown = (e: {
		key: string;
		preventDefault: () => void;
	}) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
			e.preventDefault();
			setIsMenuOpen(false);
		}
	};

	// Fonction pour éviter la propagation avec le clavier
	const handleMenuContentKeyDown = (e: {
		key: string;
		stopPropagation: () => void;
	}) => {
		// Empêcher la propagation pour éviter la fermeture accidentelle
		if (e.key === "Enter" || e.key === " ") {
			e.stopPropagation();
		}
	};

	return (
		<>
			<div className="flex justify-between mx-3 mt-3">
				<div className="flex">
					<button type="button" onClick={toggleMenu} className="2xl:hidden">
						{isMenuOpen ? (
							<img
								src="/icons/cross.svg"
								alt="Fermer le menu"
								className="w-9 h-9 transition-transform duration-300 rotate-180 hover:cursor-pointer"
							/>
						) : (
							<img
								src="/icons/burger_menu.svg"
								alt="Ouvrir le menu"
								className="w-9 h-9 transition-transform duration-300 rotate-0 hover:cursor-pointer"
							/>
						)}
					</button>
					<Link to={"/homepage"} className="flex ml-2 mt-1">
						<img
							src="/icons/logo_name.svg"
							alt="titre-site"
							className="w-15 hover:cursor-pointer -mt-1 2xl:w-25"
						/>
					</Link>
				</div>

				<div className="hidden 2xl:block relative">
					<input
						type="text"
						className="bg-white mt-4 h-10 w-150 border-1 border-gray-500 rounded-sm relative pl-2 text-gray-700 pb-1"
						placeholder="Rechercher"
					/>

					<button
						type="button"
						onClick={handleSearch}
						className="absolute right-3 -mt-1 top-1/2 -translate-y-1/2 opacity-60"
						aria-label="Rechercher"
					>
						<img
							src="/icons/glass.svg"
							alt=""
							className="w-5 hover:cursor-pointer"
						/>
					</button>
				</div>

				<div className="flex gap-3 mt-3 mr-1">
					<Link
						to="/profile"
						className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8 2xl:mr-4"
					>
						<img src="/icons/profile.svg" alt="icon-compte" />
					</Link>

					<Link to="/cart" className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8">
						<img src="/icons/cart.svg" alt="icon-panier" />
					</Link>
				</div>
			</div>
			{isMenuOpen && (
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
						onKeyDown={handleMenuContentKeyDown}
						tabIndex={-1}
						role="dialog"
						aria-label="Menu de navigation"
					>
						{/* Bouton fermer invisible pour l'accessibilité */}
						<button
							type="button"
							onClick={() => setIsMenuOpen(false)}
							onKeyDown={handleCloseMenuKeyDown}
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
			)}
		</>
	);
}
