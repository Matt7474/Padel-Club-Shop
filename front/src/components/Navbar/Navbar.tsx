import LinkMenu from "../LinkMenu/LinkMenu";

export default function Navbar() {
	return (
		<>
			<div className="hidden 2xl:block  ">
				<div className="flex gap-y-3 mt-4 ml-3 justify-center gap-7">
					<LinkMenu
						to="raquette"
						name="RAQUETTES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="sac"
						name="SACS"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="balle"
						name="BALLES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="vêtement"
						name="VÊTEMENTS"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="chaussure"
						name="CHAUSSURES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="accessoire"
						name="ACCESSOIRES"
						color="text-black"
						border={0}
						marginLeft={4}
					/>
					<LinkMenu
						to="/promotion"
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
