interface buttonProps {
	type: "button" | "submit" | "reset";
	onClick?: () => void;
	buttonText: string;
}

export default function Button({ type, onClick, buttonText }: buttonProps) {
	return (
		<>
			<div>
				<button
					type={type}
					onClick={onClick}
					className="w-full xl:w-1/3  bg-green-500 text-white font-semibold p-2 rounded-sm mt-6 cursor-pointer"
				>
					{buttonText}
				</button>
			</div>
		</>
	);
}
