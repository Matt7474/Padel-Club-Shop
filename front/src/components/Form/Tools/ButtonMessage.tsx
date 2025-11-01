import { Send } from "lucide-react";

interface ButtonMessageProps {
	onClick: () => void;
	disabled?: boolean;
	label?: string;
	className?: string;
}

export default function ButtonMessage({
	onClick,
	disabled = false,
	label = "Envoyer",
	className = "",
}: ButtonMessageProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`h-10 px-6 w-full xl:w-40 bg-linear-to-br from-pink-500 to-purple-600 
				hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed 
				cursor-pointer text-white font-semibold rounded-lg transition-all 
				shadow-lg hover:shadow-xl transform hover:scale-105 
				disabled:transform-none flex items-center gap-2 justify-center ${className}`}
		>
			<Send className="w-5 h-5" />
			<span>{label}</span>
		</button>
	);
}
