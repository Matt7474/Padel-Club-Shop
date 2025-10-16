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
	className?: string; // ajouté pour pouvoir passer des classes depuis le parent
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
	readOnly = false,
	disabled = false,
	className = "",
}: inputProps) {
	// Bloque l'appel onChange si readOnly ou disabled
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (readOnly || disabled) return;
		onChange(e.target.value);
	};

	// Classe visuelle selon l'état
	const stateClasses = disabled
		? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
		: readOnly
			? "cursor-not-allowed bg-gray-100 text-gray-500"
			: "bg-white text-black";

	return (
		<div className={`relative flex flex-col mt-4 ${width} ${className}`}>
			<label htmlFor={htmlFor} className="absolute text-xs text-gray-500 pl-1">
				{label}
			</label>
			<input
				id={htmlFor}
				type={type}
				className={`border h-10 pl-2 pt-3 w-full ${stateClasses}`}
				value={value}
				onChange={handleChange}
				required={required}
				pattern={pattern}
				autoComplete="new-password"
				min={min}
				max={max}
				onBlur={onBlur}
				readOnly={type === "date" ? true : readOnly}
				aria-readonly={readOnly}
				disabled={disabled}
			/>
			{suffixe && (
				<span className="absolute text-md top-0 pt-4 right-2 pl-2 border-l">
					{suffixe}
				</span>
			)}
		</div>
	);
}
