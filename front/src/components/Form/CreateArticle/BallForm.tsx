import Input from "../Input";

interface BallFormProps {
	type: string;
	ballCharacteristicsWeight: string;
	setBallCharacteristicsWeight: (val: string) => void;
	ballCharacteristicsDiameter: string;
	setBallCharacteristicsDiameter: (val: string) => void;
	ballCharacteristicsRebound: string;
	setBallCharacteristicsRebound: (val: string) => void;
	ballCharacteristicsPressure: string;
	setBallCharacteristicsPressure: (val: string) => void;
	ballCharacteristicsMaterial: string;
	setBallCharacteristicsMaterial: (val: string) => void;
	ballCharacteristicsColor: string;
	setBallCharacteristicsColor: (val: string) => void;
	ballCharacteristicsType: string;
	setBallCharacteristicsType: (val: string) => void;
}

export default function BallForm({
	type,
	ballCharacteristicsWeight,
	setBallCharacteristicsWeight,
	ballCharacteristicsDiameter,
	setBallCharacteristicsDiameter,
	ballCharacteristicsRebound,
	setBallCharacteristicsRebound,
	ballCharacteristicsPressure,
	setBallCharacteristicsPressure,
	ballCharacteristicsMaterial,
	setBallCharacteristicsMaterial,
	ballCharacteristicsColor,
	setBallCharacteristicsColor,
	ballCharacteristicsType,
	setBallCharacteristicsType,
}: BallFormProps) {
	return (
		<>
			<div>
				<p className="mt-4">{`Caracteristiques technique pour ${type}`}</p>
				<div className="grid grid-cols-3 gap-x-4">
					{/* Poids de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsWeight"}
							label={"Poids"}
							type={"text"}
							value={ballCharacteristicsWeight}
							onChange={setBallCharacteristicsWeight}
							width="w-full"
							suffixe="g"
						/>
					</div>

					{/* Diamètre de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsDiameter"}
							label={"Diamètre"}
							type={"text"}
							value={ballCharacteristicsDiameter}
							onChange={setBallCharacteristicsDiameter}
							width="w-full"
							suffixe="cm"
						/>
					</div>

					{/* Rebond de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsRebound"}
							label={"Rebond"}
							type={"text"}
							value={ballCharacteristicsRebound}
							onChange={setBallCharacteristicsRebound}
							width="w-full"
						/>
					</div>

					{/* Préssion de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsPressure"}
							label={"Préssion"}
							type={"text"}
							value={ballCharacteristicsPressure}
							onChange={setBallCharacteristicsPressure}
							width="w-full"
							suffixe="kg/cm²"
						/>
					</div>

					{/* Matière de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsMaterial"}
							label={"Matière"}
							type={"text"}
							value={ballCharacteristicsMaterial}
							onChange={setBallCharacteristicsMaterial}
							width="w-full"
						/>
					</div>

					{/* Couleur de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsColor"}
							label={"Couleur"}
							type={"text"}
							value={ballCharacteristicsColor}
							onChange={setBallCharacteristicsColor}
							width="w-full"
						/>
					</div>

					{/* Type de la balle */}
					<div className="relative">
						<Input
							htmlFor={"ballCharacteristicsType"}
							label={"Type"}
							type={"text"}
							value={ballCharacteristicsType}
							onChange={setBallCharacteristicsType}
							width="w-full"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
