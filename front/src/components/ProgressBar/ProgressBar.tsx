interface ProgressBarProps {
	progress: number; // Montant actuel du panier en €
}

export default function ProgressBar({ progress }: ProgressBarProps) {
	const max = 69;
	const percent = Math.min((progress / max) * 100, 100);
	const remaining = Math.max(max - progress, 0);

	return (
		<div className="mt-0">
			{/* Barre de progression */}
			<div className="flex">
				<div className="w-full px-0.5 h-5 bg-gray-800 rounded-md overflow-hidden">
					<div
						className="h-4 mt-0.5  rounded-sm transition-all duration-300"
						style={{
							width: `${percent}%`,
							backgroundImage: `
								linear-gradient(to right, #ec4899, #f43f5e, #facc15),
								repeating-linear-gradient(
									295deg,
									rgba(255, 255, 255, 0.25),
									rgba(255, 255, 255, 0.25) 4px,
									transparent 6px,
									transparent 12px
								)
							`,
							backgroundBlendMode: "overlay",
						}}
					/>
				</div>
			</div>

			<p className="text-sm italic text-gray-700 mt-1">
				{remaining > 0
					? `Plus que ${remaining.toFixed(2)} € pour bénéficier de la livraison offerte`
					: "Livraison offerte activée !"}
			</p>

			{/* Ligne “Livraison” */}
			<div className="flex mx-auto mt-2 -mb-2 justify-between text-gray-700">
				<p className="text-lg font-semibold">Livraison :</p>
				<p
					className={`font-semibold text-xl transition-colors duration-300 ${
						progress >= max ? "text-green-600" : "text-gray-800"
					}`}
				>
					{progress === 0 ? "-" : progress >= max ? "OFFERTE" : "6,90 €"}
				</p>
			</div>
		</div>
	);
}
