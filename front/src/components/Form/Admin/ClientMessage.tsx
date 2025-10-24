import {
	CloudUpload,
	Contact,
	FileDigit,
	Mail,
	MessagesSquare,
	Phone,
	Send,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import {
	deleteMessage,
	responseMessage,
	restoreMessage,
} from "../../../api/Contact";
import { useToastStore } from "../../../store/ToastStore ";
import type { Imessages } from "./ClientsMessages";

interface ClientMessageProps {
	message: Imessages;
	onReturn: () => void;
}

export default function ClientMessage({
	message,
	onReturn,
}: ClientMessageProps) {
	const subjectMap: Record<string, string> = {
		general: "Question générale",
		order: "Suivi de commande",
		product: "Information produit",
		complaint: "Réclamation",
		partnership: "Partenariat",
		other: "Autre",
	};
	const [response, setResponse] = useState("");
	const [currentMessage, setCurrentMessage] = useState(message);
	const addToast = useToastStore((state) => state.addToast);

	const handleSubmit = async () => {
		if (!response.trim()) return;

		try {
			await responseMessage(currentMessage.id, response);
			setCurrentMessage((prev) => ({
				...prev,
				response: response,
			}));
			setResponse("");
			addToast(`Votre message à bien été envoyé`, "bg-green-500");
		} catch (error) {
			console.error("Erreur lors de l’envoi :", error);
			addToast(`Votre message n'a pas pu être envoyé`, "bg-red-500");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteMessage(currentMessage.id);
			addToast(`Le message à bien été archivé`, "bg-green-500");
			setCurrentMessage({
				...currentMessage,
				is_deleted: true,
			});
			onReturn();
		} catch (error) {
			console.error("Erreur lors de l’envoi :", error);
			addToast(`Votre message n'a pas pu être envoyé`, "bg-red-500");
		}
	};

	const handleRestore = async () => {
		try {
			await restoreMessage(currentMessage.id);
			setCurrentMessage({
				...currentMessage,
				is_deleted: false,
			});
			addToast(`Le message à bien été restauré`, "bg-green-500");
			onReturn();
		} catch (error) {
			console.error("Erreur lors de l’envoi :", error);
			addToast(`Votre message n'a pas pu être restauré`, "bg-red-500");
		}
	};

	return (
		<div className="bg-gray-50 mt-4">
			<button
				type="button"
				onClick={onReturn}
				className="flex mt-0 mb-4 cursor-pointer"
			>
				<img
					src="/icons/arrow.svg"
					alt="fleche retour"
					className="w-4 rotate-180"
				/>
				Retour
			</button>

			<div className="max-w-3xl mx-auto space-y-6 relative">
				{/* Fiche Contact */}
				<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
					<p className="text-center text-md text-gray-700 font-semibold italic -mt-2 mb-3">
						Fiche Contact
					</p>
					{message.is_deleted === false ? (
						<button type="button" onClick={handleDelete}>
							<div className="absolute top-3.5 right-5 text-red-500 cursor-pointer">
								<Trash2 />
							</div>
						</button>
					) : (
						<button type="button" onClick={handleRestore}>
							<div className="absolute top-3.5 right-5 text-green-600 cursor-pointer">
								<CloudUpload />
							</div>
						</button>
					)}

					<div className="grid grid-cols-[auto_90px_1fr] items-center gap-3">
						<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
							<Contact className="w-5 h-5 text-amber-600" />
						</div>
						<p className="font-semibold text-gray-900 text-sm text-right">
							Client :
						</p>
						<p className="font-semibold text-gray-900 text-sm">
							{currentMessage.last_name} {currentMessage.first_name}
						</p>
					</div>

					{currentMessage.email && (
						<div className="grid grid-cols-[auto_90px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<Mail className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Email :
							</p>
							<a
								href={`mailto:${currentMessage.email}?subject=${encodeURIComponent(
									subjectMap[currentMessage.subject || "Autre"] ||
										"Réponse à votre message",
								)}&body=${encodeURIComponent(
									`Bonjour ${currentMessage.first_name || ""},\n\nMerci pour votre message concernant "${subjectMap[currentMessage.subject || "Autre"]}".\n\n/// CORPS DU MESSAGE ///\n\nCordialement,\nL’équipe PCS`,
								)}`}
								className="font-semibold text-blue-700 text-sm hover:underline break-all"
							>
								{currentMessage.email}
							</a>
						</div>
					)}

					{currentMessage.phone && (
						<div className="grid grid-cols-[auto_90px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<Phone className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Téléphone :
							</p>
							<a
								href={`tel:${currentMessage.phone}`}
								className="font-semibold text-blue-700 text-sm hover:underline"
							>
								{currentMessage.phone}
							</a>
						</div>
					)}

					{currentMessage.subject && (
						<div className="grid grid-cols-[auto_90px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<MessagesSquare className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Sujet :
							</p>
							<p className="font-semibold text-gray-900 text-sm">
								{currentMessage.subject}
							</p>
						</div>
					)}

					{currentMessage.order_number && (
						<div className="grid grid-cols-[auto_90px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<FileDigit className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Commande :
							</p>
							<p className="font-semibold text-gray-900 text-sm">
								{currentMessage.order_number}
							</p>
						</div>
					)}
				</div>

				{/* Message client */}
				<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
					<div className="flex justify-between">
						<p className="font-semibold text-gray-900 mb-2 flex">Message :</p>
						<p className="text-gray-500 italic flex">
							Reçu le :{" "}
							{currentMessage.created_at
								? new Date(currentMessage.created_at).toLocaleDateString(
										"fr-FR",
										{
											day: "2-digit",
											month: "long",
											year: "numeric",
										},
									)
								: "-"}
						</p>
					</div>
					<p className="mt-2">{currentMessage.message}</p>
				</div>

				{/* Réponse admin */}
				{!currentMessage.user ? (
					<div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
						<p className="font-semibold mb-2">Attention :</p>
						<p>
							Cet utilisateur n'est pas inscrit sur le site. Vous ne pouvez pas
							répondre via le système de messages interne. Merci d’envoyer votre
							réponse par email directement ou par téléphone.
						</p>
						<div className="flex justify-between">
							{currentMessage.email && (
								<a
									href={`mailto:${currentMessage.email}?subject=${encodeURIComponent(
										subjectMap[currentMessage.subject || "Autre"] ||
											"Réponse à votre message",
									)}`}
									className="mt-3 inline-block font-semibold text-blue-700 hover:underline"
								>
									Envoyer un email à {currentMessage.email}
								</a>
							)}
							{currentMessage.phone && (
								<a
									href={`tel:${currentMessage.phone}`}
									className="mt-3 inline-block font-semibold text-blue-700 hover:underline"
								>
									Téléphoner au {currentMessage.phone}
								</a>
							)}
						</div>
					</div>
				) : currentMessage.response ? (
					<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
						<div className="flex justify-between">
							<p className="font-semibold text-gray-900 mb-2 flex">Réponse :</p>
							<p className="text-gray-500 italic flex">
								Envoyé le :{" "}
								{new Date().toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</p>
						</div>
						<p className="mt-2">{currentMessage.response}</p>
					</div>
				) : (
					/* Formulaire de réponse */
					<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
						<label
							htmlFor="response"
							className="flex font-semibold text-gray-900 mb-2"
						>
							Réponse :
						</label>
						<textarea
							id="response"
							name="response"
							value={response}
							onChange={(e) => setResponse(e.target.value)}
							rows={6}
							className="w-full px-4 py-3 rounded-lg border"
							placeholder="Écrivez votre réponse..."
						/>
						<button
							type="button"
							onClick={handleSubmit}
							className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer mt-5"
						>
							<Send className="w-5 h-5" />
							<span>Envoyer le message</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
