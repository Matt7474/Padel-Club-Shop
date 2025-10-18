import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
	Elements,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { createPaymentIntent } from "../api/payment";
import Adress from "../components/Form/User/Adress";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/ToastStore ";
import { useAuthStore } from "../store/useAuthStore";
import Profile from "./Profile";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Style personnalisé pour les éléments Stripe
const ELEMENT_OPTIONS = {
	style: {
		base: {
			fontSize: "16px",
			color: "#424770",
			letterSpacing: "0.025em",
			fontFamily: "system-ui, sans-serif",
			"::placeholder": {
				color: "#aab7c4",
			},
		},
		invalid: {
			color: "#9e2146",
		},
	},
};

// ---- Sous composant pour le paiement ----
function CheckoutForm() {
	const { cart, clearCart } = useCartStore();
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);
		setMessage(null);

		try {
			// 1️⃣ Crée le PaymentIntent côté serveur
			const { clientSecret } = await createPaymentIntent(cart);

			// 2️⃣ Confirme le paiement avec Stripe
			const cardNumberElement = elements.getElement(CardNumberElement);

			if (!cardNumberElement) {
				setMessage("Erreur : élément de carte non trouvé");
				setLoading(false);
				return;
			}

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardNumberElement,
				},
			});

			if (result.error) {
				setMessage(result.error.message || "Erreur lors du paiement.");
			} else if (result.paymentIntent?.status === "succeeded") {
				setMessage("Paiement réussi 🎉");
				clearCart();
			}
		} catch (err: unknown) {
			let errorMessage = "Erreur serveur lors du paiement.";

			if (err instanceof Error) {
				console.error("Erreur détaillée :", err);
				errorMessage = err.message;
			} else {
				console.error("Erreur inconnue :", err);
			}

			setMessage(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto xl:mx-0">
			<div className="bg-white p-6 rounded-lg shadow-sm border xl:p-0 xl:border-none xl:shadow-none">
				<h3 className="text-lg font-semibold mb-6">Informations de paiement</h3>
				<div className="xl:mt-14">
					<div className="flex items-center -mt-4 mb-3 gap-3 ">
						<img src="/icons/cb.svg" alt="cb" className="w-10" />
						<img src="/icons/visa.svg" alt="visa" className="w-10" />
						<img src="/icons/mastercard.svg" alt="masercard" className="w-10" />
						<img src="/icons/amex.svg" alt="amex" className="w-10" />
					</div>
				</div>

				{/* Numéro de carte */}
				<div className="mb-4">
					<label
						htmlFor="card-number"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Numéro de carte
					</label>
					<div
						id="card-number"
						className="p-3 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
					>
						<CardNumberElement options={ELEMENT_OPTIONS} />
					</div>
				</div>

				{/* Date d'expiration et CVC côte à côte */}
				<div className="grid grid-cols-2 gap-4 mb-6">
					{/* Date d'expiration */}
					<div>
						<label
							htmlFor="card-expiry"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Date d'expiration
						</label>
						<div
							id="card-expiry"
							className="p-3 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
						>
							<CardExpiryElement options={ELEMENT_OPTIONS} />
						</div>
					</div>

					{/* CVC */}
					<div>
						<label
							htmlFor="card-cvc"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							CVC
						</label>
						<div
							id="card-cvc"
							className="p-3 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
						>
							<CardCvcElement options={ELEMENT_OPTIONS} />
						</div>
					</div>
				</div>

				<button
					type="submit"
					disabled={!stripe || loading}
					className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
				>
					{loading ? "Traitement en cours..." : `Payer maintenant`}
				</button>

				{message && (
					<div
						className={`mt-4 p-3 rounded-lg text-center ${
							message.includes("réussi")
								? "bg-green-50 text-green-800 border border-green-200"
								: "bg-red-50 text-red-800 border border-red-200"
						}`}
					>
						{message}
					</div>
				)}

				<div className="mt-4 text-center text-sm text-gray-500">
					<p>🔒 Paiement sécurisé par Stripe</p>
				</div>
			</div>
		</form>
	);
}

// ---- Page principale ----
export default function Paiement() {
	const { user } = useAuthStore();
	const { cart } = useCartStore();
	const { updateQuantity } = useCartStore();
	const addToast = useToastStore((state) => state.addToast);

	if (!user) return <Navigate to="/login" replace />;

	if (!user.addresses?.length)
		return <Profile text={"Veuillez saisir votre adresse de livraison"} />;

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const totalArticles = cart.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Finaliser votre commande
				</h1>

				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
					<p className="text-yellow-800">
						<strong>⚠️ Mode démonstration :</strong> Cette application est en
						mode démonstration, aucun paiement réel ne sera effectué. Pour
						simuler un paiement, utilisez les informations suivantes :
					</p>
					<ul className="text-yellow-800 mt-2 ml-4 space-y-1">
						<li>
							• <strong>Numéro de carte :</strong> 4242 4242 4242 4242
						</li>
						<li>
							• <strong>Date d'expiration :</strong> n'importe quelle date
							future (ex: 12/25)
						</li>
						<li>
							• <strong>CVC :</strong> 3 chiffres au choix (ex: 123)
						</li>
					</ul>
				</div>

				<div className="grid xl:grid-cols-3 gap-8 items-start">
					{/* 🧾 Récapitulatif */}
					<div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col h-full">
						<h2 className="text-xl font-semibold mb-4">
							Récapitulatif de la commande
						</h2>

						{/* Liste d'articles scrollable */}
						<div className="flex-1 max-h-70 border overflow-y-auto">
							<div className="space-y-3">
								{cart.length > 0 ? (
									cart.map((item) => (
										<div key={item.id} className="p-2 border rounded shadow-sm">
											<div className="flex flex-col">
												<div>
													{/* Nom du produit */}
													<div className="flex-1">
														<p className="text-xs font-semibold">{item.name}</p>
													</div>
												</div>
												<div className="flex mt-2 justify-between">
													{/* Image du produit */}
													<div className="mt-2">
														<img
															src={item.image}
															alt={item.name}
															className="w-8"
														/>
													</div>

													{/* Quantité */}
													<div>
														<p className="text-xs font-bold mb-1 text-center">
															Quantité
														</p>
														{/* <div className="px-4">
															<span className="text-xs">{item.quantity}x</span>
														</div> */}
														<div className="inline-flex items-center border rounded overflow-hidden">
															<button
																type="button"
																onClick={() => {
																	addToast(
																		`Vous venez de retirer 1 exemplaire de ${item.name}, votre panier en contient maintenant ${item.quantity - 1}`,
																		"bg-green-500",
																	);
																	updateQuantity(
																		item.id,
																		item.quantity - 1,
																		item.size,
																	);
																}}
																className="px-1  text-md  hover:bg-gray-200 cursor-pointer"
															>
																-
															</button>
															<span className="w-6 text-center  text-sm font-semibold">
																{item.quantity}
															</span>
															<button
																type="button"
																onClick={() => {
																	addToast(
																		`Vous venez d'ajouter 1 exemplaire de ${item.name}, votre panier en contient maintenant ${item.quantity + 1}`,
																		"bg-green-500",
																	);
																	updateQuantity(
																		item.id,
																		item.quantity + 1,
																		item.size,
																	);
																}}
																className="px-1  text-md  hover:bg-gray-200 cursor-pointer"
															>
																+
															</button>
														</div>
													</div>

													{/* Prix */}
													<div>
														<p className="text-xs font-bold mb-1">
															Prix unitaire
														</p>
														<span className="text-sm flex justify-center mt-2">
															{item.price.toFixed(2)} €
														</span>
													</div>

													{/* Prix */}
													<div>
														<p className="text-xs font-bold mb-1">Sous total</p>
														<span className="text-sm font-semibold flex justify-end mt-2">
															{(item.price * item.quantity).toFixed(2)} €
														</span>
													</div>
												</div>
											</div>
										</div>
									))
								) : (
									<p className="text-center text-gray-500 py-8">
										Votre panier est vide.
									</p>
								)}
							</div>
						</div>

						{/* Liste d'articles scrollable */}
						{/* <div className="flex-1 max-h-70 border overflow-y-auto">
							<div className="space-y-3">
								{cart.length > 0 ? (
									cart.map((item) => <CartLine key={item.id} item={item} />)
								) : (
									<p className="text-center text-gray-500 py-8">
										Votre panier est vide.
									</p>
								)}
							</div>
						</div> */}

						<div className="mt-4">
							<p>Votre panier contient {totalArticles} articles</p>
						</div>

						{cart.length > 0 && (
							<div className="pt-4">
								<div className="flex justify-between items-center">
									<span className="text-lg font-semibold">Total</span>
									<span className="text-2xl font-bold text-blue-600">
										{total.toFixed(2)} €
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Adresse */}
					<div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col h-full">
						<h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
						<div className="flex-1 overflow-y-auto">
							<Adress
								title="Adresse de livraison"
								streetNumber={user.addresses[0].street_number}
								setStreetNumber={() => {}}
								streetName={user.addresses[0].street_name}
								setStreetName={() => {}}
								zipcode={user.addresses[0].zip_code}
								setZipcode={() => {}}
								city={user.addresses[0].city}
								setCity={() => {}}
								country={user.addresses[0].country}
								setCountry={() => {}}
								additionalInfo={user.addresses[0].complement || ""}
								setAdditionalInfo={() => {}}
								disabled={true}
							/>
						</div>
					</div>

					{/* Paiement */}
					<div className="bg-white rounded-lg shadow-sm border p-6  flex flex-col h-full">
						<Elements stripe={stripePromise}>
							<CheckoutForm />
						</Elements>
					</div>
				</div>
			</div>
		</div>
	);
}
