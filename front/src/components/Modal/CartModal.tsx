import { useCartStore } from "../../store/cartStore";
import CartLine from "../CartLine/CartLine";

export default function CartModal({ closeCart }: { closeCart: () => void }) {
	const { cart, clearCart } = useCartStore();

	const totalArticles = cart.reduce((acc, item) => acc + item.quantity, 0);
	// Calcul du total
	const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

	return (
		<div className="fixed top-0 left-1/2 -translate-x-1/2 xl:right-0 xl:left-auto xl:translate-x-0 z-50 w-[95%] max-w-md h-full bg-white border-l border-gray-300 shadow-lg flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4">
				<h1 className="text-2xl font-semibold">VOTRE PANIER</h1>
				<button
					type="button"
					onClick={closeCart}
					className="text-red-600 hover:brightness-90"
					aria-label="Fermer le panier"
				>
					<img src="/icons/cross-red.svg" alt="Fermer" className="w-8 h-8" />
				</button>
			</div>

			{/* Liste d'articles */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 mt-10 border-t">
				{cart.length > 0 ? (
					cart.map((item) => (
						<CartLine key={item.id} item={item} closeCart={closeCart} />
					))
				) : (
					<p className="text-center text-gray-500">Votre panier est vide.</p>
				)}
			</div>

			{/* Footer */}
			<div className="border-t p-4">
				<div>
					Votre panier contient {totalArticles} article
					{totalArticles > 1 ? "s" : ""}
				</div>
				<div className="flex justify-between my-2">
					<p className="font-semibold text-2xl">TOTAL</p>
					<p className="font-semibold text-2xl">{total.toFixed(2)} €</p>
				</div>
				<button
					type="button"
					className="w-full bg-green-600 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer hover:brightness-80"
				>
					PAYER
				</button>
				<button
					type="button"
					onClick={clearCart}
					className="w-full mt-2 text-sm text-red-600 hover:underline"
				>
					Vider le panier
				</button>
			</div>
		</div>
	);
}
