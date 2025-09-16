interface TechRatingsProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
}

export default function TechRatings({
	label,
	value,
	onChange,
}: TechRatingsProps) {
	return (
		<div className="relative">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="border mt-4 h-10 pt-3 pl-2 w-full"
			>
				<option value="" className="text-gray-500"></option>
				{Array.from({ length: 10 }, (_, i) => {
					const val = (i + 1).toString();
					return (
						<option key={val} value={val}>
							{val}
						</option>
					);
				})}
			</select>
			<p className="absolute text-gray-500 text-xs top-4 left-1">{label}</p>
		</div>
	);
}
