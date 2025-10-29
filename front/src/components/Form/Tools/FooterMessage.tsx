import type { ChangeEvent, KeyboardEvent } from "react";
import ButtonMessage from "./ButtonMessage";

interface FooterMessageProps {
	newMessage: string;
	setNewMessage: (value: string) => void;
	handleSendMessage: () => void;
	handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
	isSending?: boolean;
	className?: string;
}

export default function FooterMessage({
	newMessage,
	setNewMessage,
	handleSendMessage,
	handleKeyPress,
	isSending = false,
	className = "",
}: FooterMessageProps) {
	return (
		<div
			className={`bg-gray-50 border-t border-gray-200 px-6 py-4 ${className}`}
		>
			<div className="flex flex-col xl:flex-row gap-3 items-start">
				<div className="flex-1 relative w-full">
					<textarea
						value={newMessage}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setNewMessage(e.target.value)
						}
						onKeyDown={handleKeyPress}
						placeholder="Écrivez votre message..."
						maxLength={500}
						rows={3}
						className="w-full px-4 py-3 pr-16 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none resize-none transition-all"
					/>
					<span className="absolute bottom-3 right-3 text-xs text-gray-400">
						{newMessage.length}/500
					</span>
				</div>

				<ButtonMessage
					onClick={handleSendMessage}
					disabled={!newMessage.trim() || isSending}
					label="Envoyer"
				/>
			</div>

			<p className="text-xs text-gray-400 mt-2 text-center">
				Appuyez sur <strong>Entrée</strong> pour envoyer,{" "}
				<strong>Maj + Entrée</strong> pour une nouvelle ligne
			</p>
		</div>
	);
}
