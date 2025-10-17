import { Link } from "react-router-dom";
import type { CartItem } from "../../store/cartStore";
import { useCartStore } from "../../store/cartStore";
import { useToastStore } from "../../store/ToastStore ";

export default function CartLine({
	item,
	closeCart,
}: {
	item: CartItem;
	closeCart: () => void;
}) {
	const addToast = useToastStore((state) => state.addToast);
	const { updateQuantity, removeFromCart } = useCartStore();

	const handleClick = () => {
		if (window.innerWidth < 1280) {
			closeCart();
		}
	};

	return (
		<div className="flex items-center gap-4 justify-between border-b pb-2">
			<Link
				to={`/articles/${item.type}/${item.name}`}
				onClick={() => handleClick()}
			>
				<div className="flex items-center gap-4 pb-2">
					<img
						src={item.image || "/icons/default.svg"}
						alt={item.name}
						className="w-20 h-20 object-contain"
					/>
					<div className="flex flex-col flex-1">
						<p className="text-sm font-semibold">{item.brand.name}</p>
						<p className="text-sm">{item.name}</p>
						<p className="text-sm text-gray-600">
							{" "}
							{Number(item.price).toFixed(2)} €
						</p>
						{typeof item.size === "string" && item.size.length > 0 && (
							<p>Taille : {item.size}</p>
						)}
					</div>
				</div>
			</Link>

			{/* Quantité */}
			<div className="flex flex-col items-center">
				<div className="inline-flex items-center border rounded-lg overflow-hidden">
					<button
						type="button"
						onClick={() => {
							addToast(
								`Vous venez de retirer 1 exemplaire de ${item.name}, votre panier en contient maintenant ${item.quantity - 1}`,
								"bg-green-500",
							);
							updateQuantity(item.id, item.quantity - 1, item.size);
						}}
						className="px-3 py-1 text-md font-bold hover:bg-gray-200 cursor-pointer"
					>
						-
					</button>
					<span className="w-10 text-center py-1 text-md font-semibold">
						{item.quantity}
					</span>
					<button
						type="button"
						onClick={() => {
							addToast(
								`Vous venez d'ajouter 1 exemplaire de ${item.name}, votre panier en contient maintenant ${item.quantity + 1}`,
								"bg-green-500",
							);
							updateQuantity(item.id, item.quantity + 1, item.size);
						}}
						className="px-3 py-1 text-md font-bold hover:bg-gray-200 cursor-pointer"
					>
						+
					</button>
				</div>
				<button
					type="button"
					onClick={() => {
						addToast(
							`Vous venez de supprimer l'article ${item.name} de votre panier`,
							"bg-green-500",
						);
						removeFromCart(item.id, item.size);
					}}
					className="text-xs mt-1 text-red-500 hover:underline cursor-pointer"
				>
					Supprimer
				</button>
			</div>
		</div>
	);
}
