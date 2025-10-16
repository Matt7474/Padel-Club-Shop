export default function AboutUs() {
	return (
		<>
			<div id="apropos" className="page-content mt-4">
				<h2 className="text-3xl font-bold text-blue-800 mb-6 pb-3 border-b-2 border-gray-200">
					À Propos de Nous
				</h2>

				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
					<p className="text-yellow-800">
						<strong>Notice :</strong> Padel Club Shop est une boutique en ligne
						fictive créée dans le cadre d'un projet de développement web
						personnel pour démontrer les compétences techniques en e-commerce.
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Notre Histoire
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Padel Club Shop naît de la passion pour le padel, sport en pleine
					expansion qui séduit de plus en plus d'adeptes en France. Créée en
					2025, notre entreprise s'est donné pour mission de démocratiser
					l'accès aux équipements de padel en proposant une sélection rigoureuse
					de produits de qualité à des prix compétitifs.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Notre Mission
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Nous nous engageons à fournir aux passionnés de padel, qu'ils soient
					débutants ou confirmés, les meilleurs équipements pour pratiquer leur
					sport favori dans les meilleures conditions. Notre objectif est de
					rendre le padel accessible à tous en proposant :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>Une sélection rigoureuse de produits de grandes marques</li>
					<li>Des prix compétitifs et des promotions régulières</li>
					<li>Un service client de qualité et des conseils personnalisés</li>
					<li>Une livraison rapide et soignée</li>
					<li>Un service après-vente réactif</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Notre Équipe
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Notre équipe est composée de passionnés de padel qui pratiquent
					régulièrement ce sport. Cette expertise terrain nous permet de
					sélectionner les produits les plus adaptés et de vous conseiller en
					toute connaissance de cause. Nos conseillers sont formés régulièrement
					aux nouveautés et aux évolutions techniques des équipements.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Nos Marques Partenaires
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Nous travaillons exclusivement avec les meilleures marques du marché
					du padel :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>
						<strong>Raquettes :</strong> Babolat, Head, Wilson, Bullpadel, Nox
					</li>
					<li>
						<strong>Chaussures :</strong> Asics, Adidas, Babolat, K-Swiss
					</li>
					<li>
						<strong>Textile :</strong> Lacoste, Sergio Tacchini, Bullpadel
					</li>
					<li>
						<strong>Accessoires :</strong> Surgrips, balles, sacs de sport
					</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Nos Engagements
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Padel Club Shop s'engage pour un commerce responsable :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>Emballages recyclables et réduction des déchets</li>
					<li>Partenariat avec des transporteurs éco-responsables</li>
					<li>Support du padel amateur et des clubs locaux</li>
					<li>Sponsoring d'événements et de tournois régionaux</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Contactez-nous
				</h3>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<p>
						<strong>Adresse :</strong> 123 Avenue du Padel, 34370
						Cazouls-les-Béziers, France
					</p>
					<p>
						<strong>Email :</strong>{" "}
						<a
							href="mailto:dimier.matt.dev@gmail.com"
							className="text-blue-600 hover:text-blue-800"
						>
							dimier.matt.dev@gmail.com
						</a>
					</p>
					<p>
						<strong>Horaires :</strong> Du lundi au vendredi, 9h-18h
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					Suivez-nous
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Restez connectés avec Padel Club Shop sur nos réseaux sociaux pour
					découvrir nos dernières nouveautés, bons plans et conseils d'experts :
				</p>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<p>
						<strong>Facebook :</strong> @PadelClubShop
					</p>
					<p>
						<strong>Instagram :</strong> @padelClubShop
					</p>
					<p>
						<strong>YouTube :</strong> PadelClubShop
					</p>
				</div>
			</div>
		</>
	);
}
