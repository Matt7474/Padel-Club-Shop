interface inputProps {
	htmlFor: string;
	label: string;
	type: string;
	value: string;
	onChange: (value: string) => void;
	pattern?: string;
}

export default function Input({
	htmlFor,
	label,
	type,
	value,
	onChange,
	pattern,
}: inputProps) {
	return (
		<>
			<div className="relative flex flex-col mt-4 ">
				<label
					htmlFor={htmlFor}
					className="absolute text-xs text-gray-500 pl-1"
				>
					{label}
				</label>
				<input
					id={htmlFor}
					type={type}
					className="bg-white border h-10 pl-3 pt-3"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					required
					pattern={pattern}
					autoComplete="new-password"
				/>
			</div>
		</>
	);
}
