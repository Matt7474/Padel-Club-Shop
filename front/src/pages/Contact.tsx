import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { sendContactForm } from "../api/Contact";
import { useAuthStore } from "../store/useAuthStore";

interface FormData {
	user_id?: number | null;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	orderNumber: string;
}

interface FormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
	orderNumber?: string | null;
}

export default function ContactPage() {
	const user = useAuthStore((state) => state.user);
	console.log("user", user);

	const [formData, setFormData] = useState<FormData>({
		user_id: user ? user.id : null,
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
		phone: user?.phone || "",
		subject: "",
		message: "",
		orderNumber: "",
	});

	console.log(formData.phone);

	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	): void => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = async (): Promise<void> => {
		try {
			await sendContactForm(formData);
			setIsSubmitted(true);

			// Reset du formulaire après 3 secondes
			setTimeout(() => {
				setIsSubmitted(false);
			}, 3000);
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	return (
		<div className="">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 xl:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Contactez-nous
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Une question ? Une suggestion ? N'hésitez pas à nous contacter,
						notre équipe vous répondra dans les plus brefs délais.
					</p>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					<div className="xl:col-span-1 space-y-6">
						<div className="bg-white rounded-2xl shadow-lg p-6 h-30 hover:shadow-xl transition-shadow">
							<div className="flex items-start space-x-4">
								<div className="bg-amber-100 rounded-full p-3">
									<Mail className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">Email</h3>
									<p className="text-gray-600 text-sm">
										dimier.matt.dev@gmail.com
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-6 h-30 hover:shadow-xl transition-shadow">
							<div className="flex items-start space-x-4">
								<div className="bg-amber-100 rounded-full p-3">
									<Phone className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">
										Téléphone
									</h3>
									<p className="text-gray-600 text-sm">06 31 54 89 49</p>
									<p className="text-gray-500 text-xs mt-1">Lun-Ven: 9h-18h</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-6 h-30 hover:shadow-xl transition-shadow">
							<div className="flex items-start space-x-4">
								<div className="bg-amber-100 rounded-full p-3">
									<MapPin className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
									<p className="text-gray-600 text-sm">123 Avenue du Padel</p>
									<p className="text-gray-600 text-sm">
										34370 Cazouls-les-Béziers, France
									</p>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
							<h3 className="font-semibold mb-2">Horaires d'ouverture</h3>
							<div className="space-y-1 text-sm">
								<div className="flex justify-between">
									<span>Lundi - Vendredi</span>
									<span className="font-medium">9h - 18h</span>
								</div>
								<div className="flex justify-between">
									<span>Samedi</span>
									<span className="font-medium">Fermé</span>
								</div>
								<div className="flex justify-between">
									<span>Dimanche</span>
									<span className="font-medium">Fermé</span>
								</div>
							</div>
						</div>
					</div>

					<div className="xl:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-4 xl:p-8">
							{isSubmitted ? (
								<div className="text-center py-12">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
										<CheckCircle className="w-8 h-8 text-green-600" />
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-2">
										Message envoyé !
									</h3>
									<p className="text-gray-600">
										Nous vous répondrons dans les plus brefs délais.
									</p>
								</div>
							) : (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="firstName"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Prénom <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="firstName"
												name="firstName"
												value={formData.firstName}
												onChange={handleChange}
												className={`w-full px-4 py-3 rounded-lg border ${
													errors.firstName
														? "border-red-500"
														: "border-gray-300"
												} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
												placeholder="Jean"
											/>
											{errors.firstName && (
												<p className="text-red-500 text-xs mt-1">
													{errors.firstName}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="lastName"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Nom <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="lastName"
												name="lastName"
												value={formData.lastName}
												onChange={handleChange}
												className={`w-full px-4 py-3 rounded-lg border ${
													errors.lastName ? "border-red-500" : "border-gray-300"
												} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
												placeholder="Dupont"
											/>
											{errors.lastName && (
												<p className="text-red-500 text-xs mt-1">
													{errors.lastName}
												</p>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Email <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className={`w-full px-4 py-3 rounded-lg border ${
													errors.email ? "border-red-500" : "border-gray-300"
												} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
												placeholder="jean.dupont@email.com"
											/>
											{errors.email && (
												<p className="text-red-500 text-xs mt-1">
													{errors.email}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Téléphone (optionnel)
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												maxLength={20}
												value={formData.phone}
												onChange={handleChange}
												className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
												placeholder="06 12 34 56 78"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Sujet <span className="text-red-500">*</span>
										</label>
										<select
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={handleChange}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.subject ? "border-red-500" : "border-gray-300"
											} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
										>
											<option value="">Sélectionnez un sujet</option>
											<option value="general">Question générale</option>
											<option value="order">Suivi de commande</option>
											<option value="product">Information produit</option>
											<option value="complaint">Réclamation</option>
											<option value="partnership">Partenariat</option>
											<option value="other">Autre</option>
										</select>
										{errors.subject && (
											<p className="text-red-500 text-xs mt-1">
												{errors.subject}
											</p>
										)}
									</div>

									{formData.subject === "order" && (
										<div>
											<label
												htmlFor="orderNumber"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Numéro de commande
											</label>
											<input
												type="text"
												id="orderNumber"
												name="orderNumber"
												maxLength={17}
												value={formData.orderNumber}
												required
												onChange={handleChange}
												className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
												placeholder="CMD-20251021-007"
											/>
										</div>
									)}

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Message <span className="text-red-500">*</span>
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											rows={6}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.message ? "border-red-500" : "border-gray-300"
											} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none`}
											placeholder="Décrivez votre demande..."
										/>
										{errors.message && (
											<p className="text-red-500 text-xs mt-1">
												{errors.message}
											</p>
										)}
									</div>

									<div>
										<button
											type="button"
											onClick={handleSubmit}
											className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer"
										>
											<Send className="w-5 h-5" />
											<span>Envoyer le message</span>
										</button>
									</div>

									<p className="text-xs text-gray-500 text-center">
										<span className="text-red-500">*</span> Champs obligatoires
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
