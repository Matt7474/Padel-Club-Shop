interface RatingBarProps {
	value: number;
	max?: number;
}

export default function RatingBar({ value, max = 10 }: RatingBarProps) {
	const ratings = Array.from({ length: max }, (_, i) => ({
		id: i + 1,
		filled: i < value,
	}));

	return (
		<div className="flex justify-center mt-1">
			{ratings.map((r) => (
				<div
					key={r.id}
					className={`w-3 h-5 mx-[2px] rounded-sm  ${
						r.filled ? "bg-green-500" : "bg-gray-300"
					}`}
				/>
			))}
		</div>
	);
}
