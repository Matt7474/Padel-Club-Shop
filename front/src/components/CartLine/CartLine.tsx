import type { CartItem } from "../../store/cartStore";
import { useCartStore } from "../../store/cartStore";

export default function CartLine({ item }: { item: CartItem }) {
	const { updateQuantity, removeFromCart } = useCartStore();

	return (
		<div className="flex items-center gap-4 border-b pb-2">
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
			</div>

			{/* Quantité */}
			<div className="flex flex-col items-center">
				<div className="inline-flex items-center border rounded-lg overflow-hidden">
					<button
						type="button"
						onClick={() => updateQuantity(item.id, item.quantity - 1)}
						className="px-3 py-1 text-md font-bold hover:bg-gray-200"
					>
						-
					</button>
					<span className="w-10 text-center py-1 text-md font-semibold">
						{item.quantity}
					</span>
					<button
						type="button"
						onClick={() => updateQuantity(item.id, item.quantity + 1)}
						className="px-3 py-1 text-md font-bold hover:bg-gray-200"
					>
						+
					</button>
				</div>
				<button
					type="button"
					onClick={() => removeFromCart(item.id)}
					className="text-xs mt-1 text-red-500 hover:underline"
				>
					Supprimer
				</button>
			</div>
		</div>
	);
}
