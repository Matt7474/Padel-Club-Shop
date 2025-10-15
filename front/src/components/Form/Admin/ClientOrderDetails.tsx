import { useState } from "react";
import articlesDatas from "../../../../data/dataTest.json";
import type { Order } from "../../../types/Order";
import type { User } from "../../../types/User";
import UserDetails from "./UserDetails";

interface ClientOrderDetailsProps {
	order: Order;
	user: User;
}

export default function ClientOrderDetails({
	order,
	user,
}: ClientOrderDetailsProps) {
	const articlesData = articlesDatas.articles;
	const [clickReturn, setClickReturn] = useState<User | null>(null);
	const handleClick = (user: User) => setClickReturn(user);

	const getArticleById = (id: number) =>
		articlesData.find((a) => a.article_id === id);

	// Calcul des totaux TTC/HT/TVA
	const totalTTC = order.order_lines.reduce((sum, line) => {
		const article = getArticleById(line.article);
		if (!article || typeof line.quantity !== "number") return sum;
		return sum + article.price_ttc * line.quantity;
	}, 0);

	const tvaRate = typeof order.tva_rate === "number" ? order.tva_rate : 20;
	const totalHT = (totalTTC / (1 + tvaRate / 100)).toFixed(2);
	const tva = (totalTTC - parseFloat(totalHT)).toFixed(2);

	if (clickReturn) return <UserDetails user={user} />;

	const handlePrint = () => {
		const printContent = document.getElementById("invoice");
		if (!printContent) return;

		const newWin = window.open("", "_blank");
		newWin?.document.write(`
    <html>
      <head>
        <title>Impression facture</title>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
		newWin?.document.close();
		newWin?.focus();
		newWin?.print();
		newWin?.close();
	};

	return (
		<div>
			<button
				type="button"
				onClick={() => handleClick(user)}
				className="flex my-4 cursor-pointer"
			>
				<img
					src="/icons/arrow.svg"
					alt="fleche retour"
					className="w-4 rotate-180"
				/>
				Retour
			</button>

			<button
				type="button"
				onClick={handlePrint}
				className="flex w-full justify-end -mt-6 pb-2 pr-2"
			>
				<img src="/icons/printer.svg" alt="printer" className="w-6 " />
			</button>
			{/* Facture */}
			<div className="printable" id="invoice">
				<div className="border p-2">
					<div className="flex justify-between">
						<div>
							<h2 className="text-3xl font-bold">FACTURE</h2>
							<div className="flex">
								<p className="text-md underline">Facture n° :</p>
								<p className="text-md ml-1">{order.reference}</p>
							</div>
						</div>
						<img src="/icons/logo_name.svg" alt="logo" className="w-18" />
					</div>

					<div className="flex">
						<p className="underline">Date d'achat :</p>
						<p className="ml-1">
							{new Date(order.created_at).toLocaleDateString()}
						</p>
					</div>
					<div className="w-full place-self-center border-b my-4 border-gray-200"></div>

					<p className="font-semibold text-xl mb-2">EMETTEUR</p>
					<p>Padel Club Shop</p>
					<p>N° SIRET : 123 456 789 00013</p>

					<div className="flex">
						<img src="/icons/phone.svg" alt="phone" className="w-5" />
						<a
							href={`tel : 06.31.54.89.49`}
							className="text-blue-600 underline ml-1"
						>
							06.31.54.89.49
						</a>
					</div>

					<div className="flex">
						<img src="/icons/email.svg" alt="email" className="w-5" />
						<a
							href={`mailto: dimier.matt.dev@gmail.com`}
							className="text-blue-600 underline ml-1"
						>
							dimier.matt.dev@gmail.com
						</a>
					</div>

					<div className="flex">
						<img src="/icons/map.svg" alt="map" className="w-5" />
						<p className="ml-1">123 Avenue du Padel</p>
					</div>
					<p> 34370 Cazouls-les-Béziers, France</p>

					<div className="w-full place-self-center border-b my-4 border-gray-200"></div>

					<p className="font-semibold text-xl mb-2">DESTINATAIRE</p>

					<div className="flex">
						<p className="uppercase">{user.lastName}</p>
						<p className="ml-1">{user.firstName}</p>
					</div>

					<div className="flex">
						<img src="/icons/phone.svg" alt="phone" className="w-5" />
						<a
							href={`tel : ${user.phone}`}
							className="text-blue-600 underline ml-1"
						>
							{user.phone}
						</a>
					</div>

					<div className="flex">
						<img src="/icons/email.svg" alt="email" className="w-5" />
						<a
							href={`mailto: ${user.email}`}
							className="text-blue-600 underline ml-1"
						>
							{user.email}
						</a>
					</div>

					<div className="flex">
						<div>
							<div className="flex">
								<img src="/icons/delivery.svg" alt="delivery" className="w-5" />
								<p className="ml-1">
									{user?.address?.[0]?.street_number}{" "}
									{user?.address?.[0]?.street_name}{" "}
									{user?.address?.[0]?.complement}
								</p>
							</div>
							<p>
								{user?.address?.[0]?.zip_code} {user?.address?.[0]?.city}, {""}
								{user?.address?.[0]?.country}
							</p>
						</div>
					</div>

					<div className="w-full place-self-center border-b my-4 border-gray-200"></div>

					<div>
						<div className="grid grid-cols-[2fr_4fr_1fr_2fr_2fr] mt-4 mb-2">
							<p className="text-xs pl-1">IMAGE</p>
							<p className="text-xs pl-1">DESCRIPTION</p>
							<p className="text-xs pl-1 ">QTE</p>
							<p className="text-xs pl-1">PRIX.HT</p>
							<p className="text-xs pl-1 overflow-hidden ">PRIX.TTC</p>
						</div>
						{order.order_lines.map((line) => {
							const article = getArticleById(line.article);

							return (
								<div
									key={line.order_line_id}
									className="grid grid-cols-[2fr_4fr_1fr_2fr_2fr]  gap-2 items-center border-b py-2"
								>
									<div>
										<img
											src={article?.images[0] || "/icons/default.svg"}
											alt={article?.name || "Article"}
											className="w-12 h-12 object-cover rounded"
										/>
									</div>

									<div>
										<p className="font-semibold">
											{article?.name || "Inconnu"}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600 pl-1">
											{line.quantity}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-800">
											{article?.price_ttc
												? (article.price_ttc / 1.2).toFixed(2)
												: "N/A"}{" "}
											€
										</p>
									</div>
									<div>
										<p className="text-sm font-bold text-gray-800">
											{article?.price_ttc ?? "N/A"} €
										</p>
									</div>
								</div>
							);
						})}
						<div>
							<div className="text-md leading-tight text-end mt-4">
								<p>TOTAL HT : {totalHT} €</p>
								<p>TVA : {tva} €</p>
								<p className="font-semibold">
									TOTAL TTC :{" "}
									{Number.isNaN(totalTTC) ? "0.00" : totalTTC.toFixed(2)} €
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
