interface SelectProps<T extends string | number> {
	label?: string;
	value: T;
	options: T[];
	labels?: string[];
	onChange: (value: T) => void;
	disabled?: boolean;
}

export default function Select<T extends string | number>({
	label,
	value,
	options,
	labels,
	onChange,
	disabled,
}: SelectProps<T>) {
	return (
		<div className="relative">
			<select
				value={String(value ?? "")}
				onChange={(e) => {
					const raw = e.target.value;
					const val = (typeof options[0] === "number" ? Number(raw) : raw) as T;
					onChange(val);
				}}
				className={`border mt-4 h-10 pt-3 pl-1 w-full bg-white cursor-pointer ${
					disabled ? "opacity-50 cursor-not-allowed" : ""
				}`}
				disabled={disabled}
				required
			>
				<option value=""></option>
				{options.map((option, idx) => (
					<option key={option} value={String(option)}>
						{labels?.[idx] || option}
					</option>
				))}
			</select>

			{label && (
				<p className="absolute text-gray-500 text-xs top-4 left-1 cursor-pointer">
					{label}
				</p>
			)}
		</div>
	);
}
