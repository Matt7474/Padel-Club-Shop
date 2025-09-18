import ToogleType from "../Toogle/ToogleType";
import Input from "../Tools/Input";
import TextArea from "../Tools/TextArea";

interface PromoFormProps {
	articleDiscountValue: number | string;
	setArticleDiscountValue: (val: string) => void;
	articlePromoType: string;
	setArticlePromoType: (val: string) => void;
	finalPrice: number;
	articleDescriptionPromo: string;
	setArticleDescriptionPromo: (val: string) => void;
	articlePromoStart: string;
	setArticlePromoStart: (val: string) => void;
	articlePromoEnd: string;
	setArticlePromoEnd: (val: string) => void;
	promoState: "pending" | "active" | "expired" | "unknown";
	today: Date;
}

export default function PromoForm({
	articleDiscountValue,
	setArticleDiscountValue,
	articlePromoType,
	setArticlePromoType,
	finalPrice,
	articleDescriptionPromo,
	setArticleDescriptionPromo,
	articlePromoStart,
	setArticlePromoStart,
	articlePromoEnd,
	setArticlePromoEnd,
	promoState,
	today,
}: PromoFormProps) {
	return (
		<>
			<div>
				<div className="grid grid-cols-3 gap-4 mt-4 relative">
					{/* Montant de la promo */}
					<div className="-mt-5">
						<div className="relative">
							<Input
								htmlFor={"discount_value"}
								label={"Montant promo"}
								type={"number"}
								value={articleDiscountValue}
								onChange={setArticleDiscountValue}
							/>
						</div>
					</div>

					<div className="flex justify-center">
						<ToogleType
							value={articlePromoType}
							onChange={setArticlePromoType}
						/>
					</div>

					<div>
						<div className="relative border border-orange-400 px-2 pt-3.5 text-md -mt-1 bg-white h-10 ">
							{finalPrice}
							<span className="absolute text-md top-0 pt-4 right-2 pl-2 border-l">
								€
							</span>
							<p className="absolute text-gray-500 text-xs top-0 left-1">
								Prix de vente
							</p>
						</div>
					</div>
				</div>

				{/* Description de la promo */}
				<div>
					<div>
						<TextArea
							label="Description de la promotion"
							placeholder="Jusqu'à épuisement des stock"
							length={articleDescriptionPromo.length}
							value={articleDescriptionPromo}
							onChange={setArticleDescriptionPromo}
							maxLength={50}
						/>
					</div>
				</div>

				{/* Dates de la promo */}

				<div className="grid grid-cols-3 gap-4 -mt-1 text-sm">
					<div className="">
						<Input
							htmlFor={"startDate"}
							label={"Début de la promo"}
							type={"date"}
							value={articlePromoStart}
							onChange={setArticlePromoStart}
							// date min = aujourd’hui
							min={today.toISOString().split("T")[0]}
						/>
					</div>

					<div className="">
						<Input
							htmlFor={"endDate"}
							label={"Fin de la promo"}
							type={"date"}
							value={articlePromoEnd}
							onChange={setArticlePromoEnd}
							// date max >= début
							min={articlePromoStart || today.toISOString().split("T")[0]}
						/>
					</div>

					<div className="mt-4 relative">
						{promoState === "pending" && (
							<div className="border border-[#1CBCF2] h-10 bg-[#1CBCF2] relative flex justify-center items-center">
								<p className="text-md  absolute">En attente</p>
							</div>
						)}
						{promoState === "active" && (
							<div className="border border-[#65D778] h-10 bg-[#65D778] relative flex justify-center items-center">
								<p className="text-md  absolute">Active</p>
							</div>
						)}
						{promoState === "expired" && (
							<div className="border border-[#E64C4C] h-10 bg-[#E64C4C] relative flex justify-center items-center">
								<p className="text-md  absolute">Expiré</p>
							</div>
						)}
						{promoState === "unknown" && (
							<div className="border border-transparent h-10 relative flex justify-center items-center">
								<p className="text-md  absolute">En attente</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
