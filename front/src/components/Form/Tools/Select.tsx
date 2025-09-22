import React from "react";

interface SelectProps<T extends string | number> {
	label?: string;
	value: T;
	options: T[];
	labels?: string[];
	onChange: (value: T) => void;
}

export default function Select<T extends string | number>({
	label,
	value,
	options,
	labels,
	onChange,
}: SelectProps<T>) {
	return (
		<div className="relative">
			<select
				value={value}
				onChange={(e) => {
					const raw = e.target.value;
					// Si les options sont number[], on cast en number
					const val = (typeof options[0] === "number" ? Number(raw) : raw) as T;
					onChange(val);
				}}
				className="border mt-4 h-10 pt-3 pl-2 w-full bg-white cursor-pointer"
				required
			>
				<option value="" className="text-gray-500"></option>
				{options.map((option, idx) => (
					<option key={option} value={option}>
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
