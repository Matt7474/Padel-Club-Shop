interface textAreaProps {
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
	border,
	height,
	value,
	onChange,
	maxLength,
	disabled,
}: textAreaProps) {
	return (
		<>
			<div className="relative flex flex-col mt-4">
				<div className="relative w-full">
					<label
						htmlFor="additionalInfo"
						className="absolute text-xs text-gray-500 pl-1 overflow-hidden z-2"
					>
						{label}
					</label>

					<span className="absolute text-xs text-gray-500 right-1 overflow-hidden z-2">
						{length} / {maxLength}
					</span>
					<div
						className={`w-full bg-white h-5 absolute  z-1 border-x-1 border-t-1 ${border}`}
					></div>

					<textarea
						id="additionalInfo"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className={`bg-white border h-25 ${height} p-2 pt-6 resize-none w-full`}
						placeholder={placeholder}
						maxLength={maxLength}
						disabled={disabled}
					/>
				</div>
			</div>
		</>
	);
}
