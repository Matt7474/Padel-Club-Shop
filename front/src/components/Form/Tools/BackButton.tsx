interface BackButtonProps {
	onClick?: () => void;
	fromUserDetails?: boolean;
}

export default function BackButton({
	onClick,
	fromUserDetails = false,
}: BackButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-2 mb-0 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer mt-4 xl:mt-0"
		>
			<img
				src="/icons/arrow.svg"
				alt="fleche retour"
				className="w-4 rotate-180"
			/>
			{fromUserDetails ? "Retour à l'utilisateur" : "Retour à la liste"}
		</button>
	);
}
