import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/form/Input";

export default function Connection() {
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [isNotSameRegisterPassword, setIsNotSameRegisterPassword] =
		useState(false);

	const [isChecked, setIsChecked] = useState(false);

	// Règles de validation
	const hasMinLength = registerPassword.length >= 8;
	const hasUppercase = /[A-Z]/.test(registerPassword);
	const hasNumber = /\d/.test(registerPassword);

	const handleCheckConditions = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
	};

	const registerSubmit = () => {
		if (registerPassword !== passwordConfirm) {
			setIsNotSameRegisterPassword(true);
			console.log("mot de passe non identique");
		} else {
			setIsNotSameRegisterPassword(false);
			console.log("mot de passe identique, on continu");
		}
	};

	const loginSubmit = () => {
		console.log("login clické");
	};

	return (
		<>
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col xl:flex-row xl:p-6 gap-10 xl:gap-40 items-center xl:items-start xl:justify-center">
				{/* Partie login */}
				<div className="w-full mt-7 xl:mt-0 bg-white/60 xl:w-2/7 ">
					<form action={loginSubmit} autoComplete="off">
						<div className="p-3 w-full">
							<h2 className="p-3 bg-gray-500/80 font-semibold text-lg">
								Connexion
							</h2>
							<div className="flex flex-col">
								{/* Partie email */}
								<Input
									htmlFor="loginEmail"
									label="Email"
									type="email"
									value={loginEmail}
									onChange={setLoginEmail}
								/>

								{/* Partie Mot de passe */}
								<div>
									<Input
										htmlFor="loginPassword"
										label="Mot de passe"
										type="password"
										value={loginPassword}
										onChange={setLoginPassword}
									/>

									<div className="text-xs">
										<p className="ml-0">
											Mot de passe oublié ?{" "}
											<button
												type="button"
												className="underline cursor-pointer"
											>
												Cliquez ici pour le récupérer
											</button>
										</p>
									</div>
								</div>
							</div>
							<button
								type="submit"
								className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
								onSubmit={loginSubmit}
							>
								SE CONNECTER
							</button>
						</div>
					</form>
				</div>

				<div className="border-b w-full xl:hidden"></div>

				{/* Partie register */}
				<div className="p-3 w-full bg-white/60 xl:w-2/7">
					<form action={registerSubmit} autoComplete="off">
						<h2 className="p-3  bg-gray-500/80 font-semibold text-lg">
							Création de compte
						</h2>
						<div className="flex flex-col">
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
							<div className="mt-2 text-xs">
								<span
									className={hasMinLength ? "text-green-600" : "text-red-600"}
								>
									✔ Au moins 8 caractères
								</span>
								<br />
								<span
									className={hasUppercase ? "text-green-600" : "text-red-600"}
								>
									✔ Une majuscule
								</span>
								<br />
								<span className={hasNumber ? "text-green-600" : "text-red-600"}>
									✔ Un chiffre
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
						<div className="flex items-start gap-2 mt-2">
							<input
								type="checkbox"
								id="accept"
								name="accept"
								required
								className="mt-1"
								checked={isChecked}
								onChange={handleCheckConditions}
							/>
							<label htmlFor="accept" className="text-sm text-gray-700">
								J'ai lu et j'accepte les{" "}
								<Link to="/conditions-generales-de-vente" className="underline">
									conditions d'utilisation
								</Link>{" "}
								et la{" "}
								<Link to="/politique-de-confidentialite" className="underline">
									politique de confidentialité
								</Link>
								.
							</label>
						</div>

						<button
							type="submit"
							className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
						>
							CREER UN COMPTE
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
