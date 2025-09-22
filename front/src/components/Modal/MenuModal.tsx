import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LinkMenu from "../LinkMenu/LinkMenu";
import SearchBar from "../SearchBar/SearchBar";

interface menuModalsProps {
	closeMenu: () => void;
}

export default function MenuModal({ closeMenu }: menuModalsProps) {
	const navigate = useNavigate();
	const [, setIsMenuOpen] = useState(false);

	const handleSearch = (searchValue: string) => {
		if (searchValue.trim()) {
			closeMenu();
			navigate(`/articles?search=${encodeURIComponent(searchValue)}`);
		}
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

				<SearchBar onSearch={handleSearch} className="block 2xl:hidden" />

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
						to="racket"
						name="Raquettes"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="bag"
						name="Sacs"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="ball"
						name="Balles"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="clothing"
						name="Vêtements"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="shoes"
						name="Chaussures"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<LinkMenu
						to="accessory"
						name="Accessoires"
						color="text-black"
						border={1}
						marginLeft={0}
						animate="hover:animate-bounce"
						onLinkClick={closeMenu}
					/>
					<Link to="/allArticle">Tous les articles</Link>
				</div>
			</div>
		</>
	);
}
