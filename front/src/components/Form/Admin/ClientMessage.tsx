import { Contact, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { responseMessage } from "../../../api/Contact";
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

	const handleSubmit = async () => {
		if (!response.trim()) return;

		try {
			const res = await responseMessage(currentMessage.id, response);
			setCurrentMessage((prev) => ({
				...prev,
				response: response,
			}));
			setResponse("");
			console.log("Réponse envoyée :", res);
		} catch (error) {
			console.error("Erreur lors de l’envoi :", error);
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

			<div className="max-w-3xl mx-auto space-y-6 ">
				{/* Fiche Contact */}
				<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
					<p className="text-center text-md text-gray-700 font-semibold italic -mt-2 mb-3">
						Fiche Contact
					</p>

					<div className="grid grid-cols-[auto_100px_1fr] items-center gap-3">
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
						<div className="grid grid-cols-[auto_100px_1fr] items-center gap-3 mt-3">
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
						<div className="grid grid-cols-[auto_100px_1fr] items-center gap-3 mt-3">
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
				{currentMessage.response ? (
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
