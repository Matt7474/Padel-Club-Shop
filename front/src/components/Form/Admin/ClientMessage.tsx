import { Contact, Mail, MessagesSquare, Phone } from "lucide-react";
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

	return (
		<div className="min-h-screen bg-gray-50 mt-4">
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
				{/* Carte du client */}
				<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
					<div>
						<p className="text-center text-md text-gray-700 font-semibold italic -mt-2 mb-3">
							Fiche Contact
						</p>
						<div className="grid grid-cols-[auto_80px_1fr] items-center gap-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<Contact className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Client :
							</p>
							<p className="font-semibold text-gray-900 text-sm">
								{message.last_name} {message.first_name}
							</p>
						</div>
					</div>

					{message.email && (
						<div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<Mail className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Email :
							</p>
							<a
								href={`mailto:${message.email}?subject=${encodeURIComponent(
									subjectMap[message.subject || "Autre"] ||
										"Réponse à votre message",
								)}&body=${encodeURIComponent(
									`Bonjour ${message.first_name || ""},

									Merci pour votre message concernant "${subjectMap[message.subject || "Autre"]}".

									/// CORP DE MESSAGE ///

									Cordialement,
									L’équipe PCS`,
								)}`}
								className="font-semibold text-blue-700 text-sm hover:underline break-all"
							>
								{message.email}
							</a>
						</div>
					)}

					{message.phone && (
						<div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 mt-3">
							<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
								<Phone className="w-5 h-5 text-amber-600" />
							</div>
							<p className="font-semibold text-gray-900 text-sm text-right">
								Téléphone :
							</p>
							<a
								href={`tel:${message.phone}`}
								className="font-semibold text-blue-700 text-sm hover:underline"
							>
								{message.phone}
							</a>
						</div>
					)}

					<div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 mt-3">
						<div className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
							<MessagesSquare className="w-5 h-5 text-amber-600" />
						</div>

						<p className="font-semibold text-gray-900 text-sm text-right">
							Sujet :
						</p>
						<p className="font-semibold text-gray-900 text-sm">
							{message.subject ? subjectMap[message.subject] : "-"}
						</p>
					</div>
				</div>

				{/* Message */}
				<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
					<div className="flex justify-between">
						<p className="font-semibold text-gray-900 mb-2 flex">Message :</p>

						<p className="text-gray-500 italic flex">
							Reçu le :{" "}
							{message.created_at
								? new Date(message.created_at).toLocaleDateString("fr-FR", {
										day: "2-digit",
										month: "long",
										year: "numeric",
									})
								: "-"}
						</p>
					</div>
					<p className="mt-2">{message.message}</p>
				</div>
			</div>
		</div>
	);
}
