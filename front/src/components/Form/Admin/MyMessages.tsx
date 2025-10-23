import { CheckCheck, Loader2, MailWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMessages } from "../../../api/Contact";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Imessages } from "./ClientsMessages";

export default function MyMessages() {
	const user = useAuthStore((state) => state.user);
	console.log("user", user);

	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Imessages[]>([]);

	const [, setError] = useState("");

	const fetchMessages = async () => {
		if (!user) {
			return;
		}
		try {
			setLoading(true);
			const messages = await getMyMessages(user?.email);

			setMessages(messages.data);
			console.log("messages.data", messages);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();
	}, []);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-gray-600">
				<Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
				<p className="text-sm font-medium">Chargement des messages...</p>
			</div>
		);
	}

	if (messages.length === 0)
		return (
			<div className="flex justify-center items-center transform translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<MailWarning className="w-10 h-10 text-amber-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-800 mb-3">
						Aucun message
					</h2>
					<p className="text-slate-500 text-lg mb-6">
						Vous n'avez reçu aucun message pour le moment.
					</p>
					<Link
						to={"/"}
						className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
					>
						Retour à la page d'accueil
					</Link>
				</div>
			</div>
		);

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Liste des messages client
				</h2>

				<div className="max-w-3xl mx-auto space-y-6 ">
					{/* Message client */}
					<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow mt-6">
						<div className="flex justify-between">
							<p className="font-semibold text-gray-900 mb-2 flex">Message :</p>
							<div className="flex flex-col">
								<p className="text-gray-500 italic flex">
									Le{" "}
									{messages[0].created_at
										? new Date(messages[0].created_at).toLocaleDateString(
												"fr-FR",
												{
													day: "2-digit",
													month: "long",
													year: "numeric",
												},
											)
										: "-"}
								</p>
								{messages[0].is_read && (
									<div className="flex justify-end">
										<p className="text-end italic text-gray-500">Lu</p>
										<CheckCheck className="w-5 text-green-700 ml-2" />
									</div>
								)}
							</div>
						</div>
						<p className="mt-2">{messages[0].message}</p>
					</div>

					{/* Réponse admin */}
					{messages[0].response && (
						<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
							<div className="flex justify-between">
								<p className="font-semibold text-gray-900 mb-2 flex">
									Réponse :
								</p>
								<p className="text-gray-500 italic flex">
									Le{" "}
									{new Date().toLocaleDateString("fr-FR", {
										day: "2-digit",
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
							<p className="mt-2">{messages[0].response}</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
