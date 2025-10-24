import { LogIn, LogOut, ShoppingCart, User, UserStar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getClientMessages } from "../../api/Contact";
import { getOrders } from "../../api/Order";
import { useCartStore } from "../../store/cartStore";
import { useToastStore } from "../../store/ToastStore ";
import { useAuthStore } from "../../store/useAuthStore";
import type { Order } from "../../types/Order";
import type { Imessages } from "../Form/Admin/ClientsMessages";
import CartModal from "../Modal/CartModal";
import MenuModal from "../Modal/MenuModal";
import SearchBar from "../SearchBar/SearchBar";

export default function Header() {
	const { user, isAuthenticated } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);
	const [unreadMessageCount, setUnreadMessageCount] = useState(0);
	const [paidOrderCount, setPaidOrderCount] = useState(0);
	const navigate = useNavigate();
	const [isQuantity, setIsQuantity] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [unreadCommandCount] = useState(0);

	const cart = useCartStore((state) => state.cart);
	// Somme des quantités dans le panier
	useEffect(() => {
		const totalQuantity = cart.reduce<number>(
			(acc, item) => acc + item.quantity,
			0,
		);
		setIsQuantity(totalQuantity);
	}, [cart]);

	// UseEffect pour afficher le nombre d'alerte
	useEffect(() => {
		const fetchUnreadMessages = async () => {
			try {
				const response = await getClientMessages();
				const unread = response.data.filter(
					(message: Imessages) => message.is_read === false,
				).length;
				setUnreadMessageCount(unread);
			} catch (error) {
				console.error("Erreur lors de la récupération des messages:", error);
			}
		};

		const fetchOrderPaid = async () => {
			try {
				const orders = await getOrders();
				const ordersPaid = orders.filter(
					(order: Order) => order.status === "paid",
				);
				setPaidOrderCount(ordersPaid.length);
			} catch (error) {
				console.error("Erreur lors de la récupération des commandes :", error);
			}
		};

		const fetchAll = async () => {
			await Promise.all([fetchUnreadMessages(), fetchOrderPaid()]);
		};

		fetchAll();
		const interval = setInterval(fetchAll, 5000);
		return () => clearInterval(interval);
	}, []);

	const totalAlertCount = unreadMessageCount + paidOrderCount;
	console.log("totalAlertCount", totalAlertCount);

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

				<div className="flex gap-4 xl:-mt-4 mr-1 items-center">
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
						{isAuthenticated ? (
							<LogOut
								className={`w-7 h-7 text-gray-800 transition-transform duration-200 `}
							/>
						) : (
							<LogIn
								className={`w-7 h-7 text-gray-800 transition-transform duration-200 rotate-0`}
							/>
						)}
					</button>

					{/* MODIFICATION CLIENT ->  ADMIN A FAIRE  APRES TESTS */}
					{isAuthenticated && user?.role === "super admin" && (
						<Link
							to="/profile"
							className="w-7 xl:w-6 hover:cursor-pointer xl:mt-2 2xl:w-9 2xl:mr-4"
						>
							<div className="relative">
								<UserStar
									className={`w-7 h-7 transition-transform duration-200 text-amber-500`}
								/>
								{totalAlertCount > 0 && (
									<div className="w-5 h-5 flex justify-center items-center rounded-full bg-red-500 text-white absolute text-[10px] font-semibold -top-1 -right-2 xl:-top-1 xl:-right-1">
										{totalAlertCount > 99 ? "99+" : totalAlertCount}
									</div>
								)}
							</div>
						</Link>
					)}

					{isAuthenticated && user?.role === "admin" && (
						<Link
							to="/profile"
							className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-9 2xl:mr-4"
						>
							<UserStar
								className={`w-7 h-7 transition-transform duration-200 text-gray-800`}
							/>
						</Link>
					)}

					{isAuthenticated && user?.role === "client" && (
						<Link
							to="/profile"
							className="w-6 hover:cursor-pointer xl:mt-2 2xl:w-8 2xl:mr-4"
						>
							<User
								className={`w-7 h-7 transition-transform duration-200 text-gray-800`}
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
						<ShoppingCart
							className={`w-7 h-7 transition-transform duration-200 text-gray-800`}
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
