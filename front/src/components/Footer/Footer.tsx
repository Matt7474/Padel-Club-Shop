import { Link } from "react-router-dom";
import SocialNetwork from "../SocialNetwork/SocialNetwork";

export default function Footer() {
	return (
		<footer className="flex flex-col items-center bg-zinc-800 text-white pb-6 px-6 mt-7 w-full">
			{/* Logo centré */}
			<div className="">
				<img
					src="/icons/logo_name_white.svg"
					alt="PCS"
					className="w-40 mx-auto"
				/>
			</div>
			<div className="flex justify-center -mt-2 gap-3 xl:w-1/2 xl:gap-3">
				<SocialNetwork
					name="linkedin"
					link="https://www.linkedin.com/in/matthieu-dimier-a51539290"
				/>
				<SocialNetwork name="github" link="https://github.com/Matt7474" />
				<div className="rounded-md bg-gray-300 w-9 hover:cursor-pointer">
					<a
						href="mailto:dimier.matt.dev@gmail.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
						aria-label="Envoyer un mail"
					>
						<img
							src={`/icons/gmail.svg`}
							alt={`logo gmail`}
							className="rounded-md bg-gray-300 w-9 hover:cursor-pointer"
						/>
					</a>
				</div>
			</div>

			<div className="flex flex-col items-center gap-6 w-full xl:flex-row xl:justify-between xl:items-start xl:-mt-15">
				{/* Liens INFOS LEGALES */}
				<div className="flex flex-col items-center mt-6 xl:w-1/2">
					<p className="text-lg font-semibold mb-2">INFOS LEGALES</p>
					<div className="w-full xl:w-1/3 border-b border-white mb-4"></div>

					<div className="flex flex-col items-center  gap-2 leading-tight">
						<Link to="/mentions-legales">
							<p className="text-md hover:underline cursor-pointer">
								Mentions légales
							</p>
						</Link>
						<Link to="/politique-de-confidentialite">
							<p className="text-md hover:underline cursor-pointer">
								Politique de confidentialité
							</p>
						</Link>
						<Link to="/conditions-generales-de-vente">
							<p className="text-md hover:underline cursor-pointer">
								Conditions générales de ventes
							</p>
						</Link>
					</div>
				</div>

				{/* Lien NOTRE ENTREPRISE */}
				<div className="flex flex-col items-center mt-5 xl:mt-24 xl:w-1/2">
					<p className="text-lg font-semibold mb-2">NOTRE ENTREPRISE</p>
					<div className="w-full xl:w-1/3 border-b border-white -mt- mb-4"></div>

					<div className="flex flex-col items-center  gap-2 leading-tight">
						<Link to="/a-propos-de-nous">
							<p className="text-md hover:underline cursor-pointer">
								Qui sommes-nous ?
							</p>
						</Link>
					</div>
				</div>

				{/* Liens BOUTIQUE */}
				<div className="flex flex-col items-center mt-5 xl:w-1/2 ">
					<p className="text-lg font-semibold mb-2">BOUTIQUE</p>
					<div className="w-full xl:w-1/3 border-b border-white mb-4"></div>

					<div className="grid grid-cols-2 gap-x-16 gap-y-2 leading-tight text-">
						<Link to="/articles/racket">
							<p className="text-md hover:underline cursor-pointer ">
								Raquettes
							</p>
						</Link>
						<Link to="/articles/bag">
							<p className="text-md hover:underline cursor-pointer text-end">
								Sacs
							</p>
						</Link>
						<Link to="/articles/ball">
							<p className="text-md hover:underline cursor-pointer">Balles</p>
						</Link>
						<Link to="/articles/clothing">
							<p className="text-md hover:underline cursor-pointer text-end">
								Vêtements
							</p>
						</Link>
						<Link to="/articles/shoe">
							<p className="text-md hover:underline cursor-pointer">
								Chaussures
							</p>
						</Link>
						<Link to="/articles/accessory">
							<p className="text-md hover:underline cursor-pointer text-end">
								Accessoires
							</p>
						</Link>
						<Link to="/articles/promotion" className="col-span-2">
							<p className="text-md hover:underline cursor-pointer">
								Promotions
							</p>
						</Link>
					</div>
				</div>
			</div>

			{/* Copyright centré en bas */}
			<div className="text-center text-xs mt-7">
				<p>© Copyright 2025 - Tous droits réservés</p>
				<p>Réalisé par Matt-dev.fr</p>
			</div>
		</footer>
	);
}
