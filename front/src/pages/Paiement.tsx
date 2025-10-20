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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createOrderAndUpdateStock } from "../api/Order";
import { createPaymentIntent } from "../api/payment";
import { verifyStockBeforePayment } from "../api/Stock";
import ToggleSimple from "../components/Form/Toogle/ToogleSimple";
import Adress from "../components/Form/User/Adress";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/ToastStore ";
import { useAuthStore } from "../store/useAuthStore";
import { useStockCheck } from "../utils/useStockCheck";
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
function CheckoutForm({
	setConfirmMessage,
}: {
	setConfirmMessage: (value: boolean) => void;
}) {
	const { cart, clearCart } = useCartStore();
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const addToast = useToastStore((state) => state.addToast);
	const { updateQuantity } = useCartStore();
	const [reference, setReference] = useState("");

	interface StockUpdate {
		id: number;
		name: string;
		newQuantity: number;
		size: string;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);
		setMessage(null);

		try {
			// 1️⃣ Vérifier le stock
			const stockStatus = await verifyStockBeforePayment(cart);

			if (
				stockStatus.status === "error" &&
				Array.isArray(stockStatus.updates)
			) {
				const updates: StockUpdate[] = stockStatus.updates;
				updates.forEach((update) => {
					updateQuantity(update.id.toString(), update.newQuantity, update.size);

					addToast(
						`La quantité de "${update.name}" a été ajustée (${update.newQuantity} en stock disponible)`,
						"bg-red-500",
					);
				});
				setMessage(
					"Certaines quantités ont été ajustées, veuillez vérifier votre panier.",
				);
				setLoading(false);
				return;
			}

			// 2️⃣ PaymentIntent Stripe
			const { clientSecret } = await createPaymentIntent(cart);
			const cardNumberElement = elements.getElement(CardNumberElement);
			if (!cardNumberElement) throw new Error("Élément de carte non trouvé");

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: { card: cardNumberElement },
			});

			if (result.error) {
				setMessage(result.error.message || "Erreur lors du paiement.");
				setLoading(false);
				return;
			}

			if (result.paymentIntent?.status === "succeeded") {
				// 3️⃣ Créer la commande côté backend
				const orderRes = await createOrderAndUpdateStock(cart);
				const orderReference = orderRes.order.reference;
				console.log("orderReference", orderReference);
				setReference(`${orderReference}`);

				setMessage(`Paiement réussi 🎉 - Réf commande : ${orderReference}`);
				setSuccess(true);
				setConfirmMessage(true);
				clearCart();
			}
		} catch (err: unknown) {
			let errorMessage = "Erreur serveur lors du paiement.";
			if (err instanceof Error) errorMessage = err.message;
			setMessage(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20">
				<div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm max-w-md">
					<h3 className="text-xl font-semibold text-green-800 mb-3">
						Paiement confirmé ✅
					</h3>
					<p className="text-green-700">
						Votre numéro de commande est le : {reference}
					</p>
					<p className="text-green-700">
						Votre commande est en cours de traitement.
					</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl  xl:mx-0">
			<div className="bg-white rounded-lg ">
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
	const [confirmMessage, setConfirmMessage] = useState(false);
	const navigate = useNavigate();
	const [isBillingAddress, setIsBillingAddress] = useState(false);
	const { checkStock } = useStockCheck();

	// Vérifie si une adresse de facturation complète existe
	const hasBillingAddress =
		user?.addresses?.[1]?.street_number &&
		user?.addresses?.[1]?.street_name &&
		user?.addresses?.[1]?.zip_code &&
		user?.addresses?.[1]?.city &&
		user?.addresses?.[1]?.country;

	if (!user) return <Navigate to="/login" replace />;
	if (!user.addresses || user.addresses.length === 0)
		return <Profile text="Veuillez saisir votre adresse de livraison" />;

	// Sélectionne les données selon le toggle
	const activeAddress = isBillingAddress
		? user.addresses[1]
		: user.addresses[0];

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
						{confirmMessage === false && (
							<div>
								<h2 className="text-xl font-semibold mb-4">
									Récapitulatif de la commande
								</h2>

								{/* Liste d'articles scrollable */}
								<div className="flex-1 h-70 border overflow-y-auto">
									<div className="space-y-3">
										{cart.length > 0 ? (
											cart.map((item) => (
												<div
													key={item.id}
													className="p-2 border rounded shadow-sm"
												>
													<div className="flex flex-col">
														<div>
															{/* Nom du produit */}
															<div className="flex-1">
																<p className="text-xs font-semibold">
																	{item.name}
																</p>
															</div>
														</div>
														<div className="flex mt-2 justify-between">
															{/* Image du produit */}
															<div className="mt-2">
																<Link
																	to={`/articles/${item.type}/${item.name}`}
																>
																	<img
																		src={item.image}
																		alt={item.name}
																		className="w-8"
																	/>
																</Link>
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
																		onClick={async () => {
																			const isInStock = await checkStock({
																				articleId: Number(item.id),
																				quantity: item.quantity + 1,
																				selectedSize: item.size ?? undefined,
																			});

																			if (!isInStock) return;

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
																<p className="text-xs font-bold mb-1">
																	Sous total
																</p>
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

								<div className="mt-4 justify-end">
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
						)}
						{confirmMessage === true && (
							<div className="max-w-2xl mx-auto text-center ">
								{/* Icône de succès */}
								<div className="mb-3">
									<div className="flex justify-center">
										<img
											src="/icons/check-green.svg"
											alt="check"
											className="w-16"
										/>
									</div>
								</div>

								{/* Titre */}
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									Commande confirmée ! 🎉
								</h2>

								{/* Sous-titre */}
								<p className="text-lg text-gray-600 mb-4">
									Merci pour votre confiance
								</p>

								{/* Informations */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
									<div className="flex items-start gap-3 text-left">
										<img
											src="/icons/letter.svg"
											alt="letter"
											className="w-6 mt-0.5"
										/>
										<div>
											<p className="font-semibold text-blue-900 mb-1">
												Email de confirmation envoyé
											</p>
											<p className="text-sm text-blue-800">
												Vous allez recevoir un récapitulatif complet de votre
												commande à l'adresse
												<span className="font-medium"> {user?.email}</span>
											</p>
										</div>
									</div>
								</div>

								{/* Prochaines étapes */}
								<div className="space-y-4 mb-6">
									<div className="flex items-start gap-3 text-left">
										<div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-gray-700">
											1
										</div>
										<div>
											<p className="font-medium text-gray-900">Préparation</p>
											<p className="text-sm text-gray-600">
												Votre commande est en cours de traitement
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 text-left">
										<div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-gray-700">
											2
										</div>
										<div>
											<p className="font-medium text-gray-900">Expédition</p>
											<p className="text-sm text-gray-600">
												Vous recevrez un numéro de suivi par email
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 text-left">
										<div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-gray-700">
											3
										</div>
										<div>
											<p className="font-medium text-gray-900">Livraison</p>
											<p className="text-sm text-gray-600">
												Réception sous 3 à 5 jours ouvrés
											</p>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<button
										type="button"
										onClick={() => navigate("/profile/my-orders")}
										className="px-6 xl:px-2 py-3 xl:py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
									>
										Suivre ma commande
									</button>
									<button
										type="button"
										onClick={() => navigate("/")}
										className="px-6 xl:px-2 py-3 xl:py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
									>
										Retour à l'accueil
									</button>
								</div>

								{/* Support */}
								<p className="text-sm text-gray-500 mt-5">
									Une question ? Contactez notre{" "}
									<a href="/contact" className="text-blue-600 hover:underline">
										service client
									</a>
								</p>
							</div>
						)}
					</div>

					{/* Adresse */}
					<div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col h-full">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold">
								{isBillingAddress
									? "Adresse de facturation"
									: "Adresse de livraison"}
							</h2>

							{/* ✅ Affiche le toggle seulement si l'adresse de facturation existe */}
							{hasBillingAddress && (
								<div className="flex items-center gap-2">
									<ToggleSimple
										checked={isBillingAddress}
										onChange={setIsBillingAddress}
									/>
								</div>
							)}
						</div>

						<div className="flex-1 overflow-y-auto">
							<Adress
								title={
									isBillingAddress
										? "Adresse de facturation"
										: "Adresse de livraison"
								}
								streetNumber={activeAddress.street_number}
								setStreetNumber={() => {}}
								streetName={activeAddress.street_name}
								setStreetName={() => {}}
								zipcode={activeAddress.zip_code}
								setZipcode={() => {}}
								city={activeAddress.city}
								setCity={() => {}}
								country={activeAddress.country}
								setCountry={() => {}}
								additionalInfo={activeAddress.complement || ""}
								setAdditionalInfo={() => {}}
								disabled={true}
							/>
						</div>
					</div>
					{/* Paiement */}
					<div className="bg-white rounded-lg shadow-sm border p-6  flex flex-col h-full">
						<Elements stripe={stripePromise}>
							<CheckoutForm setConfirmMessage={setConfirmMessage} />
						</Elements>
					</div>
				</div>
			</div>
		</div>
	);
}
