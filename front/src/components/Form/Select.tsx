interface SelectProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	labels: string[];
}

export default function Select({
	label,
	value,
	onChange,
	options,
	labels,
}: SelectProps) {
	return (
		<div className="relative">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="border mt-4 h-10 pt-3 pl-2 w-full bg-white"
				required
			>
				<option value="" className="text-gray-500"></option>
				{options.map((option, idx) => (
					<option key={option} value={option}>
						{labels[idx] || option}
					</option>
				))}
			</select>
			<p className="absolute text-gray-500 text-xs top-4 left-1">{label}</p>
		</div>
	);
}
