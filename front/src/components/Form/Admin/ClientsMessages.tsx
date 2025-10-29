import { CheckCheck, MailWarning, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import Loader from "../Tools/Loader";
import TextArea from "../Tools/TextArea";
import type {
	Conversation,
	NewMessagePayload,
} from "../../../types/Conversation";
import {
	createMessage,
	getAllConversations,
	getAllMessagesFromConversation,
} from "../../../api/Conversation";

export default function ClientsMessages() {
	const { isAuthenticated, user } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	// ---------------- FETCH CONVERSATIONS ----------------
	const fetchConversations = async () => {
		if (!isAuthenticated) return;
		try {
			setLoading(true);
			const res = await getAllConversations();
			setConversations(res);
			if (!selectedConversation && res.length > 0)
				setSelectedConversation(res[0]);
		} catch (err: unknown) {
			addToast(
				err instanceof Error ? err.message : "Erreur inconnue",
				"bg-red-500",
			);
		} finally {
			setLoading(false);
		}
	};

	// ---------------- FETCH MESSAGES ----------------
	const fetchMessages = async (conversationId: number) => {
		try {
			const msgs = await getAllMessagesFromConversation(conversationId);
			setConversations((prev) =>
				prev.map((conv) =>
					conv.id === conversationId ? { ...conv, messages: msgs } : conv,
				),
			);
		} catch (err: unknown) {
			addToast(
				err instanceof Error ? err.message : "Erreur inconnue",
				"bg-red-500",
			);
		}
	};

	useEffect(() => {
		fetchConversations();
		const interval = setInterval(fetchConversations, 300000); // rafraîchissement toutes les 5min
		return () => clearInterval(interval);
	}, [isAuthenticated]);

	// ---------------- SCROLL AUTOMATIQUE ----------------
	useEffect(() => {
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current;
			container.scrollTop = container.scrollHeight;
		}
	}, [selectedConversation]);

	const handleSelectConversation = async (conv: Conversation) => {
		setSelectedConversation(conv);
		if (!conv.messages) await fetchMessages(conv.id);
	};

	const handleSendMessage = async () => {
		if (!selectedConversation) {
			addToast("Veuillez sélectionner une conversation", "bg-red-500");
			return;
		}
		if (!newMessage.trim()) {
			addToast("Le message ne peut pas être vide", "bg-red-500");
			return;
		}

		const payload: NewMessagePayload = {
			conversationId: selectedConversation.id,
			content: newMessage,
		};

		try {
			const message = await createMessage(payload);
			setConversations((prev) =>
				prev.map((conv) =>
					conv.id === selectedConversation.id
						? { ...conv, messages: [...(conv.messages || []), message] }
						: conv,
				),
			);
			setNewMessage("");
			addToast("Message envoyé avec succès", "bg-green-500");
		} catch (err: unknown) {
			addToast(
				err instanceof Error ? err.message : "Erreur inconnue",
				"bg-red-500",
			);
		}
	};

	if (loading) return <Loader text="des messages client" />;

	if (conversations.length === 0)
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

	return (
		<div className="min-h-screen bg-gray-50">
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Liste des messages client
			</h2>

			<div className="mx-auto mt-7 xl:grid xl:grid-cols-7 xl:mx-50 gap-6 max-w-7xl px-4">
				{/* USERS */}
				<div className="bg-white p-6 rounded-3xl shadow-lg col-span-2 max-h-140 overflow-y-auto scroll-smooth border border-gray-100">
					<h2 className="font-semibold text-lg mb-4 text-gray-700 flex items-center gap-2">
						👥 Utilisateurs
					</h2>
					{conversations.map((conv) => {
						const lastMessage = conv.messages?.slice(-1)[0];
						return (
							<button
								type="button"
								key={conv.id}
								onClick={() => handleSelectConversation(conv)}
								className={`flex items-center justify-between w-full p-3 mb-2 rounded-xl transition-all shadow-sm hover:bg-pink-50 ${
									selectedConversation?.id === conv.id
										? "bg-pink-100"
										: "bg-gray-50"
								}`}
							>
								<span className="font-medium text-gray-700">
									{conv.title || `Conversation ${conv.id}`}
								</span>
								{lastMessage && !lastMessage.is_read && (
									<span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
										1
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* MESSAGES */}
				<div
					ref={messagesContainerRef}
					className="bg-white mt-8 xl:mt-0 space-y-6 p-6 rounded-3xl shadow-lg col-span-3 h-140 overflow-y-auto scroll-smooth border border-gray-100"
				>
					<h2 className="font-semibold text-lg mb-4 text-gray-700">
						Messages de{" "}
						<span className="text-pink-600">
							{selectedConversation?.title || "—"}
						</span>
					</h2>
					{selectedConversation?.messages?.length ? (
						selectedConversation.messages.map((msg) => (
							<div key={msg.id} className="flex flex-col space-y-2">
								<div
									className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`rounded-2xl shadow-sm p-3 w-4/5 max-w-md ${
											msg.sender_id === user?.id
												? "bg-green-100"
												: "bg-amber-100"
										}`}
									>
										<p>{msg.content}</p>
										{msg.is_read && msg.sender_id !== user?.id && (
											<div className="flex justify-end items-center text-xs text-gray-500 mt-1">
												<span>Lu</span>
												<CheckCheck className="text-green-700 w-4 -mt-1 ml-1" />
											</div>
										)}
									</div>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-400 mt-10 italic">
							Aucun message pour cette conversation
						</p>
					)}
				</div>

				{/* REPLY */}
				<div className="bg-white p-6 rounded-3xl shadow-lg mt-7 xl:mt-0 col-span-2 flex flex-col justify-between h-70 border border-gray-100">
					<TextArea
						label="Votre réponse"
						placeholder="Écrire un message..."
						length={newMessage.length}
						height="h-40"
						value={newMessage}
						onChange={setNewMessage}
						maxLength={500}
					/>
					<button
						type="button"
						onClick={handleSendMessage}
						className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-semibold py-4 h-10 mt-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer"
					>
						<Send className="w-5 h-5" />
						<span>Envoyer le message</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// import { CheckCheck, MailWarning, Send } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { markMessageAsRead } from "../../../api/Contact";
// import { useToastStore } from "../../../store/ToastStore ";
// import { useAuthStore } from "../../../store/useAuthStore";
// import type { FormData } from "../../../types/Messages";
// import Loader from "../Tools/Loader";
// import TextArea from "../Tools/TextArea";

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
// 	user: {
// 		id: number;
// 		first_name: string;
// 		last_name: string;
// 		email: string;
// 	};
// }

// export default function ClientsMessages() {
// 	const { isAuthenticated } = useAuthStore();
// 	const addToast = useToastStore((state) => state.addToast);
// 	const [newMessage, setNewMessage] = useState("");
// 	const [loading, setLoading] = useState(false);
// 	const [messages, setMessages] = useState<Imessages[]>([]);
// 	const [selectedUser, setSelectedUser] = useState<Imessages["user"] | null>(
// 		null,
// 	);
// 	const [, setError] = useState("");
// 	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

// 	// const fetchMessages = async () => {
// 	// 	if (!isAuthenticated) return;
// 	// 	try {
// 	// 		setLoading(true);
// 	// 		const res = await getClientMessages();
// 	// 		const sorted = res.data.sort(
// 	// 			(a: Imessages, b: Imessages) =>
// 	// 				(a.created_at ? new Date(a.created_at).getTime() : 0) -
// 	// 				(b.created_at ? new Date(b.created_at).getTime() : 0),
// 	// 		);
// 	// 		setMessages(sorted);
// 	// 	} catch (err: unknown) {
// 	// 		setError(err instanceof Error ? err.message : "Erreur inconnue");
// 	// 	} finally {
// 	// 		setLoading(false);
// 	// 	}
// 	// };

// 	// useEffect(() => {
// 	// 	fetchMessages();
// 	// 	const interval = setInterval(fetchMessages, 300000);
// 	// 	return () => clearInterval(interval);
// 	// }, [isAuthenticated]);

// 	// Scroll automatique
// 	useEffect(() => {
// 		if (messagesContainerRef.current) {
// 			const container = messagesContainerRef.current;
// 			container.scrollTop = container.scrollHeight;
// 		}
// 	}, [messages, selectedUser]);

// 	const usersWithMessages: Imessages["user"][] = Array.from(
// 		new Map(
// 			messages
// 				.filter((m) => m.user_id)
// 				.map((m) => {
// 					const userData: Imessages["user"] = {
// 						id: m.user_id as number,
// 						first_name: m.first_name || "",
// 						last_name: m.last_name || "",
// 						email: m.email || "",
// 					};
// 					return [userData.id, userData];
// 				}),
// 		).values(),
// 	);

// 	const messagesForSelectedUser = selectedUser
// 		? messages.filter((m) => m.user_id === selectedUser.id)
// 		: [];

// 	const handleClickUser = async (user: Imessages["user"]) => {
// 		setSelectedUser(user);
// 		console.log("selectedUser", selectedUser);

// 		const userMessages = messages.filter((m) => m.user_id === user.id);
// 		const unreadMessages = userMessages.filter((m) => !m.is_read);
// 		for (const msg of unreadMessages) {
// 			await markMessageAsRead(msg.id);
// 		}
// 	};

// 	const [, setFormData] = useState<FormData>({
// 		user_id: null,
// 		firstName: "",
// 		lastName: "",
// 		email: "",
// 		phone: "",
// 		subject: "other",
// 		message: "",
// 		orderNumber: "",
// 		is_deleted: false,
// 	});

// 	useEffect(() => {
// 		if (selectedUser) {
// 			setFormData({
// 				user_id: selectedUser.id,
// 				firstName: selectedUser.first_name,
// 				lastName: selectedUser.last_name,
// 				email: selectedUser.email,
// 				phone: "",
// 				subject: "other",
// 				message: "",
// 				orderNumber: "",
// 				is_deleted: false,
// 			});
// 		}
// 	}, [selectedUser]);

// 	// const handleSubmit = async (): Promise<void> => {
// 	// 	if (!selectedUser) {
// 	// 		addToast("Veuillez sélectionner un utilisateur", "bg-red-500");
// 	// 		return;
// 	// 	}

// 	// 	if (!newMessage.trim()) {
// 	// 		addToast("Le message ne peut pas être vide", "bg-red-500");
// 	// 		return;
// 	// 	}

// 	// 	try {
// 	// 		await sendMessage({
// 	// 			user_id: selectedUser.id,
// 	// 			message: newMessage,
// 	// 			is_admin: true, // ✅ pour différencier les messages admin
// 	// 		});

// 	// 		addToast("Message envoyé avec succès", "bg-green-500");
// 	// 		setNewMessage("");
// 	// 		await fetchMessages();
// 	// 	} catch (error: unknown) {
// 	// 		if (error instanceof Error) {
// 	// 			addToast(`Erreur : ${error.message}`, "bg-red-500");
// 	// 		} else {
// 	// 			addToast("Erreur inconnue lors de l'envoi", "bg-red-500");
// 	// 		}
// 	// 	}
// 	// };

// 	console.log("Messages:", messages);
// 	console.log("UsersWithMessages:", usersWithMessages);

// 	if (loading) return <Loader text="des messages client" />;

// 	if (messages.length === 0)
// 		return (
// 			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
// 				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
// 					<div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
// 						<MailWarning className="w-10 h-10 text-amber-600" />
// 					</div>
// 					<h2 className="text-2xl font-bold text-slate-800 mb-3">
// 						Aucun messages
// 					</h2>
// 					<p className="text-slate-500 text-lg mb-6">
// 						Vous n'avez reçu aucun message pour le moment.
// 					</p>
// 				</div>
// 			</div>
// 		);

// 	let previousDate = "";

// 	return (
// 		<div className="min-h-screen bg-gray-50">
// 			{/* HEADER */}
// 			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
// 				Liste des messages client
// 			</h2>

// 			<div className="mx-auto mt-7 xl:grid xl:grid-cols-7 xl:mx-50 gap-6 max-w-7xl px-4">
// 				{/* === COLONNE GAUCHE : UTILISATEURS === */}
// 				<div className="bg-white p-6 rounded-3xl shadow-lg col-span-2 max-h-140 overflow-y-auto scroll-smooth border border-gray-100">
// 					<h2 className="font-semibold text-lg mb-4 text-gray-700 flex items-center gap-2">
// 						👥 Utilisateurs
// 					</h2>

// 					{usersWithMessages.length === 0 ? (
// 						<p className="text-gray-400 text-sm italic">Aucun utilisateur</p>
// 					) : (
// 						usersWithMessages.map((user) => {
// 							const unreadCount = messages.filter(
// 								(m) => m.user_id === user.id && !m.is_read,
// 							).length;

// 							return (
// 								<button
// 									type="button"
// 									key={user.id}
// 									className={`flex items-center justify-between w-full p-3 mb-2 rounded-xl transition-all shadow-sm hover:bg-pink-50 ${
// 										selectedUser?.id === user.id ? "bg-pink-100" : "bg-gray-50"
// 									}`}
// 									onClick={() => handleClickUser(user)}
// 								>
// 									<div className="flex items-center space-x-3">
// 										<div className="w-9 h-9 bg-pink-400 text-white rounded-full flex items-center justify-center font-semibold">
// 											<div className="uppercase">
// 												{user.last_name?.[0] ?? "?"}
// 											</div>
// 											<div className="uppercase">
// 												{user.first_name?.[0] ?? "?"}{" "}
// 											</div>
// 										</div>
// 										<span className="font-medium text-gray-700">
// 											{user.last_name} {user.first_name}
// 										</span>
// 									</div>

// 									{unreadCount > 0 && (
// 										<span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
// 											{unreadCount}
// 										</span>
// 									)}
// 								</button>
// 							);
// 						})
// 					)}
// 				</div>

// 				{/* === COLONNE CENTRALE : MESSAGES === */}
// 				<div
// 					ref={messagesContainerRef}
// 					className="bg-white mt-8 xl:mt-0 space-y-6 p-6 rounded-3xl shadow-lg col-span-3 h-140 overflow-y-auto scroll-smooth border border-gray-100"
// 				>
// 					<h2 className="font-semibold text-lg mb-4 text-gray-700">
// 						Messages de{" "}
// 						<span className="text-pink-600">
// 							{selectedUser
// 								? `${selectedUser.last_name} ${selectedUser.first_name}`
// 								: "—"}
// 						</span>
// 					</h2>

// 					{selectedUser ? (
// 						messagesForSelectedUser.length === 0 ? (
// 							<p className="text-center text-gray-400 mt-10 italic">
// 								Aucun message pour cet utilisateur
// 							</p>
// 						) : (
// 							messagesForSelectedUser.map((msg, index) => {
// 								const msgDate = msg.created_at
// 									? new Date(msg.created_at).toLocaleDateString("fr-FR", {
// 											day: "2-digit",
// 											month: "long",
// 											year: "numeric",
// 										})
// 									: "-";

// 								const showDate = msgDate !== previousDate;
// 								previousDate = msgDate;

// 								return (
// 									<div key={msg.id || index}>
// 										{showDate && (
// 											<div className="text-center text-sm italic text-gray-400 my-4">
// 												Le {msgDate}
// 											</div>
// 										)}

// 										{/* Message client */}
// 										<div className="flex justify-end">
// 											<div className="bg-amber-100 rounded-2xl shadow-sm p-3 w-4/5 max-w-md hover:shadow-md transition-all">
// 												<p className="text-gray-800">{msg.message}</p>
// 												{msg.is_read && (
// 													<div className="flex justify-end text-right ">
// 														<p className="text-right text-xs text-gray-500 mt- flex1">
// 															Lu
// 														</p>
// 														<CheckCheck className="text-green-700 w-4 -mt-1 ml-1" />
// 													</div>
// 												)}
// 											</div>
// 										</div>

// 										{/* Réponse admin */}
// 										{msg.response && (
// 											<div className="flex justify-start mt-3">
// 												<div className="bg-green-100 text-gray-900 rounded-2xl shadow-sm p-3 w-4/5 max-w-md hover:shadow-md transition-all">
// 													<p>{msg.response}</p>
// 												</div>
// 											</div>
// 										)}
// 									</div>
// 								);
// 							})
// 						)
// 					) : (
// 						<p className="text-center text-gray-400 mt-10 italic">
// 							Sélectionnez un utilisateur pour voir ses messages
// 						</p>
// 					)}
// 				</div>

// 				{/* === COLONNE DROITE : RÉPONSE ADMIN === */}
// 				<div className="bg-white p-6 rounded-3xl shadow-lg mt-7 xl:mt-0 col-span-2 flex flex-col justify-between h-70 border border-gray-100">
// 					<TextArea
// 						label="Votre réponse"
// 						placeholder="Écrire un message..."
// 						length={newMessage.length}
// 						height="h-40"
// 						value={newMessage}
// 						onChange={setNewMessage}
// 						maxLength={500}
// 					/>

// 					<button
// 						type="button"
// 						// onClick={handleSubmit}
// 						className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-semibold py-4 h-10 mt-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer"
// 					>
// 						<Send className="w-5 h-5" />
// 						<span>Envoyer le message</span>
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// // import { Contact, MailSearch, MailWarning, MessagesSquare } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import { getClientMessages, markMessageAsRead } from "../../../api/Contact";
// // import { useAuthStore } from "../../../store/useAuthStore";
// // import type { UserApiResponse } from "../../../types/User";
// // import Loader from "../Tools/Loader";
// // import ClientMessage from "./ClientMessage";

// // export interface Imessages {
// // 	id: number;
// // 	user_id?: number;
// // 	first_name?: string;
// // 	last_name?: string;
// // 	email?: string;
// // 	phone?: string;
// // 	subject?: string;
// // 	message?: string;
// // 	response?: string;
// // 	responded_at?: string;
// // 	created_at?: string;
// // 	order_number?: string;
// // 	is_read?: boolean;
// // 	is_deleted?: boolean;
// // 	user: UserApiResponse;
// // }

// // export default function ClientsMessages() {
// // 	const { isAuthenticated } = useAuthStore();
// // 	const [loading, setLoading] = useState(false);
// // 	const [messages, setMessages] = useState<Imessages[]>([]);
// // 	const [selectedMessage, setSelectedMessage] = useState<Imessages | null>(
// // 		null,
// // 	);
// // 	const [, setError] = useState("");
// // 	const [, setUnreadMessages] = useState(0);
// // 	const [isChecked, setIsChecked] = useState(false);
// // 	const [reloadTrigger, setReloadTrigger] = useState(false);

// // 	useEffect(() => {
// // 		const fetchMessages = async () => {
// // 			if (!isAuthenticated) return;
// // 			try {
// // 				setLoading(true);
// // 				const messages = await getClientMessages();
// // 				setUnreadMessages(messages.unreadCount || 0);
// // 				setMessages(messages.data);
// // 			} catch (err) {
// // 				setError(err instanceof Error ? err.message : "Erreur inconnue");
// // 			} finally {
// // 				setLoading(false);
// // 			}
// // 		};

// // 		fetchMessages();
// // 		const interval = setInterval(fetchMessages, 30000);
// // 		return () => clearInterval(interval);
// // 	}, [isAuthenticated, reloadTrigger]);

// // 	const subjectMap: Record<string, string> = {
// // 		general: "Question générale",
// // 		order: "Suivi de commande",
// // 		product: "Information produit",
// // 		complaint: "Réclamation",
// // 		partnership: "Partenariat",
// // 		other: "Autre",
// // 	};

// // 	const handleClick = async (message: Imessages) => {
// // 		if (!message.is_read) {
// // 			await markMessageAsRead(message.id);
// // 		}
// // 		setSelectedMessage(message);
// // 	};

// // 	const filteredMessages = messages.filter((message) => {
// // 		if (isChecked) {
// // 			return message.is_deleted === true;
// // 		}
// // 		return message.is_deleted !== true;
// // 	});

// // 	if (loading) {
// // 		return <Loader text={"des messages client"} />;
// // 	}

// // 	if (selectedMessage) {
// // 		return (
// // 			<ClientMessage
// // 				onReturn={() => {
// // 					setSelectedMessage(null);
// // 					setReloadTrigger((prev) => !prev);
// // 				}}
// // 				message={selectedMessage}
// // 			/>
// // 		);
// // 	}

// // 	if (messages.length === 0)
// // 		return (
// // 			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
// // 				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
// // 					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
// // 						<MailSearch className="w-10 h-10 text-green-600" />
// // 					</div>
// // 					<h2 className="text-2xl font-bold text-slate-800 mb-3">
// // 						Aucun messages
// // 					</h2>
// // 					<p className="text-slate-500 text-lg mb-6">
// // 						Vous n'avez reçu aucun message pour le moment.
// // 					</p>
// // 					<Link
// // 						to={"/"}
// // 						className=" bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
// // 					>
// // 						Retour à la page d'accueil
// // 					</Link>
// // 				</div>
// // 			</div>
// // 		);

// // 	return (
// // 		<>
// // 			<div>
// // 				<div className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between items-center">
// // 					<h2>Liste des messages client</h2>
// // 					<div className="w-1/2 text-end">
// // 						<label htmlFor="articleDeleted">
// // 							Voir les messages archivés ?
// // 							<input
// // 								type="checkbox"
// // 								id="articleDeleted"
// // 								className="ml-2"
// // 								checked={isChecked}
// // 								onChange={() => setIsChecked((prev) => !prev)}
// // 							/>
// // 						</label>
// // 					</div>
// // 				</div>

// // 				{/* ✅ Même code pour les deux cas, seul le contenu de filteredMessages change */}
// // 				<div className="mt-4 space-y-6">
// // 					{filteredMessages.length === 0 ? (
// // 						<div className="text-center py-8 text-gray-500">
// // 							<p className="text-lg">
// // 								{isChecked ? "Aucun message archivé" : "Aucun message actif"}
// // 							</p>
// // 						</div>
// // 					) : (
// // 						filteredMessages.map((message) => (
// // 							<button
// // 								type="button"
// // 								key={message.id}
// // 								className="w-full cursor-pointer"
// // 								onClick={() => handleClick(message)}
// // 							>
// // 								<div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow max-w-3xl mx-auto">
// // 									<div className="flex flex-col space-y-2">
// // 										{/* Contact */}
// // 										<div className="flex relative">
// // 											<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
// // 												<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
// // 													<Contact className="w-3 h-3 text-amber-600" />
// // 												</div>
// // 												<p className="font-semibold text-gray-900 text-sm text-right">
// // 													Contact :
// // 												</p>
// // 												<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
// // 													{message.last_name} {message.first_name}
// // 												</p>
// // 											</div>
// // 											<div className="font-semibold italic text-gray-500 text-xs absolute right-0 -top-3">
// // 												{message.created_at
// // 													? new Date(message.created_at).toLocaleDateString(
// // 															"fr-FR",
// // 															{
// // 																day: "2-digit",
// // 																month: "long",
// // 																year: "numeric",
// // 															},
// // 														)
// // 													: "-"}
// // 												{message.is_read === false && (
// // 													<div className="mt-5 ml-6">
// // 														<MailWarning className="text-red-500 animate-bounce" />
// // 													</div>
// // 												)}
// // 											</div>
// // 										</div>

// // 										{/* Sujet */}
// // 										<div className="grid grid-cols-[auto_60px_1fr] items-center gap-3">
// // 											<div className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
// // 												<MessagesSquare className="w-3 h-3 text-amber-600" />
// // 											</div>
// // 											<p className="font-semibold text-gray-900 text-sm text-right">
// // 												Sujet :
// // 											</p>
// // 											<p className="font-semibold text-gray-900 text-sm -ml-1 text-start">
// // 												{message.subject ? subjectMap[message.subject] : "-"}
// // 											</p>
// // 										</div>
// // 									</div>
// // 								</div>
// // 							</button>
// // 						))
// // 					)}
// // 				</div>
// // 			</div>
// // 		</>
// // 	);
// // }
