interface ToogleTypeProps {
	value: "%" | "€";
	onChange: (val: "%" | "€") => void;
}

export default function ToogleType({ value, onChange }: ToogleTypeProps) {
	const isEuro = value === "€";

	return (
		<div>
			<div className="flex items-center gap-2 relative">
				{/* Track */}
				<div className="border border-gray-300 rounded-full w-15 p-1 bg-gradient-to-br from-gray-500 to-gray-100 relative">
					<button
						type="button"
						onClick={() => onChange(isEuro ? "%" : "€")}
						className="h-6 flex items-center rounded-full w-full p-0.5 transition"
						style={{
							background:
								"radial-gradient(ellipse 250% 60% at center, #525252, #2A2A2A)",
						}}
					>
						{/* Knob */}
						<div
							className={`w-5 h-5 bg-gradient-to-tl from-gray-200 to-gray-100 rounded-full shadow-md transform transition ${
								isEuro ? "translate-x-6.5" : ""
							}`}
						/>
						<span
							className={`absolute left-2 w-4 h-4 border-gray-600 bg-gradient-to-br from-gray-400 to-gray-100 rounded-full shadow-md transform transition ${
								isEuro ? "translate-x-6.5" : ""
							}`}
						/>
					</button>
				</div>

				{/* Texte % / € */}
				<div className="-mt-6">
					{!isEuro ? (
						<>
							<span className="absolute text-md left-8 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								%
							</span>
							<span className="absolute text-md left-8 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								%
							</span>
						</>
					) : (
						<>
							<span className="absolute text-md left-4 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								€
							</span>
							<span className="absolute text-md left-4 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								€
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
