import { MailWarning } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	getClientMessages,
	markMessageAsRead,
	responseMessage,
} from "../../../api/Contact";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import type { FormData } from "../../../types/Messages";
import Button from "../Tools/Button";
import Loader from "../Tools/Loader";
import TextArea from "../Tools/TextArea";

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
	responded_at?: string;
	created_at?: string;
	order_number?: string;
	is_read?: boolean;
	is_deleted?: boolean;
	user: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
	};
}

export default function ClientsMessages() {
	const { isAuthenticated } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Imessages[]>([]);
	const [selectedUser, setSelectedUser] = useState<Imessages["user"] | null>(
		null,
	);
	const [, setError] = useState("");
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const fetchMessages = async () => {
		if (!isAuthenticated) return;
		try {
			setLoading(true);
			const res = await getClientMessages();
			const sorted = res.data.sort(
				(a: Imessages, b: Imessages) =>
					(a.created_at ? new Date(a.created_at).getTime() : 0) -
					(b.created_at ? new Date(b.created_at).getTime() : 0),
			);
			setMessages(sorted);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();
		const interval = setInterval(fetchMessages, 300000);
		return () => clearInterval(interval);
	}, [isAuthenticated]);

	// Scroll automatique
	useEffect(() => {
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current;
			container.scrollTop = container.scrollHeight;
		}
	}, [messages, selectedUser]);

	const usersWithMessages: Imessages["user"][] = Array.from(
		new Map(
			messages
				.filter((m) => m.user_id)
				.map((m) => {
					const userData: Imessages["user"] = {
						id: m.user_id as number,
						first_name: m.first_name || "",
						last_name: m.last_name || "",
						email: m.email || "",
					};
					return [userData.id, userData];
				}),
		).values(),
	);

	const messagesForSelectedUser = selectedUser
		? messages.filter((m) => m.user_id === selectedUser.id)
		: [];

	const handleClickUser = async (user: Imessages["user"]) => {
		setSelectedUser(user);
		console.log("selectedUser", selectedUser);

		const userMessages = messages.filter((m) => m.user_id === user.id);
		const unreadMessages = userMessages.filter((m) => !m.is_read);
		for (const msg of unreadMessages) {
			await markMessageAsRead(msg.id);
		}
	};

	const [, setFormData] = useState<FormData>({
		user_id: null,
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		subject: "other",
		message: "",
		orderNumber: "",
		is_deleted: false,
	});

	useEffect(() => {
		if (selectedUser) {
			setFormData({
				user_id: selectedUser.id,
				firstName: selectedUser.first_name,
				lastName: selectedUser.last_name,
				email: selectedUser.email,
				phone: "",
				subject: "other",
				message: "",
				orderNumber: "",
				is_deleted: false,
			});
		}
	}, [selectedUser]);

	const handleSubmit = async (): Promise<void> => {
		if (!selectedUser) {
			addToast("Veuillez sélectionner un utilisateur", "bg-red-500");
			return;
		}

		// Trouver le dernier message du client
		const lastMessage = messages
			.filter((m) => m.user_id === selectedUser.id)
			.sort(
				(a, b) =>
					(b.created_at ? new Date(b.created_at).getTime() : 0) -
					(a.created_at ? new Date(a.created_at).getTime() : 0),
			)[0];

		if (!lastMessage) {
			addToast("Aucun message trouvé pour cet utilisateur", "bg-red-500");
			return;
		}

		if (!newMessage.trim()) {
			addToast("La réponse ne peut pas être vide", "bg-red-500");
			return;
		}

		try {
			await responseMessage(lastMessage.id, newMessage);
			addToast(`Réponse envoyée avec succès`, "bg-green-500");
			setNewMessage("");
			await fetchMessages();
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Erreur envoi réponse :", error.message);
				addToast(`Erreur : ${error.message}`, "bg-red-500");
			} else {
				addToast("Erreur inconnue lors de l'envoi", "bg-red-500");
			}
		}
	};

	console.log("Messages:", messages);
	console.log("UsersWithMessages:", usersWithMessages);

	if (loading) return <Loader text="des messages client" />;

	if (messages.length === 0)
		return (
			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
					<div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<MailWarning className="w-10 h-10 text-amber-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-800 mb-3">
						Aucun messages
					</h2>
					<p className="text-slate-500 text-lg mb-6">
						Vous n'avez reçu aucun message pour le moment.
					</p>
				</div>
			</div>
		);

	let previousDate = "";

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des messages client
			</h2>
			<div className="mx-auto mt-7 xl:grid xl:grid-cols-7 xl:mx-50 gap-6">
				{/* Colonne gauche : liste utilisateurs */}
				<div className="bg-white p-6 rounded-3xl shadow-xl col-span-2 max-h-140 overflow-y-auto scroll-smooth">
					<h2 className="font-semibold text-lg mb-4">Utilisateurs</h2>
					{usersWithMessages.length === 0 ? (
						<p className="text-gray-500 text-sm">Aucun utilisateur</p>
					) : (
						usersWithMessages.map((user) => (
							<button
								type="button"
								key={user.id}
								className={`w-full p-3 mb-2 rounded-xl transition shadow hover:shadow-lg text-left ${
									selectedUser?.id === user.id ? "bg-amber-100" : "bg-white"
								}`}
								onClick={() => handleClickUser(user)}
							>
								{user.last_name} {user.first_name}
								<span className="ml-2 text-gray-500 text-xs">
									(
									{
										messages.filter((m) => m.user_id === user.id && !m.is_read)
											.length
									}
									)
								</span>
							</button>
						))
					)}
				</div>

				{/* Colonne milieu : messages */}

				<div
					ref={messagesContainerRef}
					className="bg-white mt-8 xl:mt-0 space-y-6 p-6 rounded-3xl shadow-xl col-span-3 h-140 overflow-y-auto scroll-smooth"
				>
					<h2 className="font-semibold text-lg mb-4 bg-white ">
						Messages de {selectedUser?.last_name} {selectedUser?.first_name}
					</h2>
					{selectedUser ? (
						messagesForSelectedUser.length === 0 ? (
							<p className="text-center text-gray-500 mt-10">
								Aucun message pour cet utilisateur
							</p>
						) : (
							messagesForSelectedUser.map((msg, index) => {
								const msgDate = msg.created_at
									? new Date(msg.created_at).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "long",
											year: "numeric",
										})
									: "-";

								const showDate = msgDate !== previousDate;
								previousDate = msgDate;

								return (
									<div key={msg.id || index}>
										{showDate && (
											<div className="flex justify-end mr-2 text-sm italic text-gray-700 mt-4">
												Le {msgDate}
											</div>
										)}

										{/* Message client */}
										<div className="flex justify-end">
											<div className="bg-amber-100 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
												<p>{msg.message}</p>
												{msg.is_read && (
													<div className="flex justify-end items-center mt-2 space-x-2">
														<p className="italic text-gray-500">Lu</p>
													</div>
												)}
											</div>
										</div>

										{/* Réponse admin */}
										{msg.response && (
											<>
												<div className="flex justify-start ml-2 text-sm italic text-gray-700 mt-4">
													Le{" "}
													{msg.responded_at
														? new Date(msg.responded_at).toLocaleDateString(
																"fr-FR",
																{
																	day: "2-digit",
																	month: "long",
																	year: "numeric",
																},
															)
														: "-"}
												</div>
												<div className="flex justify-start">
													<div className="bg-green-100 text-gray-900 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
														<p>{msg.response}</p>
													</div>
												</div>
											</>
										)}
									</div>
								);
							})
						)
					) : (
						<p className="text-center text-gray-500 mt-10">
							Sélectionnez un utilisateur pour voir ses messages
						</p>
					)}
				</div>

				{/* Colonne droite : reponse */}
				<div className="bg-white p-6 rounded-3xl shadow-xl mt-7 xl:mt-0 h-70 col-span-2">
					<TextArea
						label={"Votre message"}
						placeholder={""}
						length={newMessage.length}
						height={"h-40"}
						value={newMessage}
						onChange={setNewMessage}
						maxLength={500}
					/>

					<div className="-mt-3">
						<Button
							type={"button"}
							onClick={handleSubmit}
							buttonText={"ENVOYER"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// import { Contact, MailSearch, MailWarning, MessagesSquare } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getClientMessages, markMessageAsRead } from "../../../api/Contact";
// import { useAuthStore } from "../../../store/useAuthStore";
// import type { UserApiResponse } from "../../../types/User";
// import Loader from "../Tools/Loader";
// import ClientMessage from "./ClientMessage";

// export interface Imessages {
// 	id: number;
// 	user_id?: number;
// 	first_name?: string;
// 	last_name?: string;
// 	email?: string;
// 	phone?: string;
// 	subject?: string;
// 	message?: string;
// 	response?: string;
// 	responded_at?: string;
// 	created_at?: string;
// 	order_number?: string;
// 	is_read?: boolean;
// 	is_deleted?: boolean;
// 	user: UserApiResponse;
// }

// export default function ClientsMessages() {
// 	const { isAuthenticated } = useAuthStore();
// 	const [loading, setLoading] = useState(false);
// 	const [messages, setMessages] = useState<Imessages[]>([]);
// 	const [selectedMessage, setSelectedMessage] = useState<Imessages | null>(
// 		null,
// 	);
// 	const [, setError] = useState("");
// 	const [, setUnreadMessages] = useState(0);
// 	const [isChecked, setIsChecked] = useState(false);
// 	const [reloadTrigger, setReloadTrigger] = useState(false);

// 	useEffect(() => {
// 		const fetchMessages = async () => {
// 			if (!isAuthenticated) return;
// 			try {
// 				setLoading(true);
// 				const messages = await getClientMessages();
// 				setUnreadMessages(messages.unreadCount || 0);
// 				setMessages(messages.data);
// 			} catch (err) {
// 				setError(err instanceof Error ? err.message : "Erreur inconnue");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchMessages();
// 		const interval = setInterval(fetchMessages, 30000);
// 		return () => clearInterval(interval);
// 	}, [isAuthenticated, reloadTrigger]);

// 	const subjectMap: Record<string, string> = {
// 		general: "Question générale",
// 		order: "Suivi de commande",
// 		product: "Information produit",
// 		complaint: "Réclamation",
// 		partnership: "Partenariat",
// 		other: "Autre",
// 	};

// 	const handleClick = async (message: Imessages) => {
// 		if (!message.is_read) {
// 			await markMessageAsRead(message.id);
// 		}
// 		setSelectedMessage(message);
// 	};

// 	const filteredMessages = messages.filter((message) => {
// 		if (isChecked) {
// 			return message.is_deleted === true;
// 		}
// 		return message.is_deleted !== true;
// 	});

// 	if (loading) {
// 		return <Loader text={"des messages client"} />;
// 	}

// 	if (selectedMessage) {
// 		return (
// 			<ClientMessage
// 				onReturn={() => {
// 					setSelectedMessage(null);
// 					setReloadTrigger((prev) => !prev);
// 				}}
// 				message={selectedMessage}
// 			/>
// 		);
// 	}

// 	if (messages.length === 0)
// 		return (
// 			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
// 				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
// 					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
// 						<MailSearch className="w-10 h-10 text-green-600" />
// 					</div>
// 					<h2 className="text-2xl font-bold text-slate-800 mb-3">
// 						Aucun messages
// 					</h2>
// 					<p className="text-slate-500 text-lg mb-6">
// 						Vous n'avez reçu aucun message pour le moment.
// 					</p>
// 					<Link
// 						to={"/"}
// 						className=" bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
// 					>
// 						Retour à la page d'accueil
// 					</Link>
// 				</div>
// 			</div>
// 		);

// 	return (
// 		<>
// 			<div>
// 				<div className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between items-center">
// 					<h2>Liste des messages client</h2>
// 					<div className="w-1/2 text-end">
// 						<label htmlFor="articleDeleted">
// 							Voir les messages archivés ?
// 							<input
// 								type="checkbox"
// 								id="articleDeleted"
// 								className="ml-2"
// 								checked={isChecked}
// 								onChange={() => setIsChecked((prev) => !prev)}
// 							/>
// 						</label>
// 					</div>
// 				</div>

// 				{/* ✅ Même code pour les deux cas, seul le contenu de filteredMessages change */}
// 				<div className="mt-4 space-y-6">
// 					{filteredMessages.length === 0 ? (
// 						<div className="text-center py-8 text-gray-500">
// 							<p className="text-lg">
// 								{isChecked ? "Aucun message archivé" : "Aucun message actif"}
// 							</p>
// 						</div>
// 					) : (
// 						filteredMessages.map((message) => (
// 							<button
// 								type="button"
// 								key={message.id}
// 								className="w-full cursor-pointer"
// 								onClick={() => handleClick(message)}
// 							>
// 								<div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow max-w-3xl mx-auto">
// 									<div className="flex flex-col space-y-2">
// 										{/* Contact */}
// 										<div className="flex relative">
// 											<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
// 												<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
// 													<Contact className="w-3 h-3 text-amber-600" />
// 												</div>
// 												<p className="font-semibold text-gray-900 text-sm text-right">
// 													Contact :
// 												</p>
// 												<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
// 													{message.last_name} {message.first_name}
// 												</p>
// 											</div>
// 											<div className="font-semibold italic text-gray-500 text-xs absolute right-0 -top-3">
// 												{message.created_at
// 													? new Date(message.created_at).toLocaleDateString(
// 															"fr-FR",
// 															{
// 																day: "2-digit",
// 																month: "long",
// 																year: "numeric",
// 															},
// 														)
// 													: "-"}
// 												{message.is_read === false && (
// 													<div className="mt-5 ml-6">
// 														<MailWarning className="text-red-500 animate-bounce" />
// 													</div>
// 												)}
// 											</div>
// 										</div>

// 										{/* Sujet */}
// 										<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
// 											<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
// 												<MessagesSquare className="w-3 h-3 text-amber-600" />
// 											</div>
// 											<p className="font-semibold text-gray-900 text-sm text-right">
// 												Sujet :
// 											</p>
// 											<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
// 												{message.subject ? subjectMap[message.subject] : "-"}
// 											</p>
// 										</div>
// 									</div>
// 								</div>
// 							</button>
// 						))
// 					)}
// 				</div>
// 			</div>
// 		</>
// 	);
// }
