import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createBrand } from "../../../api/Brand";
import { useToastStore } from "../../../store/ToastStore ";
import Button from "../Tools/Button";
import Input from "../Tools/Input";

export default function CreateBrand() {
	const addToast = useToastStore((state) => state.addToast);

	const [errorMessage, setErrorMessage] = useState(false);
	const [messageOfError, setMessageOfError] = useState("");

	const [newBrand, setNewBrand] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>(""); // src affiché dans <img>
	const [addURL, setAddURL] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [isDataUrl, setIsDataUrl] = useState<boolean>(false); // pour savoir si c'est une data URL
	const objectUrlRef = useRef<string | null>(null);

	// Nettoyage à la désactivation du composant
	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = null;
			}
		};
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (!file) return;

		// Révoquer ancien ObjectURL si existant
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}

		const previewUrl = URL.createObjectURL(file);
		objectUrlRef.current = previewUrl;

		setSelectedFile(file);
		setImagePreview(previewUrl);
		setAddURL("");
		setIsDataUrl(false);
		setError(null);
	};

	// Vérifie qu'une URL d'image charge bien (onload/onerror)
	const checkImageLoads = (url: string) =>
		new Promise<void>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => reject();
			img.src = url;
		});

	// Convertit une data URL en File
	const dataURLtoFile = (dataurl: string, filename: string): File => {
		const arr = dataurl.split(",");
		const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	};

	// Normalise l'URL entrée (ajoute https:// si nécessaire)
	const normalizeUrl = (raw: string) => {
		const trimmed = raw.trim();
		if (!trimmed) return "";
		// si commence par // ou http(s):// on garde, sinon on préfixe https://
		if (/^(https?:)?\/\//i.test(trimmed))
			return trimmed.startsWith("http") ? trimmed : `https:${trimmed}`;
		return /^data:/.test(trimmed) ? trimmed : `https://${trimmed}`;
	};

	const handleApplyUrl = async () => {
		setError(null);
		const url = normalizeUrl(addURL);
		if (!url) {
			setError("Colle une URL d'image valide.");
			return;
		}

		// test de chargement
		try {
			await checkImageLoads(url);

			// si on avait un objectURL, on le révoque (on passe maintenant à une URL distante)
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = null;
			}

			// Vérifier si c'est une data URL
			if (url.startsWith("data:")) {
				// Convertir la data URL en File pour un traitement uniforme
				const file = dataURLtoFile(url, `pasted-image-${Date.now()}.png`);
				setSelectedFile(file);
				setIsDataUrl(true);
			} else {
				setSelectedFile(null);
				setIsDataUrl(false);
			}

			setImagePreview(url);
			setError(null);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(true);
				setMessageOfError(error.message);
				console.error("❌ Erreur front :", error.message);
			} else {
				console.error("❌ Erreur inconnue :", error);
			}
		}
	};

	const handleDeleteImage = () => {
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
		setSelectedFile(null);
		setImagePreview("");
		setAddURL("");
		setIsDataUrl(false);
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (selectedFile) {
				// Cas 1: fichier local ou data URL convertie en fichier
				const fd = new FormData();
				fd.append("image", selectedFile);
				fd.append("brandName", newBrand);
				const result = await createBrand(fd);
				window.dispatchEvent(new Event("brandCreate"));
				console.log("Marque créée avec fichier :", result);
				setErrorMessage(false);
				addToast(`La marque ${newBrand} à créé avec succès`, "bg-green-500");
			} else if (imagePreview && !isDataUrl) {
				// Cas 2: URL distante (pas une data URL)
				const payload = { brandName: newBrand, image_url: imagePreview };
				const result = await createBrand(payload);
				console.log("Marque créée avec URL distante :", result);
				window.dispatchEvent(new Event("brandCreate"));
				addToast(`La marque ${newBrand} à créé avec succès`, "bg-green-500");
				setErrorMessage(false);
			} else {
				console.log("Aucune image sélectionnée");
				return;
			}

			// Reset formulaire si besoin
			setNewBrand("");
			setSelectedFile(null);
			setImagePreview("");
			setAddURL("");
			setIsDataUrl(false);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(true);
				setMessageOfError(error.message);
				console.error("❌ Erreur front :", error.message);
			} else {
				console.error("❌ Erreur inconnue :", error);
			}
		}
	};

	return (
		<div>
			<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
				Création d'une marque
			</h2>
			<form onSubmit={handleSubmit}>
				<div className="xl:w-1/3 xl:flex xl:flex-col xl:place-self-center gap-4 xl:gap-0">
					<Input
						htmlFor="newBrand"
						label="Nom de la marque"
						type="text"
						value={newBrand}
						onChange={setNewBrand}
						width="w-full"
					/>

					<div className="grid grid-cols-2 gap-4">
						{/* Upload fichier */}
						<div className="relative">
							<input
								id="file-upload"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
							<label
								htmlFor="file-upload"
								className="border mt-4 h-10 flex max-w-full pt-3 pl-3 w-full cursor-pointer"
							>
								<p className="absolute text-gray-500 text-xs top-4 left-1">
									Sélectionnez une image
								</p>
							</label>
							<button
								type="button"
								onClick={() => document.getElementById("file-upload")?.click()}
								className="absolute right-1 top-5"
							>
								<img
									src="/icons/add-item.svg"
									alt="Ajouter un fichier"
									className="w-8"
								/>
							</button>
						</div>

						{/* Saisie URL + bouton Aperçu */}
						<div>
							<div className="flex gap-2">
								<Input
									htmlFor={"addURL"}
									label={"Collez une URL d'image"}
									type={"text"}
									value={addURL}
									onChange={setAddURL}
									required={false}
									onBlur={handleApplyUrl}
									width="w-full"
								/>
							</div>
						</div>
					</div>

					{/* preview */}
					<div className="col-span-3 mt-4">
						{error && <p className="text-sm text-red-500 mb-2">{error}</p>}

						{imagePreview ? (
							<div className="flex flex-col items-center mt-4">
								<div className="relative group w-32 h-32 items-center">
									{/* alt informatif */}
									<img
										src={imagePreview}
										alt="Preview icone sélectionnée"
										className="w-full h-full object-cover rounded-md group-hover:brightness-50"
										onError={() =>
											setError("Erreur lors du chargement de l'image")
										}
									/>

									<button
										type="button"
										onClick={() => handleDeleteImage()}
										className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-1.5 text-red-500 rounded-full cursor-pointer flex items-center justify-center text-5xl opacity-0 group-hover:opacity-100 "
									>
										×
									</button>
								</div>
								{/* Indicateur du type d'image */}
								<div className="ml-2 text-xs text-gray-500 ">
									{isDataUrl
										? "URL distante"
										: selectedFile
											? "Fichier local"
											: "URL distante"}
								</div>
							</div>
						) : (
							<p className="text-sm text-gray-500 text-center">
								Aucune image sélectionnée
							</p>
						)}
					</div>

					{errorMessage && (
						<div className="text-sm text-red-500 mt-4 text-center">
							{messageOfError}
						</div>
					)}
					<div className="-mt-4">
						<Button type={"submit"} buttonText="AJOUTER LA MARQUE" />
					</div>
				</div>
			</form>
		</div>
	);
}
