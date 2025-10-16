export default function LegalNotice() {
	return (
		<>
			<div id="mentions" className="page-content mt-4">
				<h2 className="text-3xl font-bold text-blue-800 mb-6 pb-3 border-b-2 border-gray-200">
					Mentions Légales
				</h2>

				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
					<p className="text-yellow-800">
						<strong>Notice :</strong> Padel Club Shop est un site web fictif
						créé à des fins de développement et de démonstration. Aucune
						transaction commerciale réelle n'est effectuée.
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					1. Informations générales
				</h3>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<p>
						<strong>Nom de la société :</strong> Padel Club Shop SARL
					</p>
					<p>
						<strong>Siège social :</strong> 123 Avenue du Padel, 34370
						Cazouls-les-Béziers, France
					</p>
					<p>
						<strong>Numéro de SIRET :</strong> 12345678901234
					</p>
					<p>
						<strong>Code APE :</strong> 4764Z
					</p>
					<p>
						<strong>Capital social :</strong> 50 000 €
					</p>
					<p>
						<strong>Numéro de TVA intracommunautaire :</strong> FR12345678901
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					2. Directeur de la publication
				</h3>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<p>
						<strong>Nom :</strong> DIMIER Matthieu
					</p>
					<p>
						<strong>Fonction :</strong> Gérant
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
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					3. Hébergement
				</h3>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<h4>Le site est hébergé par :</h4>
					<p>
						<strong>Hébergeur :</strong> 02switch
					</p>
					<p>
						<strong>Adresse :</strong> Chemin des Pardiaux, 63000
						Clermont-Ferrand, France
					</p>
					<p>
						<strong>Site :</strong> www.o2switch.fr
					</p>
					<br />
					<h4>Le serveur et la base de données sont hébergés par :</h4>
					<p>
						<strong>Hébergeur :</strong> Ionos
					</p>
					<p>
						<strong>Adresse :</strong> 7 Place de la Gare, BP 70109, 57200
						Sarreguemines Cedex, France
					</p>
					<p>
						<strong>Site :</strong> www.ionos.fr
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					4. Propriété intellectuelle
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					L'ensemble de ce site relève de la législation française et
					internationale sur le droit d'auteur et la propriété intellectuelle.
					Tous les droits de reproduction sont réservés, y compris pour les
					documents téléchargeables et les représentations iconographiques et
					photographiques.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					5. Limitation de responsabilité
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Padel Club Shop s'efforce d'assurer au mieux de ses possibilités,
					l'exactitude et la mise à jour des informations diffusées sur ce site.
					Toutefois, Padel Club Shop ne peut garantir l'exactitude, la précision
					ou l'exhaustivité des informations mises à disposition sur ce site.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					6. Données personnelles
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Conformément à la loi « Informatique et Libertés » du 6 janvier 1978
					modifiée et au RGPD, vous disposez d'un droit d'accès, de
					rectification et de suppression des données vous concernant en vous
					adressant à :{" "}
					<a
						href="mailto:dimier.matt.dev@gmail.com"
						className="text-blue-600 hover:text-blue-800"
					>
						dimier.matt.dev@gmail.com
					</a>
				</p>
			</div>
		</>
	);
}
