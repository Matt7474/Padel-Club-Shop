import { useState } from "react";
import Input from "../components/form/Input";

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

	const [streetNumber, setStreetNumber] = useState("");
	const [streetName, setStreetName] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [additionalInfo, setAdditionalInfo] = useState("");

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
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-160 xl:pt-10">
				<div className="xl:w-2/3 xl:mx-auto xl:bg-white/80 xl:p-5 ">
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

							<div className="xl:w-1/2">
								<h3 className="mt-6 font-semibold text-sm">
									Informations de livraison
								</h3>
								{/* Partie Numéro de rue et type de voie*/}
								<div className="flex -mt-2 gap-x-4">
									{/* Partie Numéro de rue */}
									<Input
										htmlFor={"streetNumber"}
										label={"N°"}
										type={"text"}
										value={streetNumber}
										onChange={setStreetNumber}
										width="w-1/5"
									/>

									{/* Partie nom de rue */}
									<Input
										htmlFor={"streetName"}
										label={"Nom de la voie"}
										type={"text"}
										value={streetName}
										onChange={setStreetName}
										width="w-full"
									/>
								</div>

								{/* Partie code postal */}
								<Input
									htmlFor={"zipcode"}
									label={"Code postal"}
									type={"text"}
									value={zipcode}
									onChange={setZipcode}
									width="w-full"
								/>

								{/* Partie ville */}
								<Input
									htmlFor={"city"}
									label={"Ville"}
									type={"text"}
									value={city}
									onChange={setCity}
									width="w-full"
								/>

								{/* Partie pays */}
								<Input
									htmlFor={"country"}
									label={"Pays"}
									type={"text"}
									value={country}
									onChange={setCountry}
									width="w-full"
								/>

								{/* Partie informations complémentaires */}
								<div className="relative flex flex-col mt-4">
									<div className="relative w-full">
										<label
											htmlFor="additionalInfo"
											className="absolute text-xs text-gray-500 pl-1"
										>
											Informations complémentaires
										</label>

										<span className="absolute text-xs text-gray-500 right-1">
											{additionalInfo.length} / 200
										</span>

										<textarea
											id="additionalInfo"
											value={additionalInfo}
											onChange={(e) => setAdditionalInfo(e.target.value)}
											className="bg-white border h-24 p-2 pt-6 resize-none w-full"
											placeholder="Exemple : étage, code d'accès, particularités..."
											maxLength={200}
										/>
									</div>
								</div>
							</div>
						</div>
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
