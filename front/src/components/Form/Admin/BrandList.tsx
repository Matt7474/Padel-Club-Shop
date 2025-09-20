import { useState } from "react";
import data from "../../../../data/dataTest.json";
import Button from "../Tools/Button";
import Input from "../Tools/Input";
import { useSortableData } from "../Tools/useSortableData";

interface Brand {
	name: string;
	logo: string;
}

export default function BrandList() {
	const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

	// Création de la liste unique de marques
	const brandsMap = new Map<string, Brand>(
		data.articles.map((a) => [a.brand.name, a.brand]),
	);
	const brands = Array.from(brandsMap.values());

	// Hook pour le tri
	const {
		items: sortedBrands,
		requestSort,
		sortConfig,
	} = useSortableData(brands);

	const getClassNamesFor = (name: keyof Brand) => {
		if (!sortConfig) return;
		return sortConfig.key === name
			? sortConfig.direction === "asc"
				? "▲"
				: "▼"
			: undefined;
	};

	const handleBrandClick = (brand: Brand) => setSelectedBrand(brand);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !selectedBrand) return;
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				setSelectedBrand({ ...selectedBrand, logo: reader.result });
			}
		};
		reader.readAsDataURL(file);
	};

	const handleBrandSubmit = () => {
		console.log("Marque modifiée :", selectedBrand);
		setSelectedBrand(null);
	};

	const handleDelete = () => {
		console.log("handleDelete");
	};

	const handleClick = () => setSelectedBrand(null);

	return (
		<div>
			{selectedBrand === null && (
				<div>
					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Liste des Marques
					</h2>

					<div className="grid grid-cols-[2fr_3fr_1fr] bg-gray-300 mt-4 mb-2 text-sm">
						<button
							type="button"
							className="border-b pl-1 cursor-pointer"
							onClick={() => requestSort("name")}
						>
							NOM {getClassNamesFor("name")}
						</button>
						<p className="border-b text-center cusror-pointer">LOGO</p>
						<p className="border-b text-center cusror-pointer">NB.ART</p>
					</div>

					{sortedBrands.map((brand) => (
						<div key={brand.name}>
							<button
								type="button"
								onClick={() => handleBrandClick(brand)}
								className="cursor-pointer w-full text-left hover:bg-gray-300"
							>
								<div className="grid grid-cols-[2fr_3fr_1fr] items-center">
									<p className="pl-1 text-center">{brand.name}</p>
									<img
										src={brand.logo || "/icons/default.svg"}
										alt={brand.name || "Image par défaut"}
										className="border-x w-full px-1 h-10"
									/>
									<p className="text-center">
										{
											data.articles.filter((a) => a.brand.name === brand.name)
												.length
										}
									</p>
								</div>
								<div className="w-full border-b border-gray-200"></div>
							</button>
						</div>
					))}
				</div>
			)}

			{selectedBrand && (
				<div>
					<button
						type="button"
						onClick={handleClick}
						className="flex my-4 cursor-pointer"
					>
						<img
							src="/icons/arrow.svg"
							alt="fleche retour"
							className="w-4 rotate-180"
						/>
						Retour
					</button>

					<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
						Modification de la marque {selectedBrand.name}
					</h2>

					<form onSubmit={() => handleBrandSubmit()}>
						<div className="mt-4 flex flex-col gap-4 xl:flex xl:flex-col xl:items-center ">
							<div className="xl:w-1/4">
								<Input
									htmlFor="brandName"
									label="Nom de la marque"
									type="text"
									value={selectedBrand.name ?? ""}
									onChange={(val) =>
										setSelectedBrand({ ...selectedBrand, name: val })
									}
								/>
							</div>

							<div className="relative -mt-4 xl:w-1/4">
								<input
									id="file-upload"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
								<label
									htmlFor="file-upload"
									className="border mt-4 h-10 flex max-w-[100%] pt-3 pl-3 z-200 w-full cursor-pointer bg-white"
								>
									<p className="absolute text-gray-500 text-xs top-4 left-1">
										Sélectionnez une image
									</p>
								</label>

								<button
									type="button"
									onClick={() =>
										document.getElementById("file-upload")?.click()
									}
									className="absolute right-1 top-5"
								>
									<img
										src="/icons/add-item.svg"
										alt="Ajouter un fichier"
										className="w-8"
									/>
								</button>
							</div>

							<div className="flex justify-center">
								<img
									src={selectedBrand.logo || "/icons/default.svg"}
									alt={selectedBrand.name}
									className="w-50 border "
								/>
							</div>
						</div>

						<div className="flex justify-between gap-4">
							<div className="flex-1">
								<Button type="submit" buttonText="MODIFIER LA MARQUE" />
							</div>
							<div>
								<button type="button" onClick={handleDelete}>
									<img
										src="/icons/trash.svg"
										alt="poubelle"
										className="w-9 mt-6"
									/>
								</button>
							</div>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
