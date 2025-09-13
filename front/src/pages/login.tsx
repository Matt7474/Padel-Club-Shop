export default function Login() {
	return (
		<div className="bg-[url('/icons/background.jpg')] bg-cover bg-center h-[60vh] flex items-center justify-center">
			<div className="flex flex-col border w-1/4 border-gray-300 rounded-xl bg-white/60 p-6">
				<p className="text-center text-2xl font-semibold">Connexion</p>

				<div className="flex flex-col mt-10">
					<label htmlFor="email" className="ml-5">
						Email
					</label>
					<input
						type="text"
						className="h-10 border border-gray-300 rounded-lg bg-white pl-3"
						placeholder="John.doe@email.fr"
					/>
				</div>

				<div className="flex flex-col mt-3">
					<label htmlFor="password" className="ml-5">
						Mot de passe
					</label>
					<input
						type="password"
						className="h-10 border border-gray-300 rounded-lg bg-white pl-3"
						placeholder="Votre mot de passe"
					/>
				</div>

				<button
					type="button"
					className="text-xs mt-0 pl-2 text-start cursor-pointer hover:text-blue-500"
				>
					Mot de passe oublié ?
				</button>

				<button
					type="button"
					className="w-1/2 bg-amber-500 p-1 rounded-md mt-10 mb-3 mx-auto cursor-pointer hover:brightness-90"
				>
					Se connecter
				</button>
			</div>
		</div>
	);
}
