/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { useEffect, useState } from "react";
import { getUserById } from "../api/User";
import Toogle from "../components/Form/Toogle/Toogle";
import Input from "../components/Form/Tools/Input";
import Adress from "../components/Form/User/Adress";
import { useAuthStore } from "../store/useAuthStore";
// import type { Address, User } from "../types/User";

export default function Profile() {
	const { user } = useAuthStore();
	const [loading, setLoading] = useState(true);
	// const [registerPassword, setRegisterPassword] = useState("");

	// State utilisateur
	const [profile, setProfile] = useState({
		lastName: "",
		firstName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	// State des adresses
	const [shippingAddress, setShippingAddress] = useState({
		streetNumber: "",
		streetName: "",
		zipCode: "",
		city: "",
		country: "",
		additionalInfo: "",
	});

	const [billingAddress, setBillingAddress] = useState({
		streetNumber: "",
		streetName: "",
		zipCode: "",
		city: "",
		country: "",
		additionalInfo: "",
	});

	const [isBillingDifferent, setIsBillingDifferent] = useState(false);
	// const [isNotSameRegisterPassword, setIsNotSameRegisterPassword] =
	useState(false);

	// Formatage du téléphone
	const formatPhone = (value: string) => {
		let digits = value.replace(/\D/g, "").substring(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1.");
	};

	// Règles de validation
	// const hasMinLength = profile.password.length >= 8;
	// const hasUppercase = /[A-Z]/.test(profile.password);
	// const hasNumber = /\d/.test(profile.password);

	// Récupération des infos utilisateur
	useEffect(() => {
		const fetchUser = async () => {
			if (!user?.id) return;

			try {
				setLoading(true);

				const response: any = await getUserById(user.id);
				console.log("Utilisateur récupéré :", response);
				// Infos de base
				setProfile({
					lastName: response.last_name || "",
					firstName: response.first_name || "",
					email: response.email || "",
					phone: response.phone ? formatPhone(response.phone) : "",
					password: "",
					confirmPassword: "",
				});

				// Adresses
				const shippingAddr: any = response.addresses?.find(
					(addr: any) => addr.type === "shipping",
				);
				const billingAddr: any = response.addresses?.find(
					(addr: any) => addr.type === "billing",
				);

				if (shippingAddr) {
					setShippingAddress({
						streetNumber: shippingAddr.street_number || "",
						streetName: shippingAddr.street_name || "",
						zipCode: shippingAddr.zip_code || "",
						city: shippingAddr.city || "",
						country: shippingAddr.country || "",
						additionalInfo: shippingAddr.complement || "",
					});
				}

				if (billingAddr) {
					setBillingAddress({
						streetNumber: billingAddr.street_number || "",
						streetName: billingAddr.street_name || "",
						zipCode: billingAddr.zip_code || "",
						city: billingAddr.city || "",
						country: billingAddr.country || "",
						additionalInfo: billingAddr.complement || "",
					});
					setIsBillingDifferent(true);
				} else {
					setIsBillingDifferent(false);
				}
			} catch (error) {
				console.error("Erreur récupération utilisateur :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [user?.id]);

	if (loading) return <p>Chargement...</p>;

	// Handlers
	const handleChange = () => {
		console.log("modification activé");
	};

	const handleCancelChange = () => {
		console.log("cancelChange");
	};

	const handleChangeSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (profile.password !== profile.confirmPassword) {
			// setIsNotSameRegisterPassword(true);
			console.log("mot de passe non identique");
		} else {
			// setIsNotSameRegisterPassword(false);
			console.log("Soumission OK, on peut envoyer les données au backend");
		}
	};

	const handleDeleteProfile = () => {
		console.log("deleteProfile");
	};

	return (
		<div className="xl:bg-[url('/icons/backgroundH.avif')] xl:h-180 xl:pt-10 xl:relative">
			<div className="xl:w-2/3 xl:mx-auto xl:bg-white/80 xl:p-5 xl:h-[40rem] xl:overflow-y-auto xl:relative xl:z-10">
				<h2 className="p-3 bg-gray-500/80 font-semibold text-lg mt-7 xl:mt-0 flex justify-between">
					Mon profil
					<button
						type="button"
						onClick={handleChange}
						aria-label="Modifier le profil"
					>
						<img
							src="/icons/pen.svg"
							alt=""
							className="w-7 cursor-pointer hover:brightness-80"
						/>
					</button>
				</h2>

				<form onSubmit={handleChangeSubmit}>
					<div className="xl:flex xl:justify-between xl:w-full xl:gap-8">
						<div className="xl:w-1/2">
							<h3 className="mt-6 font-semibold text-sm">
								Informations personnelles
							</h3>
							<div className="-mt-2 gap-x-4">
								<Input
									htmlFor="lastName"
									label="Nom"
									type="text"
									value={profile.lastName}
									onChange={(val) => setProfile({ ...profile, lastName: val })}
								/>
								<Input
									htmlFor="firstName"
									label="Prénom"
									type="text"
									value={profile.firstName}
									onChange={(val) => setProfile({ ...profile, firstName: val })}
								/>
								<Input
									htmlFor="email"
									label="Email"
									type="email"
									value={profile.email}
									onChange={(val) => setProfile({ ...profile, email: val })}
								/>
								{/* <p className="mt-4 -mb-3 text-sm pl-1">
									Souhaitez vous changer de mot de passe ?
								</p>
								<Input
									htmlFor="password"
									label="Mot de passe"
									type="password"
									value={profile.password}
									onChange={(val) => setProfile({ ...profile, password: val })}
									pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
								/>
								<div className="mt-2 text-xs transition-all duration-300">
									<span
										className={hasMinLength ? "text-green-600" : "text-red-600"}
									>
										{hasMinLength ? "✔" : "✘"} Au moins 8 caractères
									</span>
									<br />
									<span
										className={hasUppercase ? "text-green-600" : "text-red-600"}
									>
										{hasUppercase ? "✔" : "✘"} Une majuscule
									</span>
									<br />
									<span
										className={hasNumber ? "text-green-600" : "text-red-600"}
									>
										{hasNumber ? "✔" : "✘"} Un chiffre
									</span>
								</div>
								<Input
									htmlFor="confirmPassword"
									label="Confirmation du mot de passe"
									type="password"
									value={profile.confirmPassword}
									onChange={(val) =>
										setProfile({ ...profile, confirmPassword: val })
									}
									pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
								/>
								{isNotSameRegisterPassword && (
									<span className="text-red-600 text-sm mt-4">
										Les mots de passe ne sont pas identiques.
									</span>
								)} */}
								<Input
									htmlFor="phone"
									label="N° téléphone"
									type="text"
									value={profile.phone}
									onChange={(val) =>
										setProfile({ ...profile, phone: formatPhone(val) })
									}
									pattern="^(\d{2}\.){4}\d{2}$"
								/>
							</div>
						</div>

						<div className="border-b xl:border-r border-gray-400 mt-7 "></div>

						<Adress
							title="Adresse de livraison"
							streetNumber={shippingAddress.streetNumber}
							setStreetNumber={(val) =>
								setShippingAddress({ ...shippingAddress, streetNumber: val })
							}
							streetName={shippingAddress.streetName}
							setStreetName={(val) =>
								setShippingAddress({ ...shippingAddress, streetName: val })
							}
							zipcode={shippingAddress.zipCode}
							setZipcode={(val) =>
								setShippingAddress({ ...shippingAddress, zipCode: val })
							}
							city={shippingAddress.city}
							setCity={(val) =>
								setShippingAddress({ ...shippingAddress, city: val })
							}
							country={shippingAddress.country}
							setCountry={(val) =>
								setShippingAddress({ ...shippingAddress, country: val })
							}
							additionalInfo={shippingAddress.additionalInfo}
							setAdditionalInfo={(val) =>
								setShippingAddress({ ...shippingAddress, additionalInfo: val })
							}
						/>
					</div>

					<div className="border-b xl:border-r border-gray-400 my-4 "></div>

					<Toogle
						title="Adresse de facturation différente ?"
						checked={isBillingDifferent}
						onChange={setIsBillingDifferent}
					/>

					{isBillingDifferent && (
						<Adress
							title="Adresse de facturation"
							streetNumber={billingAddress.streetNumber}
							setStreetNumber={(val) =>
								setBillingAddress({ ...billingAddress, streetNumber: val })
							}
							streetName={billingAddress.streetName}
							setStreetName={(val) =>
								setBillingAddress({ ...billingAddress, streetName: val })
							}
							zipcode={billingAddress.zipCode}
							setZipcode={(val) =>
								setBillingAddress({ ...billingAddress, zipCode: val })
							}
							city={billingAddress.city}
							setCity={(val) =>
								setBillingAddress({ ...billingAddress, city: val })
							}
							country={billingAddress.country}
							setCountry={(val) =>
								setBillingAddress({ ...billingAddress, country: val })
							}
							additionalInfo={billingAddress.additionalInfo}
							setAdditionalInfo={(val) =>
								setBillingAddress({ ...billingAddress, additionalInfo: val })
							}
						/>
					)}

					<div className="flex justify-between mt-4 gap-4 xl:w-1/2 xl:mt-10 xl:mx-auto pl-1">
						<button
							type="button"
							className="w-4/10 p-2 bg-red-400 font-semibold rounded-md cursor-pointer hover:brightness-80"
							onClick={handleCancelChange}
						>
							Annuler
						</button>
						<button
							type="submit"
							className="w-4/10 p-2 bg-green-500 font-semibold rounded-md cursor-pointer hover:brightness-80"
						>
							Sauvegarder
						</button>
						<button
							type="button"
							className="w-1/10"
							onClick={handleDeleteProfile}
						>
							<img
								src="/icons/trash.svg"
								alt="poubelle"
								className="w-8 cursor-pointer hover:brightness-80"
							/>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
