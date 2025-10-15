import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/User";
import Input from "../components/Form/Tools/Input";
import { useAuthStore } from "../store/useAuthStore";
import type { AuthResponse } from "../types/AuthResponse";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const loginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const credentials = { email, password };

		try {
			const response: AuthResponse = await loginUser(credentials);
			console.log("✅ Utilisateur connecté :", response);

			// 🧩 Récupère la fonction login du store
			const login = useAuthStore.getState().login;

			login(
				{
					id: response.user.id,
					firstName: response.user.first_name,
					lastName: response.user.last_name,
					email: response.user.email,
					role: response.user.role || undefined,
				},
				response.token,
			);
			console.log("Token reçu :", response.token);
			navigate("/");
		} catch (error: any) {
			console.error("❌ Erreur front :", error.message);
		}
	};

	return (
		<>
			<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:bg-cover xl:bg-center flex flex-col xl:flex-row xl:p-6 gap-10 xl:gap-40 items-center xl:items-start xl:justify-center">
				{/* Partie login */}
				<div className="w-full mt-7 xl:mt-0 bg-white/60 xl:w-2/7 ">
					<form onSubmit={loginSubmit} autoComplete="off">
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
									value={email}
									onChange={setEmail}
								/>

								{/* Partie Mot de passe */}
								<div>
									<Input
										htmlFor="loginPassword"
										label="Mot de passe"
										type="password"
										value={password}
										onChange={setPassword}
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
							<span className="mr-1">Pas encore de compte ?</span>
							<Link to={"/register"} className="underline cursor-pointer">
								Créez en un ici
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
