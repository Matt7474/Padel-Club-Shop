import { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
	const [isChecked, setIsChecked] = useState(false);

	const handleCheckConditions = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
	};
	return (
		<>
			<div>
				{/* Partie nom */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="lastname"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Nom
					</label>
					<input
						type="text"
						id="lastname"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				{/* Partie prénom */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="firstname"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Prénom
					</label>
					<input
						type="text"
						id="firstname"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				<h3 className="mt-6 font-semibold text-sm">
					Informations de livraison
				</h3>
				{/* Partie Numéro de rue et type de voie*/}
				<div className="flex -mt-2 gap-x-4">
					{/* Partie Numéro de rue */}
					<div className="relative flex flex-col mt-4 w-1/5">
						<label
							htmlFor="streetNumber"
							className="absolute text-xs text-gray-500 pl-1"
						>
							N°
						</label>
						<input
							type="number"
							id="streetNumber"
							className="bg-white border h-10 pl-3 pt-3"
						/>
					</div>
					{/* Partie Type de voie */}
					<div className="relative flex flex-col mt-4 w-4/5">
						<label
							htmlFor="streetType"
							className="absolute text-xs text-gray-500 pl-1"
						>
							Type
						</label>
						<select
							id="streetType"
							name="Type"
							className="border h-10 text-center bg-white"
							required
						>
							<option value="">-- Sélectionnez --</option>
							<option value="rue">Rue</option>
							<option value="avenue">Avenue</option>
							<option value="boulevard">Boulevard</option>
							<option value="allee">Allée</option>
							<option value="impasse">Impasse</option>
							<option value="chemin">Chemin</option>
							<option value="route">Route</option>
							<option value="place">Place</option>
							<option value="cours">Cours</option>
							<option value="passage">Passage</option>
							<option value="quai">Quai</option>
							<option value="square">Square</option>
							<option value="esplanade">Esplanade</option>
							<option value="promenade">Promenade</option>
							<option value="sentier">Sentier</option>
							<option value="residence">Résidence</option>
							<option value="lotissement">Lotissement</option>
						</select>
					</div>
				</div>
				{/* Partie nom de rue */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="streetName"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Nom de rue
					</label>
					<input
						type="text"
						id="streetName"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				{/* Partie code postal */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="zipCode"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Code postal
					</label>
					<input
						type="text"
						id="zipCode"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				{/* Partie ville */}
				<div className="relative flex flex-col mt-4 ">
					<label htmlFor="city" className="absolute text-xs text-gray-500 pl-1">
						Ville
					</label>
					<input
						type="text"
						id="city"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				{/* Partie pays */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="country"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Pays
					</label>
					<input
						type="text"
						id="country"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				{/* Partie téléphone */}
				<div className="relative flex flex-col mt-4 ">
					<label
						htmlFor="phone"
						className="absolute text-xs text-gray-500 pl-1"
					>
						Téléphone
					</label>
					<input
						type="number"
						id="phone"
						className="bg-white border h-10 pl-3 pt-3"
					/>
				</div>

				<div className="flex items-start gap-2 mt-4">
					<input
						type="checkbox"
						id="accept"
						name="accept"
						required
						className="mt-1"
						checked={isChecked}
						onChange={handleCheckConditions}
					/>
					<label htmlFor="accept" className="text-sm text-gray-700">
						J'ai lu et j'accepte les{" "}
						<Link to="/conditions-generales-de-vente" className="underline">
							conditions d'utilisation
						</Link>{" "}
						et la{" "}
						<Link to="/politique-de-confidentialite" className="underline">
							politique de confidentialité
						</Link>
						.
					</label>
				</div>
			</div>
		</>
	);
}
