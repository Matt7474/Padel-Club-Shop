import LinkMenu from "../LinkMenu/LinkMenu";

export default function Navbar() {
	return (
		<>
			<div className="hidden 2xl:block  ">
				<div className="flex gap-y-3 mt-4 ml-3 justify-center gap-7">
					<LinkMenu
						to="articles"
						name="TOUS LES ARTICLES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="racket"
						name="RAQUETTES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="bag"
						name="SACS"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="ball"
						name="BALLES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="clothing"
						name="VÊTEMENTS"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="shoes"
						name="CHAUSSURES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="accessory"
						name="ACCESSOIRES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="promotion"
						name="PROMOTIONS"
						color="text-orange-500"
						border={0}
						marginLeft={4}
					/>
				</div>
			</div>
		</>
	);
}
