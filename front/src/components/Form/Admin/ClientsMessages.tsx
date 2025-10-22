import { Contact, Loader2, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getClientMessages } from "../../../api/Contact";
import ClientMessage from "./ClientMessage";

export interface Imessages {
	id?: number;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
	created_at?: string;
	order_number?: string;
}

export default function ClientsMessages() {
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Imessages[]>([]);
	const [selectedMessage, setSelectedMessage] = useState<Imessages | null>(
		null,
	);
	const [, setError] = useState("");

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				setLoading(true);
				const messages = await getClientMessages();
				setMessages(messages.data);
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Erreur inconnue");
			} finally {
				setLoading(false);
			}
		};

		fetchMessages();
	}, []);

	const subjectMap: Record<string, string> = {
		general: "Question générale",
		order: "Suivi de commande",
		product: "Information produit",
		complaint: "Réclamation",
		partnership: "Partenariat",
		other: "Autre",
	};

	const handleClick = (message: Imessages) => {
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

	if (selectedMessage) {
		return (
			<ClientMessage
				onReturn={() => setSelectedMessage(null)}
				message={selectedMessage}
				// onUpdated={() => {
				// 	refreshArticles();
				// 	if (isChecked) refreshDeletedArticles();
				// }}
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
							key={message.id}
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
