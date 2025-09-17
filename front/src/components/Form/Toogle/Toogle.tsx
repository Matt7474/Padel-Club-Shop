interface ToogleProps {
	checked: boolean;
	onChange: (value: boolean) => void;
}

export default function Toogle({ checked, onChange }: ToogleProps) {
	return (
		<div>
			<div className="flex items-center gap-4 relative">
				<span>Appliquer une promo à cet article ?</span>

				{/* Track du toggle */}
				<div className="border border-gray-300 rounded-full w-17 p-1 bg-gradient-to-br from-gray-500 to-gray-100 relative">
					<button
						type="button"
						onClick={() => onChange(!checked)}
						className="h-6 flex items-center rounded-full w-full p-0.5 transition"
						style={{
							background:
								"radial-gradient(ellipse 250% 60% at center, #525252, #2A2A2A)",
						}}
					>
						{/* Knob */}
						<div
							className={`w-5 h-5 bg-gradient-to-tl from-gray-200 to-gray-100 rounded-full shadow-md transform transition ${
								checked ? "translate-x-8.5" : ""
							}`}
						/>
						<span
							className={`absolute left-2 w-4 h-4 border-gray-600 bg-gradient-to-br from-gray-400 to-gray-100 rounded-full shadow-md transform transition ${
								checked ? "translate-x-8.5" : ""
							}`}
						/>
					</button>
				</div>

				{/* Texte OFF / ON */}
				<div className="-mt-5">
					{!checked ? (
						<>
							<span className="absolute text-sm left-75.5 text-red-500 [text-shadow:0_0_8px_rgba(239,68,68,1),0_0_20px_rgba(239,68,68,0.9)]">
								NO
							</span>
							<span className="absolute text-sm left-75.5 text-red-500 [text-shadow:0_0_8px_rgba(239,68,68,1),0_0_20px_rgba(239,68,68,0.9)]">
								NO
							</span>
						</>
					) : (
						<>
							<span className="absolute text-sm left-70.5 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								YES
							</span>
							<span className="absolute text-sm left-70.5 text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,1),0_0_20px_rgba(34,197,94,0.9)]">
								YES
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
