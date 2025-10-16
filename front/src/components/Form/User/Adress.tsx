import Input from "../Tools/Input";
import TextArea from "../Tools/TextArea";

interface adressProps {
	title: string;
	streetNumber: string;
	setStreetNumber: (value: string) => void;
	streetName: string;
	setStreetName: (value: string) => void;
	zipcode: string;
	setZipcode: (value: string) => void;
	city: string;
	setCity: (value: string) => void;
	country: string;
	setCountry: (value: string) => void;
	additionalInfo: string;
	setAdditionalInfo: (value: string) => void;
	disabled?: boolean;
}

export default function Adress({
	title,
	streetNumber,
	setStreetNumber,
	streetName,
	setStreetName,
	zipcode,
	setZipcode,
	city,
	setCity,
	country,
	setCountry,
	additionalInfo,
	setAdditionalInfo,
	disabled,
}: adressProps) {
	return (
		<>
			<div>
				<div className="">
					<h3 className="mt-6 font-semibold text-sm">{title}</h3>
					{/* Partie Numéro de rue et type de voie*/}
					<div className="flex -mt-2 gap-x-4">
						{/* Partie Numéro de rue */}
						<Input
							htmlFor={"streetNumber"}
							label={"N°"}
							type={"text"}
							value={streetNumber}
							onChange={setStreetNumber}
							width="w-1/5"
							disabled={disabled}
						/>

						{/* Partie nom de rue */}
						<Input
							htmlFor={"streetName"}
							label={"Nom de la voie"}
							type={"text"}
							value={streetName}
							onChange={setStreetName}
							width="w-full"
							disabled={disabled}
						/>
					</div>

					{/* Partie code postal */}
					<Input
						htmlFor={"zipcode"}
						label={"Code postal"}
						type={"text"}
						value={zipcode}
						onChange={setZipcode}
						width="w-full"
						disabled={disabled}
					/>

					{/* Partie ville */}
					<Input
						htmlFor={"city"}
						label={"Ville"}
						type={"text"}
						value={city}
						onChange={setCity}
						width="w-full"
						disabled={disabled}
					/>

					{/* Partie pays */}
					<Input
						htmlFor={"country"}
						label={"Pays"}
						type={"text"}
						value={country}
						onChange={setCountry}
						width="w-full"
						disabled={disabled}
					/>

					{/* Partie informations complémentaires */}
					<TextArea
						label="Informations complémentaires"
						placeholder="Exemple : étage, code d'accès, particularités..."
						length={additionalInfo.length}
						value={additionalInfo}
						onChange={setAdditionalInfo}
						maxLength={200}
						disabled={disabled}
					/>
				</div>
			</div>
		</>
	);
}
