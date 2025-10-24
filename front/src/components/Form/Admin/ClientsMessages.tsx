import {
	Contact,
	Loader2,
	MailSearch,
	MailWarning,
	MessagesSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getClientMessages, markMessageAsRead } from "../../../api/Contact";
import type { UserApiResponse } from "../../../types/User";
import ClientMessage from "./ClientMessage";
import { Link } from "react-router-dom";

export interface Imessages {
	id: number;
	user_id?: number;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
	response?: string;
	created_at?: string;
	order_number?: string;
	is_read?: boolean;
	is_deleted?: boolean;
	user: UserApiResponse;
}

export default function ClientsMessages() {
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Imessages[]>([]);
	const [selectedMessage, setSelectedMessage] = useState<Imessages | null>(
		null,
	);
	const [, setError] = useState("");
	const [, setUnreadMessages] = useState(0);
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				setLoading(true);
				const messages = await getClientMessages();
				setUnreadMessages(messages.unreadCount || 0);
				setMessages(messages.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			} finally {
				setLoading(false);
			}
		};
		fetchMessages();
		const interval = setInterval(fetchMessages, 30000);
		return () => clearInterval(interval);
	}, []);

	const subjectMap: Record<string, string> = {
		general: "Question générale",
		order: "Suivi de commande",
		product: "Information produit",
		complaint: "Réclamation",
		partnership: "Partenariat",
		other: "Autre",
	};

	const handleClick = async (message: Imessages) => {
		if (!message.is_read) {
			await markMessageAsRead(message.id);
		}
		setSelectedMessage(message);
	};

	const filteredMessages = messages.filter((message) => {
		if (isChecked) {
			return message.is_deleted === true;
		}
		return message.is_deleted !== true;
	});

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-gray-600">
				<Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
				<p className="text-sm font-medium">
					Chargement des messages clients...
				</p>
			</div>
		);
	}

	if (selectedMessage) {
		return (
			<ClientMessage
				onReturn={() => setSelectedMessage(null)}
				message={selectedMessage}
			/>
		);
	}

	if (messages.length === 0)
		return (
			<div className="flex justify-center items-center transform translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<MailSearch className="w-10 h-10 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-800 mb-3">
						Aucun messages
					</h2>
					<p className="text-slate-500 text-lg mb-6">
						Vous n'avez reçu aucun message pour le moment.
					</p>
					<Link
						to={"/"}
						className=" bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
					>
						Retour à la page d'accueil
					</Link>
				</div>
			</div>
		);

	return (
		<>
			<div>
				<div className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between items-center">
					<h2>Liste des messages client</h2>
					<div className="w-1/2 text-end">
						<label htmlFor="articleDeleted">
							Voir les messages archivés ?
							<input
								type="checkbox"
								id="articleDeleted"
								className="ml-2"
								checked={isChecked}
								onChange={() => setIsChecked((prev) => !prev)}
							/>
						</label>
					</div>
				</div>

				<div className="mt-4 space-y-6">
					{/* 🔥 Utiliser filteredMessages au lieu de messages */}
					{filteredMessages.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<p className="text-lg">
								{isChecked ? "Aucun message archivé" : "Aucun message actif"}
							</p>
						</div>
					) : (
						filteredMessages.map((message) => (
							<button
								type="button"
								key={message.id} // 🔥 Utiliser message.id au lieu de message.email
								className="w-full cursor-pointer"
								onClick={() => handleClick(message)}
							>
								<div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow max-w-3xl mx-auto">
									<div className="flex flex-col space-y-2">
										{/* Contact */}
										<div className="flex relative">
											<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
												<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
													<Contact className="w-3 h-3 text-amber-600" />
												</div>
												<p className="font-semibold text-gray-900 text-sm text-right">
													Contact :
												</p>
												<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
													{message.last_name} {message.first_name}
												</p>
											</div>
											<div className="font-semibold italic text-gray-500 text-xs absolute right-0 -top-3">
												{message.created_at
													? new Date(message.created_at).toLocaleDateString(
															"fr-FR",
															{
																day: "2-digit",
																month: "long",
																year: "numeric",
															},
														)
													: "-"}
												{message.is_read === false && (
													<div className="mt-5 ml-6">
														<MailWarning className="text-red-500 animate-bounce" />
													</div>
												)}
											</div>
										</div>

										{/* Sujet */}
										<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
											<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
												<MessagesSquare className="w-3 h-3 text-amber-600" />
											</div>
											<p className="font-semibold text-gray-900 text-sm text-right">
												Sujet :
											</p>
											<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
												{message.subject ? subjectMap[message.subject] : "-"}
											</p>
										</div>
									</div>
								</div>
							</button>
						))
					)}
				</div>
			</div>
		</>
	);
}
