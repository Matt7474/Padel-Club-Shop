import { CheckCheck, Send, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUserMessages } from "../../../api/Message";
import { useToastStore } from "../../../store/ToastStore ";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Message } from "../../../types/Conversation";
import Loader from "../Tools/Loader";

export default function MyMessages() {
	const { isAuthenticated, user } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);

	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!user?.id) return;

		// Connexion WebSocket
		ws.current = new WebSocket("ws://localhost:3000"); // ou wss:// en prod

		ws.current.onopen = () => {
			console.log("✅ WebSocket connected");
			ws.current?.send(JSON.stringify({ type: "connect", userId: user.id }));
		};

		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "message") {
				setMessages((prev) => [...prev, message.data]);
			}
		};

		ws.current.onclose = () => {
			console.log("❎ WebSocket closed");
		};

		return () => {
			ws.current?.close();
		};
	}, [user?.id]);

	// Scroll vers le bas
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (isAuthenticated && user?.id) {
			fetchMessages(); // ✅ Charge l'historique via HTTP
		}
	}, [isAuthenticated, user?.id]);

	// Récupération des messages du client connecté
	const fetchMessages = async () => {
		if (!user?.id) return;

		try {
			setLoading(true);
			const msgs = await getUserMessages(user.id);
			setMessages(msgs);
		} catch (_err: unknown) {
			addToast("Erreur lors du chargement des messages", "bg-red-500");
		} finally {
			setLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim()) {
			addToast("Le message ne peut pas être vide", "bg-red-500");
			return;
		}

		if (!user?.id) {
			addToast("Vous devez être connecté", "bg-red-500");
			return;
		}

		if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
			addToast("WebSocket déconnecté", "bg-red-500");
			return;
		}

		try {
			setIsSending(true);

			// ✅ Envoyer via WebSocket (pas via HTTP)
			ws.current.send(
				JSON.stringify({
					type: "message",
					senderId: user.id,
					receiverId: null, // null = message au support
					content: newMessage,
				}),
			);

			setNewMessage("");
			addToast("Message envoyé", "bg-green-500");
		} catch (err: unknown) {
			console.error("Error sending message:", err);
			addToast(
				err instanceof Error ? err.message : "Erreur lors de l'envoi",
				"bg-red-500",
			);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isAuthenticated && user?.id) {
			fetchMessages();
		}
	}, [isAuthenticated, user?.id]);

	if (loading) return <Loader text="de vos messages" />;

	return (
		<div className="h-180 bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Carte principale avec marges */}
				<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-300">
					{/* Header */}
					<div className="bg-linear-to-br from-pink-500 to-purple-600 px-6 py-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
								<UserIcon className="w-6 h-6 text-pink-600" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-white">Support Client</h1>
								<p className="text-sm text-pink-100">
									Équipe disponible pour vous aider
								</p>
							</div>
						</div>
					</div>

					{/* Zone de messages avec marques latérales */}
					<div className="relative">
						{/* Marques décoratives gauche */}
						<div className="absolute left-0 top-0 bottom-0 w-2 opacity-50" />

						{/* Marques décoratives droite */}
						<div className="absolute right-0 top-0 bottom-0 w-2  opacity-50" />

						{/* Messages */}
						<div className="h-96 overflow-y-auto px-8 py-6">
							{messages.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-center">
									<div className="w-20 h-20 bg-linear-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
										<Send className="w-10 h-10 text-pink-500" />
									</div>
									<h3 className="text-xl font-semibold text-gray-700 mb-2">
										Aucun message
									</h3>
									<p className="text-gray-500">
										Envoyez votre premier message à notre équipe support
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{messages.map((msg, index) => {
										const isMyMessage = msg.sender_id === user?.id;

										// 🔹 Formatage des dates
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
													className={`flex ${isMyMessage ? "justify-end" : "justify-start"} animate-fadeIn`}
												>
													<div
														className={`flex gap-3 max-w-xl ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}
													>
														{/* Avatar */}
														<div
															className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
																isMyMessage
																	? "bg-linear-to-br from-green-400 to-green-600"
																	: "bg-linear-to-br from-pink-400 to-purple-600"
															}`}
														>
															<span className="text-white font-bold text-sm">
																{isMyMessage
																	? user?.firstName?.charAt(0).toUpperCase()
																	: "S"}
															</span>
														</div>

														{/* Bulle + nom */}
														<div
															className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
														>
															{/* Nom de l'expéditeur */}
															{!isMyMessage && (
																<span className="text-xs font-semibold text-gray-600 mb-1 px-2">
																	Support client
																</span>
															)}

															{/* Bulle du message */}
															<div
																className={`relative px-5 py-3 rounded-2xl shadow-md wrap-break-word ${
																	isMyMessage
																		? "bg-linear-to-bl from-green-500 to-green-600 text-white rounded-tr-sm"
																		: "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
																}`}
																style={{
																	maxWidth: "70%",
																	wordBreak: "break-word",
																}}
															>
																<p className="whitespace-pre-wrap">
																	{msg.content}
																</p>
															</div>

															{/* Métadonnées */}
															<div
																className={`flex items-center gap-2 mt-1 px-2 ${
																	isMyMessage ? "flex-row-reverse" : "flex-row"
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
																{msg.is_read && isMyMessage && (
																	<CheckCheck className="w-4 h-4 text-green-600" />
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})}

									<div ref={messagesEndRef} />
								</div>
							)}
						</div>
					</div>

					{/* Zone de saisie */}
					<div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
						<div className="flex gap-3 items-start">
							<div className="flex-1 relative">
								<textarea
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									onKeyPress={handleKeyPress}
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
								className="h-10 px-6 bg-linear-to-br from-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
							>
								<Send className="w-5 h-5" />
								<span>Envoyer</span>
							</button>
						</div>
						<p className="text-xs text-gray-400 mt-2 text-center">
							Appuyez sur Entrée pour envoyer, Maj + Entrée pour une nouvelle
							ligne
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
