interface ButtonProps {
	type: "button" | "submit" | "reset";
	onClick?: () => void;
	buttonText: string;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	disabled?: boolean;
	bgColor?: string;
}

export default function Button({
	type,
	onClick,
	buttonText,
	onMouseEnter,
	onMouseLeave,
	disabled = false,
	bgColor = "bg-green-500",
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			disabled={disabled}
			className={`w-full p-2 mt-6 font-semibold rounded-sm text-white hover:brightness-90 ${
				disabled
					? "bg-gray-400 cursor-not-allowed"
					: `${bgColor} cursor-pointer`
			}`}
		>
			{buttonText}
		</button>
	);
}
