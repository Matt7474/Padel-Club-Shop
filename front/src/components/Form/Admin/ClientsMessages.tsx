import { CheckCheck, Send, Users as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	getUserMessages,
	sendAdminMessage,
	sendUserMessage,
} from "../../../api/Message";
import { getAllUsers } from "../../../api/User";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Message, User as UserType } from "../../../types/Conversation";
import type { UserApiResponse } from "../../../types/User";
import Loader from "../Tools/Loader";

export default function ClientsMessages() {
	const { isAuthenticated, user } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);

	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<UserType[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	// --- Fetch all users ---
	const fetchUsers = async () => {
		try {
			const res: UserApiResponse[] = await getAllUsers();
			setUsers(
				res.map((u) => ({
					id: u.user_id,
					first_name: u.first_name,
					last_name: u.last_name,
					email: u.email,
					role: u.role_id,
					phone: u.phone,
				})),
			);
		} catch (_err: unknown) {
			addToast("Erreur lors du chargement des utilisateurs", "bg-red-500");
		}
	};

	// --- Fetch messages for selected user ---
	const fetchMessages = async (userId: number) => {
		try {
			setLoading(true);
			const msgs = await getUserMessages(userId);
			setMessages(msgs);
		} catch (_err: unknown) {
			addToast("Erreur lors du chargement des messages", "bg-red-500");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectUser = async (u: UserType) => {
		setSelectedUser(u);
		setNewMessage("");
		await fetchMessages(u.id);
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim()) {
			addToast("Le message ne peut pas être vide", "bg-red-500");
			return;
		}

		if (!selectedUser?.id || !user?.id) {
			addToast("Utilisateur non sélectionné", "bg-red-500");
			return;
		}

		try {
			setIsSending(true);

			const isAdmin = user.role === "super admin" || user.role === "admin";
			let sentMessage: Message | null = null;

			if (isAdmin) {
				sentMessage = await sendAdminMessage({
					admin_id: user.id,
					user_id: selectedUser.id,
					content: newMessage,
				});
			} else {
				const msgs = await sendUserMessage({
					sender_id: user.id,
					content: newMessage,
				});
				sentMessage = msgs[0];
			}

			if (sentMessage) {
				setMessages((prev) => [...prev, sentMessage]);
			}

			setNewMessage("");
			addToast("Message envoyé", "bg-green-500");
		} catch (err: unknown) {
			console.error("Error sending message:", err);
			addToast(
				err instanceof Error ? err.message : "Erreur inconnue",
				"bg-red-500",
			);
		} finally {
			setIsSending(false);
		}
	};

	// --- Scroll to bottom when messages change ---
	useEffect(() => {
		const chatZone = document.getElementById("chat-scroll-zone");
		if (chatZone) {
			chatZone.scrollTop = chatZone.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (isAuthenticated) fetchUsers();
	}, [isAuthenticated]);

	if (loading) return <Loader text="des messages client" />;

	return (
		<div className=" bg-gray-50 py-8 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4">
				{/* En-tête principal */}
				<div className="bg-linear-to-br from-pink-500 to-purple-600 rounded-3xl shadow-xl mb-8 p-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
							<UserIcon className="w-7 h-7 text-pink-600" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white">
								Gestion des messages clients
							</h1>
							<p className="text-pink-100 text-sm">
								Répondez aux utilisateurs en temps réel
							</p>
						</div>
					</div>
				</div>

				<div className="grid xl:grid-cols-4 gap-6">
					{/* Liste des utilisateurs */}
					<div className="bg-white border-2 h-140 border-gray-200 rounded-l-3xl shadow-lg col-span-1 flex flex-col overflow-hidden">
						{/* En-tête fixe */}
						<div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
							<h2 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
								<UserIcon className="w-5 h-5 text-pink-600" /> Tous les
								utilisateurs
							</h2>
						</div>

						{/* Liste scrollable */}
						<div className="flex-1 overflow-y-auto px-6 py-4">
							{users.map((u) => (
								<button
									key={u.id}
									type="button"
									onClick={() => handleSelectUser(u)}
									className={`block w-full text-left p-3 rounded-xl mb-2 transition-all ${
										selectedUser?.id === u.id
											? "bg-linear-to-br from-pink-100 to-purple-100 border border-pink-300 shadow-md"
											: "bg-gray-50 hover:bg-pink-50"
									}`}
								>
									<p className="font-medium text-gray-700">
										{u.first_name} {u.last_name}
									</p>
									<p className="text-sm text-gray-500">{u.email}</p>
								</button>
							))}
						</div>
					</div>

					{/* Fil de messages */}
					<div className="bg-white border-2 h-140 border-gray-200 rounded-r-3xl shadow-lg col-span-3 flex flex-col overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
							<h2 className="font-semibold text-lg text-gray-700">
								Conversation avec{" "}
								<span className="text-pink-600">
									{selectedUser
										? `${selectedUser.first_name} ${selectedUser.last_name}`
										: "—"}
								</span>
							</h2>
						</div>

						<div
							className="flex-1 overflow-y-auto px-8 py-6 space-y-4"
							id="chat-scroll-zone"
						>
							{!selectedUser ? (
								<div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
									Sélectionnez un utilisateur pour voir la conversation
								</div>
							) : messages.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-center">
									<div className="w-20 h-20 bg-linear-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
										<Send className="w-10 h-10 text-pink-500" />
									</div>
									<h3 className="text-xl font-semibold text-gray-700 mb-2">
										Aucun message
									</h3>
									<p className="text-gray-500">
										Commencez la discussion avec ce client
									</p>
								</div>
							) : (
								messages.map((msg, index) => {
									const isAdminMessage = msg.sender_id === user?.id;

									// Date actuelle et précédente
									const currentDate = new Date(
										msg.created_at,
									).toLocaleDateString("fr-FR", {
										weekday: "long",
										day: "2-digit",
										month: "long",
										year: "numeric",
									});
									const prevDate =
										index > 0
											? new Date(
													messages[index - 1].created_at,
												).toLocaleDateString("fr-FR", {
													weekday: "long",
													day: "2-digit",
													month: "long",
													year: "numeric",
												})
											: null;

									const showDateSeparator = currentDate !== prevDate;

									return (
										<div key={msg.id}>
											{/* --- Séparateur de date --- */}
											{showDateSeparator && (
												<div className="flex justify-center my-4">
													<div className="bg-gray-100 text-gray-600 text-sm px-4 py-1 rounded-full shadow-sm border border-gray-200">
														{currentDate.charAt(0).toUpperCase() +
															currentDate.slice(1)}
													</div>
												</div>
											)}

											{/* --- Message --- */}
											<div
												className={`flex ${isAdminMessage ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`flex gap-3 max-w-xl ${
														isAdminMessage ? "flex-row-reverse" : "flex-row"
													}`}
												>
													{/* Avatar */}
													<div
														className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
															isAdminMessage
																? "bg-linear-to-br from-green-400 to-green-600"
																: "bg-linear-to-br from-pink-400 to-purple-600"
														}`}
													>
														<span className="text-white font-bold text-sm">
															{isAdminMessage
																? "A"
																: selectedUser?.first_name[0]}
														</span>
													</div>

													{/* Bulle + nom */}
													<div
														className={`flex flex-col ${
															isAdminMessage ? "items-end" : "items-start"
														}`}
													>
														{!isAdminMessage && (
															<p className="text-sm text-gray-500 mb-1 ml-2">
																{selectedUser?.first_name}{" "}
																{selectedUser?.last_name}
															</p>
														)}

														<div
															className={`relative px-5 py-3 rounded-2xl shadow-md  wrap-break-word ${
																isAdminMessage
																	? "bg-linear-to-bl from-green-500 to-green-600 text-white rounded-tr-sm"
																	: "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
															}`}
															style={{
																maxWidth: "70%",
																wordBreak: "break-word",
															}}
														>
															<p className="wrap-break-word whitespace-pre-wrap">
																{msg.content}
															</p>
														</div>

														<div
															className={`flex items-center gap-2 mt-1 px-2 ${
																isAdminMessage ? "flex-row-reverse" : "flex-row"
															}`}
														>
															<span className="text-xs text-gray-400">
																{new Date(msg.created_at).toLocaleTimeString(
																	"fr-FR",
																	{
																		hour: "2-digit",
																		minute: "2-digit",
																	},
																)}
															</span>
															{msg.is_read && isAdminMessage && (
																<CheckCheck className="w-4 h-4 text-green-600" />
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Zone de saisie */}
						{selectedUser && (
							<div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
								<div className="flex gap-3 items-start">
									<div className="flex-1 relative">
										<textarea
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											placeholder="Écrivez votre message..."
											maxLength={500}
											rows={3}
											className="w-full px-4 py-3 pr-16 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none resize-none transition-all"
										/>
										<span className="absolute bottom-3 right-3 text-xs text-gray-400">
											{newMessage.length}/500
										</span>
									</div>
									<button
										type="button"
										onClick={handleSendMessage}
										disabled={!newMessage.trim() || isSending}
										className="h-10 px-6 bg-linear-to-br cursor-pointer from-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
									>
										<Send className="w-5 h-5" />
										<span>Envoyer</span>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Espace vide pour équilibre layout */}
					<div className="hidden xl:block col-span-1" />
				</div>
			</div>
		</div>
	);
}
