import Input from "../Input";
import Select from "../Select";

interface ClothingFormProps {
	type: string;
	cCharacteristicsType: string;
	setCCharacteristicsType: (val: string) => void;
	cCharacteristicsGender: string;
	setCCharacteristicsGender: (val: string) => void;
	cCharacteristicsMaterial: string;
	setCCharacteristicsMaterial: (val: string) => void;
	cCharacteristicsColor: string;
	setCCharacteristicsColor: (val: string) => void;
	cCharacteristicsSize: { label: string; stock: number }[];
	handleChangeC: (index: number, value: string) => void;
}

export default function ClothingForm({
	type,
	cCharacteristicsType,
	setCCharacteristicsType,
	cCharacteristicsGender,
	setCCharacteristicsGender,
	cCharacteristicsMaterial,
	setCCharacteristicsMaterial,
	cCharacteristicsColor,
	setCCharacteristicsColor,
	cCharacteristicsSize,
	handleChangeC,
}: ClothingFormProps) {
	return (
		<>
			<div>
				<p className="mt-4">{`Caracteristiques technique pour ${type}`}</p>
				<div className="grid grid-cols-2 gap-x-4">
					{/* Type du vêtement */}
					<Select
						label="Type"
						value={cCharacteristicsType}
						onChange={setCCharacteristicsType}
						options={["skirt", "Short", "Polo", "T-shirt"]}
						labels={["Robe", "Short", "Polo", "T-shirt"]}
					/>

					{/* Genre du vêtement  */}
					<div>
						<Select
							label="Genre"
							value={cCharacteristicsGender}
							onChange={setCCharacteristicsGender}
							options={["men", "woman", "unisex"]}
							labels={["Homme", "Femme", "Mixte"]}
						/>
					</div>

					{/* Materiaux du vêtement  */}
					<div className="relative">
						<Input
							htmlFor={"cCharacteristicsMaterial"}
							label={"Materiaux"}
							type={"text"}
							value={cCharacteristicsMaterial}
							onChange={setCCharacteristicsMaterial}
							width="w-full"
						/>
					</div>

					{/* Couleur du vêtement  */}
					<div className="relative">
						<Input
							htmlFor={"cCharacteristicsColor"}
							label={"Couleur"}
							type={"text"}
							value={cCharacteristicsColor}
							onChange={setCCharacteristicsColor}
							width="w-full"
						/>
					</div>
				</div>

				<p className="mt-4 text-sm text-gray-600">
					Quantité d'articles par taille
				</p>
				<div className="grid grid-cols-4 gap-x-4 -mt-3">
					{/* Gestion des tailles de vêtement */}
					{cCharacteristicsSize.map((cCharacteristicsSize, index) => (
						<Input
							key={cCharacteristicsSize.label}
							htmlFor={`size-${cCharacteristicsSize.label}`}
							label={`${cCharacteristicsSize.label} Qté`}
							type="number"
							value={cCharacteristicsSize.stock.toString()}
							onChange={(val) => handleChangeC(index, val)}
							width="w-full"
						/>
					))}
				</div>
			</div>
		</>
	);
}
