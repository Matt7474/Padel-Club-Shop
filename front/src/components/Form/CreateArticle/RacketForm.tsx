import Input from "../Tools/Input";
import Select from "../Tools/Select";
import TechRatings from "../Tools/TechRatings";

interface RacketFormProps {
	type: string;
	rCharacteristicsWeight: string;
	setRCharacteristicsWeight: (val: string) => void;
	rCharacteristicsColor: string;
	setRCharacteristicsColor: (val: string) => void;
	rCharacteristicsShape: string;
	setRCharacteristicsShape: (val: string) => void;
	rCharacteristicsFoam: string;
	setRCharacteristicsFoam: (val: string) => void;
	rCharacteristicsSurface: string;
	setRCharacteristicsSurface: (val: string) => void;
	rCharacteristicsLevel: string;
	setRCharacteristicsLevel: (val: string) => void;
	rCharacteristicsGender: string;
	setRCharacteristicsGender: (val: string) => void;
	rcharacteristicsManiability: number;
	setRCharacteristicsManiability: (val: number) => void;
	rCharacteristicsPower: number;
	setRCharacteristicsPower: (val: number) => void;
	rCharacteristicsComfort: number;
	setRCharacteristicsComfort: (val: number) => void;
	rCharacteristicsSpin: number;
	setRCharacteristicsSpin: (val: number) => void;
	rCharacteristicsTolerance: number;
	setRCharacteristicsTolerance: (val: number) => void;
	rCharacteristicsControl: number;
	setRCharacteristicsControl: (val: number) => void;
}

export default function RacketForm({
	type,
	rCharacteristicsWeight,
	setRCharacteristicsWeight,
	rCharacteristicsColor,
	setRCharacteristicsColor,
	rCharacteristicsShape,
	setRCharacteristicsShape,
	rCharacteristicsFoam,
	setRCharacteristicsFoam,
	rCharacteristicsSurface,
	setRCharacteristicsSurface,
	rCharacteristicsLevel,
	setRCharacteristicsLevel,
	rCharacteristicsGender,
	setRCharacteristicsGender,
	rcharacteristicsManiability,
	setRCharacteristicsManiability,
	rCharacteristicsPower,
	setRCharacteristicsPower,
	rCharacteristicsComfort,
	setRCharacteristicsComfort,
	rCharacteristicsSpin,
	setRCharacteristicsSpin,
	rCharacteristicsTolerance,
	setRCharacteristicsTolerance,
	rCharacteristicsControl,
	setRCharacteristicsControl,
}: RacketFormProps) {
	return (
		<>
			<div className="mt-4">
				<div>
					<p>{`Caracteristiques technique pour ${type}`}</p>
					<div className="grid grid-cols-2 gap-4 relative">
						{/* Poids de la raquette  */}
						<Input
							htmlFor={"rCharacteristicsWeight"}
							label={"Poids"}
							type={"text"}
							value={rCharacteristicsWeight}
							onChange={setRCharacteristicsWeight}
							width="w-full"
							suffixe="g"
						/>

						{/* Couleur de la raquette  */}
						<Input
							htmlFor={"rCharacteristicsColor"}
							label={"Couleur"}
							type={"text"}
							value={rCharacteristicsColor}
							onChange={setRCharacteristicsColor}
							width="w-full"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Forme de la raquette  */}
						<Select
							label="Forme"
							value={rCharacteristicsShape}
							onChange={setRCharacteristicsShape}
							options={["teardrop", "diamond", "spherical"]}
							labels={["Goutte d'eau", "Diamand", "sphérique"]}
						/>

						{/* Mousse de la raquette  */}
						<Input
							htmlFor={"rCharacteristicsFoam"}
							label={"Mousse"}
							type={"text"}
							value={rCharacteristicsFoam}
							onChange={setRCharacteristicsFoam}
							width="w-full"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Surface de la raquette  */}
						<Input
							htmlFor={"rCharacteristicsSurface"}
							label={"Surface"}
							type={"text"}
							value={rCharacteristicsSurface}
							onChange={setRCharacteristicsSurface}
							width="w-full"
						/>

						{/* Niveau de la raquette  */}
						<Select
							label="Niveau"
							value={rCharacteristicsLevel}
							onChange={setRCharacteristicsLevel}
							options={["beginner", "intermediate", "advanced", "allLevels"]}
							labels={["Débutant", "Intermédiaire", "Avancé", "Tout niveau"]}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Genre de la raquette  */}
						<Select
							label="Genre"
							value={rCharacteristicsGender}
							onChange={setRCharacteristicsGender}
							options={["men", "woman", "unisex"]}
							labels={["Homme", "Femme", "Mixte"]}
						/>
					</div>
				</div>
				<div className="border-b border-gray-400 mt-4 "></div>
				<div className="mt-4 ">
					<p>Notes technique</p>
					<div className="grid grid-cols-3 gap-4">
						{/* Maniabilité de la raquette  */}
						<TechRatings
							label="Maniabilité"
							value={rcharacteristicsManiability}
							onChange={setRCharacteristicsManiability}
						/>

						{/* Puissance de la raquette  */}
						<TechRatings
							label="Puissance"
							value={rCharacteristicsPower}
							onChange={setRCharacteristicsPower}
						/>

						{/* Confort de la raquette  */}
						<TechRatings
							label="Confort"
							value={rCharacteristicsComfort}
							onChange={setRCharacteristicsComfort}
						/>

						{/* Effet de la raquette  */}
						<TechRatings
							label="Effet"
							value={rCharacteristicsSpin}
							onChange={setRCharacteristicsSpin}
						/>

						{/* Tolérance de la raquette  */}
						<TechRatings
							label="Tolérance"
							value={rCharacteristicsTolerance}
							onChange={setRCharacteristicsTolerance}
						/>

						{/* Contrôle de la raquette  */}
						<TechRatings
							label="Contrôle"
							value={rCharacteristicsControl}
							onChange={setRCharacteristicsControl}
						/>
					</div>
				</div>
				<div className="border-b border-gray-400 mt-4 "></div>
			</div>
		</>
	);
}
