import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useToastStore } from "../../store/ToastStore ";
import CartLine from "../CartLine/CartLine";
import ConfirmationModal from "../Modal/ConfirmModal";
import ProgressBar from "../ProgressBar/ProgressBar";

export default function CartModal({ closeCart }: { closeCart: () => void }) {
	const navigate = useNavigate();
	const addToast = useToastStore((state) => state.addToast);
	const { cart, clearCart } = useCartStore();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);

	const totalArticles = cart.reduce((acc, item) => acc + item.quantity, 0);
	const totalWithoutShipping = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const total =
		totalWithoutShipping > 69
			? totalWithoutShipping
			: totalWithoutShipping + 6.9;

	console.log("🧺 Cart content:", cart);

	const showConfirm = () => {
		if (cart.length > 0) {
			setOpenConfirmModal(true);
		} else {
			return;
		}
	};

	const handleConfirmClear = () => {
		if (cart.length > 0) {
			clearCart();
			addToast("Votre panier a bien été vidé", "bg-green-500");
			setOpenConfirmModal(false);
		} else {
			clearCart();
		}
	};

	const handleValidate = () => {
		navigate("paiement");
		closeCart();
	};

	return (
		<div className="fixed top-0 left-1/2 -translate-x-1/2 xl:right-0 xl:left-auto xl:translate-x-0 z-99 w-[95%] max-w-md h-full bg-white border-l border-gray-300 shadow-lg flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4">
				<h1 className="text-2xl font-semibold">VOTRE PANIER</h1>
				<button
					type="button"
					onClick={closeCart}
					className="text-red-600 hover:brightness-90 cursor-pointer"
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

			<div className="ml-4 mb-1">
				Votre panier contient {totalArticles} article
				{totalArticles > 1 ? "s" : ""}
			</div>
			{/* Footer */}
			<div className="border-t p-4">
				<ProgressBar progress={totalWithoutShipping} />
				<div className="flex justify-between my-2">
					<p className="font-semibold text-2xl">TOTAL</p>
					<p className="font-semibold text-2xl">{total.toFixed(2)} €</p>
				</div>
				<button
					type="button"
					onClick={handleValidate}
					className="w-full bg-green-500 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer hover:brightness-80"
				>
					PAYER
				</button>
				<button
					type="button"
					onClick={showConfirm}
					className="w-full mt-2 text-sm text-red-500 hover:underline cursor-pointer"
				>
					Vider le panier
				</button>
			</div>
			{/* Modale de confirmation */}
			{openConfirmModal && (
				<ConfirmationModal
					message="Êtes-vous sûr de vouloir vider votre panier ? Cette action est irréversible."
					onConfirm={handleConfirmClear}
					onCancel={() => setOpenConfirmModal(false)}
				/>
			)}
		</div>
	);
}
