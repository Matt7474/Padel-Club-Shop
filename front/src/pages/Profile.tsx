import { useState } from "react";
import Toogle from "../components/Form/Toogle/Toogle";
import Input from "../components/Form/Tools/Input";
import Adress from "../components/Form/User/Adress";

export default function Profile() {
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isNotSameRegisterPassword, setIsNotSameRegisterPassword] =
		useState(false);
	const [phone, setPhone] = useState("");

	const formatPhone = (value: string) => {
		// Supprime tout sauf chiffres
		let digits = value.replace(/\D/g, "");
		// Ne garder que les 10 premiers chiffres
		digits = digits.substring(0, 10);
		// Ajoute les points tous les 2 chiffres
		return digits.replace(/(\d{2})(?=\d)/g, "$1.");
	};

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

	const handleChange = () => {
		console.log("modification activé");
	};

	const handleCancelChange = () => {
		console.log("cancelChange");
	};

	const handleChangeSubmit = () => {
		if (password !== confirmPassword) {
			setIsNotSameRegisterPassword(true);
			console.log("mot de passe non identique");
		} else {
			setIsNotSameRegisterPassword(false);
			console.log("mot de passe identique, on continu");
		}
	};

	const handleDeleteProfile = () => {
		console.log("deleteProfile");
	};

	return (
		<>
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:pt-10 xl:relative">
				<div className="xl:w-2/3 xl:mx-auto xl:bg-white/80 xl:p-5 xl:h-[40rem] xl:overflow-y-auto xl:relative xl:z-10">
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Mon profil
						<button
							type="button"
							onClick={handleChange}
							aria-label="Modifier le profil"
						>
							<img
								src="/icons/pen.svg"
								alt=""
								className="w-7 cursor-pointer hover:brightness-80"
							/>
						</button>
					</h2>
					<form action={handleChangeSubmit}>
						<div className="xl:flex xl:justify-between xl:w-full xl:gap-8">
							<div className="xl:w-1/2">
								<h3 className="mt-6 font-semibold text-sm">
									Informations personnelle
								</h3>
								<div className="-mt-2 gap-x-4">
									{/* Partie nom */}
									<Input
										htmlFor={"lastName"}
										label={"Nom"}
										type={"text"}
										value={lastName}
										onChange={setLastName}
									/>

									{/* Partie prénom */}
									<Input
										htmlFor={"firstName"}
										label={"Prénom"}
										type={"text"}
										value={firstName}
										onChange={setFirstName}
									/>

									{/* Partie email */}
									<Input
										htmlFor={"email"}
										label={"Email"}
										type={"email"}
										value={email}
										onChange={setEmail}
									/>

									{/* Partie mot de passe */}
									<Input
										htmlFor={"password"}
										label={"Mot de passe"}
										type={"password"}
										value={password}
										onChange={setPassword}
										pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
									/>

									{/* Partie confirmation du mot de passe */}
									<Input
										htmlFor={"confirmPassword"}
										label={"Confirmation du mot de passe"}
										type={"password"}
										value={confirmPassword}
										onChange={setConfirmPassword}
										pattern={"^(?=.*[A-Z])(?=.*\\d).{8,}$"}
									/>
									{isNotSameRegisterPassword && (
										<span className="text-red-600 text-sm mt-4">
											Les mots de passe ne sont pas identique.
										</span>
									)}

									{/* Partie téléphone */}
									<Input
										htmlFor={"phone"}
										label={"N° téléphone"}
										type={"text"}
										value={phone}
										onChange={(value) => setPhone(formatPhone(value))}
										pattern={"^\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}\\.\\d{2}$"}
									/>
								</div>
							</div>

							<div className="border-b xl:border-r border-gray-400 mt-7 "></div>

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

						<div className="flex justify-between mt-4 gap-4 xl:w-1/2 xl:mt-10 xl:mx-auto pl-1">
							<button
								type="button"
								className="w-4/10 p-2 bg-red-400 font-semibold rounded-md cursor-pointer hover:brightness-80"
								onClick={handleCancelChange}
							>
								Annuler
							</button>
							<button
								type="submit"
								className="w-4/10 p-2 bg-green-500 font-semibold rounded-md cursor-pointer hover:brightness-80"
							>
								Sauvegarder
							</button>
							<button
								type="button"
								className="w-1/10"
								onClick={handleDeleteProfile}
							>
								<img
									src="/icons/trash.svg"
									alt="poubelle"
									className="w-8 cursor-pointer hover:brightness-80"
								/>
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
