import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/useAuthStore";
import CartModal from "../Modal/CartModal";
import MenuModal from "../Modal/MenuModal";
import SearchBar from "../SearchBar/SearchBar";
import { useToastStore } from "../../store/ToastStore ";

export default function Header() {
	const { user, isAuthenticated } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);

	const navigate = useNavigate();
	const [isQuantity, setIsQuantity] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const cart = useCartStore((state) => state.cart);
	// Somme des quantités dans le panier
	useEffect(() => {
		const totalQuantity = cart.reduce<number>(
			(acc, item) => acc + item.quantity,
			0,
		);
		setIsQuantity(totalQuantity);
	}, [cart]);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const toggleCart = () => {
		setIsCartOpen((prev) => !prev);
	};

	const handleSearch = (searchValue: string) => {
		if (!searchValue.trim()) return;
		navigate(`/articles?search=${encodeURIComponent(searchValue)}`);
		closeMenu();
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const closeCart = () => {
		setIsCartOpen(false);
	};

	const handleLogout = () => {
		const logout = useAuthStore.getState().logout;
		logout();
		console.log("Utilisateur déconnecté ✅");
	};

	console.log(user?.role);

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
					<Link to={"/"} className="flex ml-2 mt-1">
						<img
							src="/icons/logo_name.svg"
							alt="titre-site"
							className="w-15 hover:cursor-pointer -mt-1 2xl:w-25"
						/>
					</Link>
				</div>

				<SearchBar onSearch={handleSearch} className="hidden 2xl:block" />

				<div className="flex gap-3 xl:-mt-4 mr-1 items-center">
					<button
						type="button"
						className="w-6.5 hover:cursor-pointer xl:mt-2.5 2xl:w-8 2xl:mr-4 mt-1"
						onClick={() => {
							if (isAuthenticated) {
								handleLogout();
								addToast(`👋 A bientôt ${user?.firstName}`, "bg-red-500");
								navigate("/");
							} else {
								navigate("/login");
							}
						}}
					>
						<img
							src={isAuthenticated ? "/icons/logout.svg" : "/icons/login.svg"}
							alt={isAuthenticated ? "icon-logout" : "icon-login"}
							className={`block transition-transform duration-200 ${
								!isAuthenticated ? "rotate-0" : "rotate-180"
							}`}
						/>
					</button>

					{/* MODIFICATION CLIENT ->  ADMIN A FAIRE  APRES TESTS */}
					{isAuthenticated &&
						(user?.role === "super admin" || user?.role === "admin") && (
							<Link
								to="/admin/profile"
								className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8 2xl:mr-4"
							>
								<div className="relative">
									<img
										src="/icons/profile.svg"
										alt="icon-compte"
										className="block"
									/>
									<div>
										<img
											src="/icons/tie.svg"
											alt="cravate"
											className="absolute -mt-3 left-1 w-4 xl:-mt-4 xl:left-2"
										/>
									</div>
								</div>
							</Link>
						)}

					{isAuthenticated && user?.role === "client" && (
						<Link
							to="/profile"
							className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8 2xl:mr-4"
						>
							<img
								src="/icons/profile.svg"
								alt="icon-compte"
								className="block"
							/>
						</Link>
					)}

					<button
						type="button"
						className="relative w-6 hover:cursor-pointer mt-0.5 xl:mt-3 xl:w-7.5 "
						onClick={toggleCart}
					>
						{isQuantity > 0 && (
							<span className="absolute top-0 right-2 bg-red-500 h-5 w-5 rounded-full text-xs text-white font-semibold flex items-center justify-center -translate-y-1/2 translate-x-1/2 z-0">
								{isQuantity}
							</span>
						)}

						<img
							src="/icons/cart.svg"
							alt="icon-panier"
							className="block relative z-10"
						/>
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
