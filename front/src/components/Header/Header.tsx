import { useState } from "react";
import { Link } from "react-router-dom";
import CartModal from "../Modal/CartModal";
import MenuModal from "../Modal/MenuModal";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
		console.log(isMenuOpen ? "Fermeture du menu" : "Ouverture du menu");
	};

	const toggleCart = () => {
		setIsCartOpen((prev) => !prev);
		console.log(isCartOpen ? "Fermeture du panier" : "Ouverture du panier");
	};

	const handleSearch = () => {
		console.log("Recherche en cours");
		setIsMenuOpen(false);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const closeCart = () => {
		setIsCartOpen(false);
	};

	return (
		<>
			<div className="flex justify-between mx-3 mt-3">
				<div className="flex">
					<button
						type="button"
						onClick={toggleMenu}
						className="relative z-30 2xl:hidden"
					>
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

				<div className="flex gap-3 xl:-mt-4 mr-1 items-center">
					<Link
						to="/profile"
						className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8 2xl:mr-4"
					>
						<img src="/icons/profile.svg" alt="icon-compte" className="block" />
					</Link>

					<button
						type="button"
						className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8"
						onClick={toggleCart}
					>
						<img src="/icons/cart.svg" alt="icon-panier" className="block" />
					</button>
				</div>
			</div>

			{/* Modale Menu */}
			{isMenuOpen && <MenuModal closeMenu={closeMenu} />}

			{/* Modale Panier */}
			{isCartOpen && <CartModal closeCart={closeCart} />}
		</>
	);
}
