import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserById, loginUser } from "../api/User";
import Input from "../components/Form/Tools/Input";
import { useToastStore } from "../store/ToastStore ";
import { useAuthStore } from "../store/useAuthStore";
import type { AuthResponse } from "../types/AuthResponse";

export default function Login() {
	const navigate = useNavigate();
	const addToast = useToastStore((state) => state.addToast);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(false);

	const roleMap: Record<number, string> = {
		1: "super admin",
		2: "admin",
		3: "client",
	};

	const handleResetPassword = () => {
		navigate("/request-reset-password");
	};

	const loginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const credentials = { email, password };

		try {
			// Login initial pour récupérer le token
			const response: AuthResponse = await loginUser(credentials);

			const token = response.token;

			// Récupère les infos complètes du user (avec adresses)
			const fullUser = await getUserById(response.user.id, token);

			// Transforme les données pour le store
			const transformedUser = {
				id: fullUser.user_id,
				firstName: fullUser.first_name,
				lastName: fullUser.last_name,
				email: fullUser.email,
				phone: fullUser.phone,
				// ✅ role en string pour que ton JSX continue de fonctionner
				role: response.user.role || roleMap[fullUser.role_id] || "user",
				// ✅ adresses complètes
				addresses: fullUser.addresses || [],
			};

			// Met à jour le store avec le user complet
			const login = useAuthStore.getState().login;
			login(transformedUser, token);

			addToast(`Bienvenue ${fullUser.first_name}`, "bg-green-500");
			window.location.href = "/";
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("❌ Erreur front :", error.message);
				setErrorMessage(true);
			} else {
				console.error("❌ Erreur inconnue :", error);
			}
		}
	};

	return (
		<>
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col xl:flex-row xl:p-6 gap-10 xl:gap-20 items-center xl:items-start xl:justify-center">
				{/* Message mode démo */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-7 xl:mt-3 xl:w-2/7">
					<p className="text-yellow-800">
						<strong>Notice :</strong> Ce site est en mode{" "}
						<strong>démonstration</strong>, il est développé à titre de projet
						personnel et ne traite aucune donnée réelle. Les informations
						ci-dessous décrivent les pratiques qui seraient appliquées dans un
						contexte commercial réel.
					</p>
					<ul className="list-disc list-inside mt-3 text-yellow-800">
						<li>
							Les fonctionnalités du site reflètent un usage réel, mais aucun
							traitement réel n’est effectué.
						</li>
						<li>
							Les paiements effectués sur le site sont fictifs et ne génèrent
							aucune transaction réelle.
						</li>

						<li>
							Toutes les informations personnelles utilisées sont factices.
						</li>
						<li>
							La base de données et toutes informations personnelles sont
							réinitialisée quotidiennement à <strong>02h00</strong> pour
							conserver un environnement de démonstration propre. Tout compte
							créé sera donc supprimé lors de cette réinitialisation.
						</li>
						<p className="mt-3">
							Vous pouvez créer votre propre compte "client" temporaire ou
							utiliser un compte d'essai "admin" :<br />
							<p className="mt-3">
								<strong>Email :</strong> tony.stark@test.com
								<br />
								<strong>Mot de passe :</strong> Password1
							</p>
						</p>
					</ul>
				</div>
				{/* Partie login */}
				<div className="w-full -mt-7 xl:mt-3 bg-white/60 xl:w-2/7 p-3">
					<form onSubmit={loginSubmit} autoComplete="off">
						<h2 className="p-3 bg-gray-500/80 font-semibold text-lg">
							Connexion
						</h2>
						<div className="flex flex-col">
							{/* Partie email */}
							<Input
								htmlFor="loginEmail"
								label="Email"
								type="email"
								value={email}
								onChange={setEmail}
							/>
							{/* Partie mot de passe */}
							<div>
								<Input
									htmlFor="loginPassword"
									label="Mot de passe"
									type="password"
									value={password}
									onChange={setPassword}
								/>
								<div className="text-sm">
									<p className="ml-0">
										Mot de passe oublié ?{" "}
										<button
											type="button"
											className="underline cursor-pointer"
											onClick={handleResetPassword}
										>
											Cliquez ici pour le récupérer
										</button>
									</p>
								</div>
							</div>
						</div>
						{errorMessage && (
							<div className="text-sm text-red-500 mt-4">
								Adresse email ou mot de passe incorrect
							</div>
						)}
						<button
							type="submit"
							className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
						>
							SE CONNECTER
						</button>
						<span className="mr-1 text-sm">Pas encore de compte ?</span>
						<Link to={"/register"} className="underline cursor-pointer text-sm">
							Créez en un ici
						</Link>
					</form>
				</div>
			</div>
		</>
	);
}

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getUserById, loginUser } from "../api/User";
// import Input from "../components/Form/Tools/Input";
// import { useToastStore } from "../store/ToastStore ";
// import { useAuthStore } from "../store/useAuthStore";
// import type { AuthResponse } from "../types/AuthResponse";

// export default function Login() {
// 	const navigate = useNavigate();
// 	const addToast = useToastStore((state) => state.addToast);

// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [errorMessage, setErrorMessage] = useState(false);

// 	const roleMap: Record<number, string> = {
// 		1: "super admin",
// 		2: "admin",
// 		3: "client",
// 	};

// 	const handleResetPassword = () => {
// 		navigate("/request-reset-password");
// 	};

// 	const loginSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		const credentials = { email, password };

// 		try {
// 			// Login initial pour récupérer le token
// 			const response: AuthResponse = await loginUser(credentials);

// 			const token = response.token;

// 			// Récupère les infos complètes du user (avec adresses)
// 			const fullUser = await getUserById(response.user.id, token);

// 			// Transforme les données pour le store
// 			const transformedUser = {
// 				id: fullUser.user_id,
// 				firstName: fullUser.first_name,
// 				lastName: fullUser.last_name,
// 				email: fullUser.email,
// 				phone: fullUser.phone,
// 				// ✅ role en string pour que ton JSX continue de fonctionner
// 				role: response.user.role || roleMap[fullUser.role_id] || "user",
// 				// ✅ adresses complètes
// 				addresses: fullUser.addresses || [],
// 			};

// 			// Met à jour le store avec le user complet
// 			const login = useAuthStore.getState().login;
// 			login(transformedUser, token);

// 			addToast(`Bienvenue ${fullUser.first_name}`, "bg-green-500");
// 			navigate("/");
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				console.error("❌ Erreur front :", error.message);
// 				setErrorMessage(true);
// 			} else {
// 				console.error("❌ Erreur inconnue :", error);
// 			}
// 		}
// 	};

// 	return (
// 		<>
// 			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col xl:flex-row xl:p-6 items-center xl:items-start xl:justify-center">
// 				{/* Partie login */}
// 				<div className="xl:flex xl:justify-between">
// 					{/* Message mode démo */}
// 					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-7 xl:mt-3 xl:w-2/7">
// 						<p className="text-yellow-800">
// 							<strong>Notice :</strong> Ce site est en mode{" "}
// 							<strong>démonstration</strong>, il est développé à titre de projet
// 							personnel et ne traite aucune donnée réelle. Les informations
// 							ci-dessous décrivent les pratiques qui seraient appliquées dans un
// 							contexte commercial réel.
// 						</p>
// 						<ul className="list-disc list-inside mt-3 text-yellow-800">
// 							<li>
// 								Les fonctionnalités du site reflètent un usage réel, mais aucun
// 								traitement réel n’est effectué.
// 							</li>
// 							<li>
// 								Les paiements effectués sur le site sont fictifs et ne génèrent
// 								aucune transaction réelle.
// 							</li>

// 							<li>
// 								Toutes les informations personnelles utilisées sont factices.
// 							</li>
// 							<li>
// 								La base de données est réinitialisée quotidiennement à{" "}
// 								<strong>03:00</strong> pour conserver un environnement de
// 								démonstration propre. Tout compte créé sera donc supprimé lors
// 								de cette réinitialisation.
// 							</li>
// 							<p className="mt-3">
// 								Vous pouvez créer un compte temporaire ou utiliser un compte
// 								d'essai :<br />
// 								<p className="mt-3">
// 									<strong>Email :</strong> tony.stark@test.com
// 									<br />
// 									<strong>Mot de passe :</strong> Password1
// 								</p>
// 							</p>
// 						</ul>
// 					</div>

// 					<div className="w-full mt-3  bg-white/60 xl:w-2/7 p-3">
// 						<form onSubmit={loginSubmit} autoComplete="off">
// 							<h2 className="p-3 bg-gray-500/80 font-semibold text-lg">
// 								Connexion
// 							</h2>
// 							<div className="flex flex-col">
// 								{/* Partie email */}
// 								<Input
// 									htmlFor="loginEmail"
// 									label="Email"
// 									type="email"
// 									value={email}
// 									onChange={setEmail}
// 								/>
// 								{/* Partie mot de passe */}
// 								<div>
// 									<Input
// 										htmlFor="loginPassword"
// 										label="Mot de passe"
// 										type="password"
// 										value={password}
// 										onChange={setPassword}
// 									/>
// 									<div className="text-sm">
// 										<p className="ml-0">
// 											Mot de passe oublié ?{" "}
// 											<button
// 												type="button"
// 												className="underline cursor-pointer"
// 												onClick={handleResetPassword}
// 											>
// 												Cliquez ici pour le récupérer
// 											</button>
// 										</p>
// 									</div>
// 								</div>
// 							</div>
// 							{errorMessage && (
// 								<div className="text-sm text-red-500 mt-4">
// 									Adresse email ou mot de passe incorrect
// 								</div>
// 							)}
// 							<button
// 								type="submit"
// 								className="bg-amber-500 text-white font-bold mt-10 p-2 w-full cursor-pointer"
// 							>
// 								SE CONNECTER
// 							</button>
// 							<span className="mr-1 text-sm">Pas encore de compte ?</span>
// 							<Link
// 								to={"/register"}
// 								className="underline cursor-pointer text-sm"
// 							>
// 								Créez en un ici
// 							</Link>
// 						</form>
// 					</div>
// 					<div></div>
// 				</div>
// 			</div>
// 		</>
// 	);
// }
