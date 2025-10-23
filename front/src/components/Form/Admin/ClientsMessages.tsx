import { Contact, Loader2, MailWarning, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getClientMessages, markMessageAsRead } from "../../../api/Contact";
import type { UserApiResponse } from "../../../types/User";
import ClientMessage from "./ClientMessage";

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
		const interval = setInterval(fetchMessages, 60000);
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
	console.log(messages);

	if (selectedMessage) {
		return (
			<ClientMessage
				onReturn={() => setSelectedMessage(null)}
				message={selectedMessage}
			/>
		);
	}

	return (
		<>
			<div>
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Liste des messages client
				</h2>

				<div className="mt-4 space-y-6">
					{messages.map((message) => (
						<button
							type="button"
							key={message.email}
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
					))}
				</div>
			</div>
		</>
	);
}
