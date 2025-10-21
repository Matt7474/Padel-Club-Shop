import Input from "../Tools/Input";
import Select from "../Tools/Select";

interface ShoesProps {
	type: string;
	sCharacteristicsWeight: string;
	setSCharacteristicsWeight: (value: string) => void;
	sCharacteristicsColor: string;
	setSCharacteristicsColor: (value: string) => void;
	sCharacteristicsSole: string;
	setSCharacteristicsSole: (value: string) => void;
	sCharacteristicsGender: string;
	setSCharacteristicsGender: (value: string) => void;
	sCharacteristicsSize: { label: string; stock: number }[];
	handleChangeS: (index: number, value: string) => void;
}

export default function ShoesForm({
	type,
	sCharacteristicsWeight,
	setSCharacteristicsWeight,
	sCharacteristicsColor,
	setSCharacteristicsColor,
	sCharacteristicsSole,
	setSCharacteristicsSole,
	sCharacteristicsGender,
	setSCharacteristicsGender,
	sCharacteristicsSize,
	handleChangeS,
}: ShoesProps) {
	console.log("sCharacteristicsSize", sCharacteristicsSize);

	return (
		<>
			<div>
				<p className="mt-4">{`Caracteristiques technique pour ${type}`}</p>
				<div className="grid grid-cols-2 gap-x-4">
					{/* Poids des chaussures */}
					<div className="relative">
						<Input
							htmlFor={"sCharacteristicsWeight"}
							label={"Poids"}
							type={"text"}
							value={sCharacteristicsWeight}
							onChange={setSCharacteristicsWeight}
							width="w-full"
							suffixe="g"
						/>
					</div>

					{/* Couleur des chaussures */}
					<div className="relative">
						<Input
							htmlFor={"sCharacteristicsColor"}
							label={"Couleur"}
							type={"text"}
							value={sCharacteristicsColor}
							onChange={setSCharacteristicsColor}
							width="w-full"
						/>
					</div>

					{/* Semelle des chaussures */}
					<div className="relative">
						<Select
							label="Type"
							value={sCharacteristicsSole}
							onChange={setSCharacteristicsSole}
							options={["hybrid", "clay", "padel", "all-court"]}
							labels={["hybride", "terre battue", "padel", "tous terrains"]}
						/>
					</div>

					{/* Genre des chaussures */}
					<div>
						<Select
							label="Genre"
							value={sCharacteristicsGender}
							onChange={setSCharacteristicsGender}
							options={["men", "woman", "unisex"]}
							labels={["Homme", "Femme", "Mixte"]}
						/>
					</div>
				</div>

				<p className="mt-4 text-sm text-gray-600">
					Quantité d'articles par taille
				</p>
				<div className="grid grid-cols-4 gap-x-4 -mt-3">
					{/* Gestion des tailles de vêtement */}
					{sCharacteristicsSize.map((sCharacteristicsSize, index) => (
						<Input
							key={sCharacteristicsSize.label}
							htmlFor={`size-${sCharacteristicsSize.label}`}
							label={`${sCharacteristicsSize.label} Qté`}
							type="number"
							value={sCharacteristicsSize.stock.toString()}
							onChange={(val) => handleChangeS(index, val)}
							width="w-full"
						/>
					))}
				</div>
			</div>
		</>
	);
}
