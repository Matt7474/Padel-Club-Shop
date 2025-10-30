import { useState } from "react";
import { requestResetPassword } from "../api/User";
import Input from "../components/Form/Tools/Input";
import Loader from "../components/Form/Tools/Loader";
import { useToastStore } from "../store/ToastStore ";

export default function RequestResetPassword() {
	const addToast = useToastStore((state) => state.addToast);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			addToast("Veuillez entrer votre email", "bg-red-500");
			return;
		}

		setLoading(true);
		try {
			await requestResetPassword({ email });
			addToast(
				"Si cet email existe, un lien de réinitialisation a été envoyé",
				"bg-green-500",
			);
			setEmail("");
		} catch (error: unknown) {
			console.error(error);
			addToast("Erreur lors de la demande de réinitialisation", "bg-red-500");
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Loader text="Envoi du lien en cours..." />;

	return (
		<div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
			<h2 className="text-xl font-semibold mb-4 text-center">
				Réinitialiser le mot de passe
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					htmlFor="email"
					label="Email"
					type="email"
					value={email}
					onChange={(val) => setEmail(val)}
				/>
				<button
					type="submit"
					className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:brightness-90 transition"
				>
					Envoyer le lien
				</button>
			</form>
		</div>
	);
}
