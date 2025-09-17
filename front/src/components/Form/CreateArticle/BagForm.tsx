import Input from "../Tools/Input";

interface BagFormProps {
	type: string;
	bCharacteristicsWeight: string;
	setBCharacteristicsWeight: (val: string) => void;
	bCharacteristicsType: string;
	setBCharacteristicsType: (val: string) => void;
	bCharacteristicsVolume: string;
	setBCharacteristicsVolume: (val: string) => void;
	bCharacteristicsDimensions: string;
	setBCharacteristicsDimensions: (val: string) => void;
	bCharacteristicsMaterial: string;
	setBCharacteristicsMaterial: (val: string) => void;
	bCharacteristicsColor: string;
	setBCharacteristicsColor: (val: string) => void;
	bCharacteristicsCompartment: string;
	setBCharacteristicsCompartment: (val: string) => void;
}

export default function BagForm({
	type,
	bCharacteristicsWeight,
	setBCharacteristicsWeight,
	bCharacteristicsType,
	setBCharacteristicsType,
	bCharacteristicsVolume,
	setBCharacteristicsVolume,
	bCharacteristicsDimensions,
	setBCharacteristicsDimensions,
	bCharacteristicsMaterial,
	setBCharacteristicsMaterial,
	bCharacteristicsColor,
	setBCharacteristicsColor,
	bCharacteristicsCompartment,
	setBCharacteristicsCompartment,
}: BagFormProps) {
	return (
		<>
			<div>
				<p className="mt-4">{`Caracteristiques technique pour ${type}`}</p>
				<div className="grid grid-cols-3 gap-x-4">
					{/* Poids du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsWeight"}
							label={"Poids"}
							type={"text"}
							value={bCharacteristicsWeight}
							onChange={setBCharacteristicsWeight}
							width="w-full"
							suffixe="g"
						/>
					</div>

					{/* Type du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsType"}
							label={"Type de sac"}
							type={"text"}
							value={bCharacteristicsType}
							onChange={setBCharacteristicsType}
							width="w-full"
						/>
					</div>

					{/* Volume du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsVolume"}
							label={"Volume"}
							type={"text"}
							value={bCharacteristicsVolume}
							onChange={setBCharacteristicsVolume}
							width="w-full"
							suffixe="L"
						/>
					</div>

					{/* Dimensions du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsDimensions"}
							label={"Dimensions"}
							type={"text"}
							value={bCharacteristicsDimensions}
							onChange={setBCharacteristicsDimensions}
							width="w-full"
							suffixe="cm"
						/>
					</div>

					{/* Materiaux du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsMaterial"}
							label={"Materiaux"}
							type={"text"}
							value={bCharacteristicsMaterial}
							onChange={setBCharacteristicsMaterial}
							width="w-full"
						/>
					</div>

					{/* Couleur du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsColor"}
							label={"Couleur"}
							type={"text"}
							value={bCharacteristicsColor}
							onChange={setBCharacteristicsColor}
							width="w-full"
						/>
					</div>

					{/* Compartiments du sac */}
					<div className="relative">
						<Input
							htmlFor={"bCharacteristicsCompartment"}
							label={"Compartiments"}
							type={"text"}
							value={bCharacteristicsCompartment}
							onChange={setBCharacteristicsCompartment}
							width="w-full"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
