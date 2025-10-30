import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestPassword } from "../api/User";
import Input from "../components/Form/Tools/Input";
import Loader from "../components/Form/Tools/Loader";
import { useToastStore } from "../store/ToastStore ";
import type { requestPasswordProps } from "../types/User";

export default function ResetPassword() {
	const addToast = useToastStore((state) => state.addToast);
	const [loading, setLoading] = useState(false);
	const [params] = useSearchParams();
	const email = params.get("email");
	const token = params.get("token");
	const navigate = useNavigate();

	// ✅ DEBUG
	console.log("ResetPassword component loaded");
	console.log("Email:", email);
	console.log("Token:", token);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// ✅ Vérifier que email et token sont présents
	if (!email || !token) {
		return (
			<div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
				<h2 className="text-xl font-semibold mb-4 text-center text-red-600">
					Lien invalide
				</h2>
				<p className="text-center">
					Le lien de réinitialisation est invalide ou incomplet.
				</p>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!password || !confirmPassword) {
			addToast("Veuillez remplir tous les champs", "bg-red-500");
			return;
		}

		if (password !== confirmPassword) {
			addToast("Les mots de passe ne correspondent pas", "bg-red-500");
			return;
		}

		if (
			password.length < 8 ||
			!/[A-Z]/.test(password) ||
			!/\d/.test(password)
		) {
			addToast(
				"Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre",
				"bg-red-500",
			);
			return;
		}

		setLoading(true);
		try {
			await requestPassword({ email, password, token } as requestPasswordProps);
			addToast("Mot de passe réinitialisé avec succès", "bg-green-500");
			setPassword("");
			setConfirmPassword("");
			navigate("/login");
		} catch (error: unknown) {
			console.error(error);
			addToast(
				"Erreur lors de la réinitialisation du mot de passe",
				"bg-red-500",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Loader text="Réinitialisation en cours..." />;

	return (
		<div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
			<h2 className="text-xl font-semibold mb-4 text-center">
				Réinitialiser le mot de passe
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="relative">
					<Input
						htmlFor="password"
						label="Nouveau mot de passe"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(val) => setPassword(val)}
						placeholder="••••••••"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute top-[20%] right-2 p-1 cursor-pointer"
					>
						<img
							src={showPassword ? "/icons/hide.svg" : "/icons/show.svg"}
							alt={showPassword ? "Cacher" : "Afficher"}
							className="w-5 h-5"
						/>
					</button>
				</div>

				<div className="relative">
					<Input
						htmlFor="confirmPassword"
						label="Confirmer le mot de passe"
						type={showConfirm ? "text" : "password"}
						value={confirmPassword}
						onChange={(val) => setConfirmPassword(val)}
						placeholder="••••••••"
					/>
					<button
						type="button"
						onClick={() => setShowConfirm(!showConfirm)}
						className="absolute top-[20%] right-2 p-1 cursor-pointer"
					>
						<img
							src={showConfirm ? "/icons/hide.svg" : "/icons/show.svg"}
							alt={showConfirm ? "Cacher" : "Afficher"}
							className="w-5 h-5"
						/>
					</button>
				</div>

				<button
					type="submit"
					className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:brightness-90 transition"
				>
					Réinitialiser
				</button>
			</form>

			{/* Indicateurs de sécurité */}
			{password && (
				<div className="mt-2 text-sm space-y-1">
					<p
						className={password.length >= 8 ? "text-green-600" : "text-red-600"}
					>
						{password.length >= 8 ? "✔" : "✘"} Au moins 8 caractères
					</p>
					<p
						className={
							/[A-Z]/.test(password) ? "text-green-600" : "text-red-600"
						}
					>
						{/[A-Z]/.test(password) ? "✔" : "✘"} Une majuscule
					</p>
					<p
						className={/\d/.test(password) ? "text-green-600" : "text-red-600"}
					>
						{/\d/.test(password) ? "✔" : "✘"} Un chiffre
					</p>
				</div>
			)}
		</div>
	);
}
