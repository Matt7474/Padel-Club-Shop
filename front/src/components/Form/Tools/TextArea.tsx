interface TextAreaProps {
	label: string;
	placeholder?: string;
	length: number;
	border?: string;
	height?: string;
	value: string;
	maxLength?: number;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export default function TextArea({
	label,
	placeholder,
	length,
	height = "h-24",
	value,
	onChange,
	maxLength,
	disabled = false,
}: TextAreaProps) {
	const stateClasses = disabled
		? "cursor-not-allowed bg-gray-100 text-gray-400"
		: "bg-white text-black";

	return (
		<div className="relative flex flex-col mt-4">
			<div className="relative w-full">
				<label
					htmlFor="additionalInfo"
					className="absolute text-xs text-gray-500 pl-1 z-10"
				>
					{label}
				</label>

				<span className="absolute text-xs text-gray-500 right-1 z-10">
					{length} / {maxLength}
				</span>

				<textarea
					id="additionalInfo"
					value={value}
					onChange={(e) => !disabled && onChange(e.target.value)}
					className={`border p-2 pt-6 resize-none w-full ${height} ${stateClasses}`}
					placeholder={placeholder}
					maxLength={maxLength}
					disabled={disabled}
				/>
			</div>
		</div>
	);
}
