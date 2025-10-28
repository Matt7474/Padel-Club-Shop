// import { CheckCheck, MailWarning } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { getMyMessages, sendContactForm } from "../../../api/Contact";
// import { useToastStore } from "../../../store/ToastStore ";
// import { useAuthStore } from "../../../store/useAuthStore";
// import type { FormData } from "../../../types/Messages";
// import Button from "../Tools/Button";
// import Loader from "../Tools/Loader";
// import TextArea from "../Tools/TextArea";
// import type { Imessages } from "./ClientsMessages";

// export default function MyMessages() {
// 	const addToast = useToastStore((state) => state.addToast);
// 	const user = useAuthStore((state) => state.user);
// 	const [loading, setLoading] = useState(false);
// 	const [messages, setMessages] = useState<Imessages[]>([]);
// 	const [, setError] = useState("");
// 	const [newMessage, setNewMessage] = useState("");
// 	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

// 	const fetchMessages = async () => {
// 		if (!user) return;
// 		try {
// 			setLoading(true);
// 			const messages = await getMyMessages(user.email);
// 			const sorted = messages.data.sort(
// 				(a: Imessages, b: Imessages) =>
// 					(a.created_at ? new Date(a.created_at).getTime() : 0) -
// 					(b.created_at ? new Date(b.created_at).getTime() : 0),
// 			);
// 			setMessages(sorted);
// 		} catch (err: unknown) {
// 			if (err instanceof Error) setError(err.message);
// 			else setError("Erreur inconnue");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchMessages();
// 	}, []);

// 	// 🔽 Scroll à l’intérieur du conteneur
// 	useEffect(() => {
// 		if (messagesContainerRef.current) {
// 			const container = messagesContainerRef.current;
// 			container.scrollTop = container.scrollHeight;
// 		}
// 	}, [messages]);

// 	const [formData] = useState<FormData>({
// 		user_id: user ? user.id : null,
// 		firstName: user?.firstName || "",
// 		lastName: user?.lastName || "",
// 		email: user?.email || "",
// 		phone: user?.phone || "",
// 		subject: "other",
// 		message: newMessage,
// 		orderNumber: "",
// 		is_deleted: false,
// 	});

// 	const handleSubmit = async (): Promise<void> => {
// 		try {
// 			const updatedFormData = { ...formData, message: newMessage };
// 			await sendContactForm(updatedFormData);
// 			addToast(`Votre message a bien été envoyé`, "bg-green-500");
// 			await fetchMessages();
// 			setNewMessage("");
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				alert(error.message);
// 				addToast(`Votre message n'a pas pu être envoyé`, "bg-red-500");
// 			}
// 		}
// 	};

// 	if (loading) return <Loader text="de vos messages" />;

// 	if (messages.length === 0)
// 		return (
// 			<div className="flex justify-center items-center mt-4 xl:mt-0 xl:transform xl:translate-y-1/3">
// 				<div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
// 					<div className="w-20 h-20 bg-linear-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
// 						<MailWarning className="w-10 h-10 text-amber-600" />
// 					</div>
// 					<h2 className="text-2xl font-bold text-slate-800 mb-3">
// 						Aucun message
// 					</h2>
// 					<p className="text-slate-500 text-lg mb-6">
// 						Vous n'avez reçu aucun message pour le moment.
// 					</p>
// 					<Link
// 						to="/"
// 						className="bg-linear-to-r from-amber-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
// 					>
// 						Retour à la page d'accueil
// 					</Link>
// 				</div>
// 			</div>
// 		);

// 	let previousDate = "";

// 	return (
// 		<div className="mx-auto mt-7 xl:grid xl:grid-cols-5 xl:mx-50 gap-6">
// 			{/* ✅ conteneur scrollable avec ref */}
// 			<div
// 				ref={messagesContainerRef}
// 				className="bg-white space-y-6 p-6 rounded-3xl shadow-xl col-span-3 max-h-130 xl:max-h-200 overflow-y-auto scroll-smooth"
// 			>
// 				{messages.map((msg, index) => {
// 					const msgDate = msg.created_at
// 						? new Date(msg.created_at).toLocaleDateString("fr-FR", {
// 								day: "2-digit",
// 								month: "long",
// 								year: "numeric",
// 							})
// 						: "-";

// 					const showDate = msgDate !== previousDate;
// 					previousDate = msgDate;

// 					return (
// 						<div key={msg.id || index}>
// 							{/* Message client */}
// 							{showDate && (
// 								<div className="flex justify-end mr-2 text-sm italic text-gray-700 mt-4">
// 									Le {msgDate}
// 								</div>
// 							)}
// 							<div className="flex justify-end">
// 								<div className="bg-amber-100 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
// 									<p>{msg.message}</p>
// 									{msg.is_read && (
// 										<div className="flex justify-end items-center mt-2 space-x-2">
// 											<p className="italic text-gray-500">Lu</p>
// 											<CheckCheck className="w-5 h-5 text-green-700" />
// 										</div>
// 									)}
// 								</div>
// 							</div>

// 							{/* Réponse admin */}
// 							{msg.response && (
// 								<>
// 									<div className="flex justify-start ml-2 text-sm italic text-gray-700 mt-4">
// 										Le{" "}
// 										{msg.responded_at
// 											? new Date(msg.responded_at).toLocaleDateString("fr-FR", {
// 													day: "2-digit",
// 													month: "long",
// 													year: "numeric",
// 												})
// 											: "-"}
// 									</div>
// 									<div className="flex justify-start">
// 										<div className="bg-green-100 text-gray-900 rounded-2xl shadow-lg p-3 w-4/5 max-w-md hover:shadow-xl transition-shadow">
// 											<p>{msg.response}</p>
// 										</div>
// 									</div>
// 								</>
// 							)}
// 						</div>
// 					);
// 				})}
// 			</div>

// 			<div className="bg-white p-6 rounded-3xl shadow-xl mt-7 xl:mt-0 h-80 col-span-2">
// 				<TextArea
// 					label={"Votre message"}
// 					placeholder={""}
// 					length={newMessage.length}
// 					height={"h-50"}
// 					value={newMessage}
// 					onChange={setNewMessage}
// 					maxLength={500}
// 				/>

// 				<div className="-mt-3">
// 					<Button
// 						type={"button"}
// 						onClick={handleSubmit}
// 						buttonText={"ENVOYER"}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
