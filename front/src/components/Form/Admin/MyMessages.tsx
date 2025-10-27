import { CheckCheck, MailWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMessages } from "../../../api/Contact";
import { useAuthStore } from "../../../store/useAuthStore";
import Loader from "../Tools/Loader";
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
			console.log("useffect messages", messages);

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
		return <Loader text={"de vos messages"} />;
	}

	if (messages.length === 0)
		return (
			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-linear-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
						className="bg-linear-to-r from-amber-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
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
					<div className="flex justify-center text-sm italic text-gray-700 mt-4 ">
						Le{" "}
						{messages[0].created_at
							? new Date(messages[0].created_at).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})
							: "-"}
					</div>
					<div className="flex justify-end -mt-4">
						<div className="bg-amber-100 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
							<div className="flex flex-col">
								<p>{messages[0].message}</p>

								{messages[0].is_read && (
									<div className="flex justify-end items-center mt-2 space-x-2">
										<p className="italic text-gray-500">Lu</p>
										<CheckCheck className="w-5 h-5 text-green-700" />
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Réponse admin */}
					<div className="flex justify-center text-sm italic text-gray-700 mt-4 ">
						Le{" "}
						{messages[0].responded_at
							? new Date(messages[0].responded_at).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})
							: "-"}
					</div>
					{messages[0].response && (
						<div className="flex justify-start -mt-4">
							<div className="bg-green-100 text-gray-900 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
								<p>{messages[0].response}</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
