interface inputProps {
	width?: string;
	htmlFor: string;
	label: string;
	type: string;
	value: string | number;
	onChange: (value: string) => void;
	required?: boolean;
	pattern?: string;
	min?: string;
	max?: number;
	suffixe?: string;
	onBlur?: () => void;
	readOnly?: boolean;
	disabled?: boolean;
}

export default function Input({
	width,
	htmlFor,
	label,
	type,
	value,
	onChange,
	required = true,
	pattern,
	min,
	max,
	suffixe,
	onBlur,
	readOnly,
	disabled,
}: inputProps) {
	return (
		<>
			<div className={`relative flex flex-col mt-4 ${width}`}>
				<label
					htmlFor={htmlFor}
					className="absolute text-xs text-gray-500 pl-1"
				>
					{label}
				</label>
				<input
					id={htmlFor}
					type={type}
					// className="bg-white border h-10 pl-2 pt-3"
					className={`bg-white border h-10 pl-2 pt-3 cursor-pointer ${
						disabled ? "opacity-50 cursor-not-allowed" : ""
					}`}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					required={required}
					pattern={pattern}
					autoComplete="new-password"
					min={min}
					max={max}
					onBlur={onBlur}
					readOnly={type === "date" ? true : readOnly}
				/>
				{suffixe && (
					<span className="absolute text-md top-0 pt-4 right-2 pl-2 border-l">
						{suffixe}
					</span>
				)}
			</div>
		</>
	);
}
