import { useEffect, useState } from "react";
import { deleteUser, getUserById, updateUser } from "../api/User";
import Toogle from "../components/Form/Toogle/Toogle";
import Input from "../components/Form/Tools/Input";
import Adress from "../components/Form/User/Adress";
import ConfirmModal from "../components/Modal/ConfirmModal";
import { useToastStore } from "../store/ToastStore ";
import { useAuthStore } from "../store/useAuthStore";
import type { Address, UserApiResponse } from "../types/User";
import { transformUserApiToAuthUser } from "../utils/transformUserApiToAuthUser";

interface ProfileProps {
	text?: string;
}

export default function Profile({ text }: ProfileProps) {
	const { user } = useAuthStore();
	const addToast = useToastStore((state) => state.addToast);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

	// Formatage du téléphone
	const formatPhone = (value: string) => {
		const digits = value.replace(/\D/g, "").substring(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1.");
	};

	// Récupération des infos utilisateur
	useEffect(() => {
		const fetchUser = async () => {
			if (!user?.id) return;

			try {
				setLoading(true);

				const response: UserApiResponse = await getUserById(user.id);
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
				const shippingAddr: Address | undefined = response.addresses?.find(
					(addr: Address) => addr.type === "shipping",
				);
				const billingAddr: Address | undefined = response.addresses?.find(
					(addr: Address) => addr.type === "billing",
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

	const handleChange = () => {
		setIsEditing(true);
		console.log("Mode édition activé");
	};

	const handleChangeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id) return;

		try {
			const updatedUser = {
				last_name: profile.lastName,
				first_name: profile.firstName,
				email: profile.email,
				phone: profile.phone.replace(/\D/g, ""),
				password: profile.password || undefined,
				addresses: [
					{
						type: "shipping" as const,
						street_number: shippingAddress.streetNumber,
						street_name: shippingAddress.streetName,
						zip_code: shippingAddress.zipCode,
						city: shippingAddress.city,
						country: shippingAddress.country,
						complement: shippingAddress.additionalInfo,
					},
					...(isBillingDifferent
						? [
								{
									type: "billing" as const,
									street_number: billingAddress.streetNumber,
									street_name: billingAddress.streetName,
									zip_code: billingAddress.zipCode,
									city: billingAddress.city,
									country: billingAddress.country,
									complement: billingAddress.additionalInfo,
								},
							]
						: []),
				],
			};

			console.log("✅ Données envoyées :", updatedUser);

			await updateUser(user.id, updatedUser);

			// ✅ Récupérer l'utilisateur mis à jour depuis l'API
			const response: UserApiResponse = await getUserById(user.id);
			console.log("🟢 Profil mis à jour :", response);

			// Transformer et mettre à jour le store
			const transformedUser = transformUserApiToAuthUser(response);

			const { login, token } = useAuthStore.getState();
			if (token) login(transformedUser, token);

			setIsEditing(false);
			addToast("Votre profil a bien été modifié", "bg-green-500");
		} catch (error) {
			console.error("❌ Erreur lors de la mise à jour :", error);
			addToast("Une erreur est survenue lors de la mise à jour", "bg-red-500");
		}
	};

	const handleCancelChange = async () => {
		if (!user?.id) return;

		try {
			setLoading(true);
			const response: UserApiResponse = await getUserById(user.id);
			console.log("🔁 Données réinitialisées :", response);

			setProfile({
				lastName: response.last_name || "",
				firstName: response.first_name || "",
				email: response.email || "",
				phone: response.phone ? formatPhone(response.phone) : "",
				password: "",
				confirmPassword: "",
			});

			const shippingAddr: Address | undefined = response.addresses?.find(
				(addr: Address) => addr.type === "shipping",
			);
			const billingAddr: Address | undefined = response.addresses?.find(
				(addr: Address) => addr.type === "billing",
			);

			setShippingAddress({
				streetNumber: shippingAddr?.street_number || "",
				streetName: shippingAddr?.street_name || "",
				zipCode: shippingAddr?.zip_code || "",
				city: shippingAddr?.city || "",
				country: shippingAddr?.country || "",
				additionalInfo: shippingAddr?.complement || "",
			});

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

			setIsEditing(false);
			addToast("Les modifications ont été annulés.", "bg-red-500");
		} catch (error) {
			console.error("Erreur lors du reset :", error);
			alert("Impossible de recharger les données utilisateur.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProfile = () => {
		setIsConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (!user) return;
		setLoading(true);
		try {
			await deleteUser(user.id);
			addToast("Votre compte a été supprimé avec succès.", "bg-red-500");
			window.location.href = "/";
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(`Erreur lors de la suppression du compte : ${error.message}`);
			} else {
				alert(`Erreur lors de la suppression du compte : ${error}`);
			}
		}
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
									disabled={!isEditing}
								/>
								<Input
									htmlFor="firstName"
									label="Prénom"
									type="text"
									value={profile.firstName}
									onChange={(val) => setProfile({ ...profile, firstName: val })}
									disabled={!isEditing}
								/>
								<Input
									htmlFor="email"
									label="Email"
									type="email"
									value={profile.email}
									onChange={(val) => setProfile({ ...profile, email: val })}
									disabled={!isEditing}
									readOnly={!!user}
								/>
								<Input
									htmlFor="phone"
									label="N° téléphone"
									type="text"
									value={profile.phone}
									onChange={(val) =>
										setProfile({ ...profile, phone: formatPhone(val) })
									}
									pattern="^(\d{2}\.){4}\d{2}$"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="border-b xl:border-r border-gray-400 mt-7 "></div>

						<div>
							{text && (
								<p className="text-red-500 font-semibold text-center">{text}</p>
							)}
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
									setShippingAddress({
										...shippingAddress,
										additionalInfo: val,
									})
								}
								disabled={!isEditing}
							/>
						</div>
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
							disabled={!isEditing}
						/>
					)}

					{isEditing && (
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
					)}
				</form>
				{isConfirmOpen && (
					<ConfirmModal
						message="Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible."
						onConfirm={confirmDelete}
						onCancel={() => setIsConfirmOpen(false)}
					/>
				)}
			</div>
		</div>
	);
}
