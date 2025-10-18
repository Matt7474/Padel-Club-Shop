import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/User";
import Toogle from "../components/Form/Toogle/Toogle";
import Input from "../components/Form/Tools/Input";
import Adress from "../components/Form/User/Adress";
import { useToastStore } from "../store/ToastStore ";

export default function Register() {
	const navigate = useNavigate();
	const addToast = useToastStore((state) => state.addToast);
	const [errorMessage, setErrorMessage] = useState(false);

	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [phone, setPhone] = useState("");
	const formatPhone = (value: string) => {
		// Supprime tout sauf chiffres
		let digits = value.replace(/\D/g, "");
		// Ne garder que les 10 premiers chiffres
		digits = digits.substring(0, 10);
		// Ajoute les points tous les 2 chiffres
		return digits.replace(/(\d{2})(?=\d)/g, "$1.");
	};
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [showRegisteredPassword, setShowRegisteredPassword] = useState(false);
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [showRegisteredConfirmPassword, setShowRegisteredConfirmPassword] =
		useState(false);
	const [isNotSameRegisterPassword, setIsNotSameRegisterPassword] =
		useState(false);
	// Adresse de livraison (shippping)
	const [sStreetNumber, setSStreetNumber] = useState("");
	const [sStreetName, setSStreetName] = useState("");
	const [sZipcode, setSZipcode] = useState("");
	const [sCity, setSCity] = useState("");
	const [sCountry, setSCountry] = useState("");
	const [sAdditionalInfo, setSAdditionalInfo] = useState("");

	// Adresse de facturation (billing)
	const [bStreetNumber, setBStreetNumber] = useState("");
	const [bStreetName, setBStreetName] = useState("");
	const [bZipcode, setBZipcode] = useState("");
	const [bCity, setBCity] = useState("");
	const [bCountry, setBCountry] = useState("");
	const [bAdditionalInfo, setBAdditionalInfo] = useState("");

	// gestion des differentes adresses
	const [isBillingDifferent, setIsBillingDifferent] = useState(false);

	// Règles de validation
	const hasMinLength = registerPassword.length >= 8;
	const hasUppercase = /[A-Z]/.test(registerPassword);
	const hasNumber = /\d/.test(registerPassword);

	const registerSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (registerPassword !== passwordConfirm) {
			setIsNotSameRegisterPassword(true);
			console.log("mot de passe non identique");
			return;
		}

		setIsNotSameRegisterPassword(false);
		console.log("mot de passe identique, on continue");

		const newUser = {
			last_name: lastName,
			first_name: firstName,
			phone,
			email: registerEmail,
			password: registerPassword,
			shipping_address: {
				street_number: sStreetNumber,
				street_name: sStreetName,
				zipcode: sZipcode,
				city: sCity,
				country: sCountry,
				additional_info: sAdditionalInfo,
			},
			billing_address: isBillingDifferent
				? {
						street_number: bStreetNumber,
						street_name: bStreetName,
						zipcode: bZipcode,
						city: bCity,
						country: bCountry,
						additional_info: bAdditionalInfo,
					}
				: null,
		};

		console.log("Nouvel utilisateur :", newUser);

		try {
			const response = await createUser(newUser);
			console.log("✅ Utilisateur créé :", response);

			navigate("/login");
			addToast(
				`${newUser.first_name} votre compte à bien été créer`,
				"bg-green-600",
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(true);
				console.error("❌ Erreur front :", error.message);
			} else {
				console.error("❌ Erreur inconnue :", error);
			}
		}
	};

	return (
		<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col items-center xl:justify-center">
			{/* Partie register */}
			<div className="p-3 w-full bg-white/60 xl:w-5/7 xl:max-h-[80vh] xl:overflow-y-auto xl:my-4">
				<form onSubmit={registerSubmit} autoComplete="off">
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg">
						Création de compte
					</h2>

					<div className="flex flex-col xl:flex-row gap-4">
						{/* Colonne gauche : données personnelles */}
						<div className="xl:w-1/2 xl:mr-3 flex flex-col gap-0">
							<p className="mt-6 font-semibold text-sm -mb-2 pl-0.5">
								Données personnelles
							</p>
							<Input
								htmlFor="lastName"
								label="Nom"
								type="text"
								value={lastName}
								onChange={setLastName}
							/>
							<Input
								htmlFor="firstName"
								label="Prénom"
								type="text"
								value={firstName}
								onChange={setFirstName}
							/>
							<Input
								htmlFor="phone"
								label="N° téléphone"
								type="text"
								value={phone}
								onChange={(value) => setPhone(formatPhone(value))}
								pattern={"^\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}$"}
							/>
							<Input
								htmlFor="registerEmail"
								label="Email"
								type="email"
								value={registerEmail}
								onChange={setRegisterEmail}
							/>

							{/* Mot de passe */}
							<div className="relative">
								<Input
									htmlFor="registerPassword"
									label="Mot de passe"
									type={showRegisteredPassword ? "text" : "password"}
									value={registerPassword}
									onChange={setRegisterPassword}
									pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
								/>
								<button
									type="button"
									onClick={() =>
										setShowRegisteredPassword(!showRegisteredPassword)
									}
									className="absolute top-[40%] right-2 p-1 cursor-pointer"
								>
									<img
										src={
											showRegisteredPassword
												? "/icons/hide.svg"
												: "/icons/show.svg"
										}
										alt={
											showRegisteredPassword
												? "Cacher le mot de passe"
												: "Afficher le mot de passe"
										}
										className="w-5 h-5"
									/>
								</button>
							</div>

							{/* Indicateurs */}
							<div className="mt-2 text-xs">
								<span
									className={hasMinLength ? "text-green-600" : "text-red-600"}
								>
									{hasMinLength ? "✔" : "✘"} Au moins 8 caractères
								</span>
								<br />
								<span
									className={hasUppercase ? "text-green-600" : "text-red-600"}
								>
									{hasUppercase ? "✔" : "✘"} Une majuscule
								</span>
								<br />
								<span className={hasNumber ? "text-green-600" : "text-red-600"}>
									{hasNumber ? "✔" : "✘"} Un chiffre
								</span>
							</div>

							{/* Confirmation mot de passe */}
							<div className="relative">
								<Input
									htmlFor="passwordConfirm"
									label="Confirmation du mot de passe"
									type={showRegisteredConfirmPassword ? "text" : "password"}
									value={passwordConfirm}
									onChange={setPasswordConfirm}
									pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
								/>
								<button
									type="button"
									onClick={() =>
										setShowRegisteredConfirmPassword(
											!showRegisteredConfirmPassword,
										)
									}
									className="absolute top-[40%] right-2 p-1 cursor-pointer"
								>
									<img
										src={
											showRegisteredConfirmPassword
												? "/icons/hide.svg"
												: "/icons/show.svg"
										}
										alt={
											showRegisteredConfirmPassword
												? "Cacher le mot de passe"
												: "Afficher le mot de passe"
										}
										className="w-5 h-5"
									/>
								</button>

								{isNotSameRegisterPassword && (
									<span className="text-red-600 text-sm absolute mt-1 pl-0.5">
										Les mots de passe ne sont pas identiques.
									</span>
								)}
							</div>
						</div>

						<div className="border-b xl:border-r border-gray-400 mt-4"></div>

						{/* Colonne droite : adresses */}
						<div className="xl:w-1/2 xl:ml-3 flex flex-col -mt-4 xl:mt-0">
							<Adress
								title="Adresse de livraison"
								streetNumber={sStreetNumber}
								setStreetNumber={setSStreetNumber}
								streetName={sStreetName}
								setStreetName={setSStreetName}
								zipcode={sZipcode}
								setZipcode={setSZipcode}
								city={sCity}
								setCity={setSCity}
								country={sCountry}
								setCountry={setSCountry}
								additionalInfo={sAdditionalInfo}
								setAdditionalInfo={setSAdditionalInfo}
							/>
							<div className="border-b xl:border-r border-gray-400 mt-4"></div>
							<div className="mt-4">
								<Toogle
									title="Adresse de facturation differente ?"
									checked={isBillingDifferent}
									onChange={setIsBillingDifferent}
								/>
							</div>

							{isBillingDifferent && (
								<div className="">
									<Adress
										title="Adresse de facturation"
										streetNumber={bStreetNumber}
										setStreetNumber={setBStreetNumber}
										streetName={bStreetName}
										setStreetName={setBStreetName}
										zipcode={bZipcode}
										setZipcode={setBZipcode}
										city={bCity}
										setCity={setBCity}
										country={bCountry}
										setCountry={setBCountry}
										additionalInfo={bAdditionalInfo}
										setAdditionalInfo={setBAdditionalInfo}
									/>
								</div>
							)}
						</div>
					</div>

					{/* Boutons et liens */}
					<div className="xl:w-1/2 xl:mx-auto">
						{errorMessage && (
							<div className="text-sm text-red-500 mt-4 -mb-9 text-center">
								L'adresse email existe déja
							</div>
						)}
						<button
							type="submit"
							className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
						>
							CREER UN COMPTE
						</button>
						<span className="mr-1 text-sm">Vous avez déjà un compte ?</span>
						<Link to="/login" className="underline cursor-pointer text-sm">
							Ca se passe ici
						</Link>

						{/* Pa$$w0rd! */}
					</div>
				</form>
			</div>
		</div>
	);
}
