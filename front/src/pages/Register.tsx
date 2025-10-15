import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/User";
import Toogle from "../components/Form/Toogle/Toogle";
import Input from "../components/Form/Tools/Input";
import Adress from "../components/Form/User/Adress";

export default function Register() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");

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
	const [passwordConfirm, setPasswordConfirm] = useState("");
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
			// alert("Compte créé avec succès !");

			setErrorMessage("");
			navigate("/login");
		} catch (error: any) {
			console.error("❌ Erreur front :", error.message);
			setErrorMessage(error.message);
		}
	};

	return (
		<>
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col xl:flex-row xl:p-6 gap-10 xl:gap-40 items-center xl:items-start xl:justify-center">
				{/* Partie register */}
				<div className="p-3 w-full bg-white/60 xl:w-2/7">
					<form onSubmit={registerSubmit} autoComplete="off">
						<h2 className="p-3  bg-gray-500/80 font-semibold text-lg">
							Création de compte
						</h2>
						<div className="flex flex-col">
							<div>
								{/* Partie Nom */}
								<Input
									htmlFor="lastName"
									label="Nom"
									type="text"
									value={lastName}
									onChange={setLastName}
								/>
								{/* Partie Prenom */}
								<Input
									htmlFor="firstName"
									label="Prénom"
									type="text"
									value={firstName}
									onChange={setFirstName}
								/>
								{/* Partie téléphone */}
								<Input
									htmlFor={"phone"}
									label={"N° téléphone"}
									type={"text"}
									value={phone}
									onChange={(value) => setPhone(formatPhone(value))}
									pattern={"^\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}$"}
								/>
								{/* Partie email */}
								<Input
									htmlFor="registerEmail"
									label="Email"
									type="email"
									value={registerEmail}
									onChange={setRegisterEmail}
								/>

								{/* Partie Mot de passe */}
								<Input
									htmlFor="registerPassword"
									label="Mot de passe"
									type="password"
									value={registerPassword}
									onChange={setRegisterPassword}
									// pattern={"^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"}
									pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
								/>
								{/* Indicateurs */}
								<div className="mt-2 text-xs transition-all duration-300">
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
									<span
										className={hasNumber ? "text-green-600" : "text-red-600"}
									>
										{hasNumber ? "✔" : "✘"} Un chiffre
									</span>
								</div>

								{/* Partie Confirmation de mot de passe */}
								<div className="relative flex flex-col mt-4 ">
									<Input
										htmlFor="passwordConfirm"
										label="Confirmation du mot de passe"
										type="password"
										value={passwordConfirm}
										onChange={setPasswordConfirm}
										pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
									/>
									{isNotSameRegisterPassword && (
										<span className="text-red-600 text-sm absolute mt-14">
											Les mots de passe ne sont pas identique.
										</span>
									)}
								</div>
							</div>
							<div className="border-b xl:border-r border-gray-400 mt-7 "></div>
							<div>
								<div>
									<Adress
										title={"Adresse de livraison"}
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
								</div>
								<div className="border-b xl:border-r border-gray-400 my-4 "></div>
								<div>
									<Toogle
										title="Adresse de facturation differente ?"
										checked={isBillingDifferent}
										onChange={setIsBillingDifferent}
									/>
								</div>
								{isBillingDifferent === true && (
									<div>
										<Adress
											title={"Adresse de facturation"}
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

						<button
							type="submit"
							className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
						>
							CREER UN COMPTE
						</button>
						<span className="mr-1">Vous avez deja un compte ?</span>
						<Link to={"/login"} className="underline cursor-pointer">
							Clickez ici
						</Link>
						{/* Pa$$w0rd! */}
						{errorMessage && (
							<span className="text-xs text-red-500">{errorMessage}</span>
						)}
					</form>
				</div>
			</div>
		</>
	);
}
