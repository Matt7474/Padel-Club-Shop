import { useState } from "react";

export default function Sizes() {
	const [sizes, setSizes] = useState({
		XS: 0,
		S: 0,
		M: 0,
		L: 0,
		XL: 0,
	});

	const handleChange = (size: string, value: number) => {
		setSizes((prev) => ({
			...prev,
			[size]: value,
		}));
	};

	return (
		<div>
			{Object.entries(sizes).map(([size, value]) => (
				<div key={size}>
					<label htmlFor="size">{size}</label>
					<input
						id="size"
						type="number"
						value={value}
						onChange={(e) => handleChange(size, Number(e.target.value))}
					/>
				</div>
			))}
			<pre>{JSON.stringify(sizes, null, 2)}</pre>
		</div>
	);
}
