export default function Shipping() {
	return (
		<>
			<div id="livraison" className="page-content mt-4">
				<h2 className="text-3xl font-bold text-blue-800 mb-6 pb-3 border-b-2 border-gray-200">
					Livraison
				</h2>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<p className="text-blue-800">
						<strong>Information :</strong> Les conditions ci-dessous décrivent
						les modalités de livraison applicables à vos commandes passées sur
						Padel Club Shop.
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					1. Zones de livraison
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Nous livrons actuellement vers les pays suivants :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>France métropolitaine</li>
					<li>Belgique</li>
					<li>Luxembourg</li>
					<li>Allemagne</li>
					<li>Italie</li>
					<li>Monaco</li>
					<li>Espagne</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					2. Frais de livraison
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Les frais de livraison sont fixés à <strong>6,90 € TTC</strong> pour
					toute commande inférieure à <strong>69 €</strong>.
				</p>
				<p className="mb-4 text-gray-700 leading-relaxed">
					La livraison est <strong>gratuite</strong> dès{" "}
					<strong>69 € d’achat</strong>.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					3. Délais de livraison
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Les commandes sont expédiées sous <strong>24 à 48 h</strong> après
					validation du paiement. Les délais de livraison varient selon la
					destination :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>France métropolitaine : 2 à 5 jours ouvrés</li>
					<li>
						Pays limitrophes (Belgique, Luxembourg, Allemagne, etc.) : 3 à 6
						jours ouvrés
					</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					4. Suivi de commande
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Dès la confirmation de votre commande, un e-mail contenant votre
					numéro de commande vous sera envoyé. Vous pourrez ainsi suivre
					l’acheminement de votre colis en temps réel.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					5. Retard ou problème de livraison
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					En cas de retard, d’adresse incorrecte ou de problème de livraison,
					merci de contacter notre service client à l’adresse suivante :{" "}
					<a
						href="mailto:dimier.matt.dev@gmail.com"
						className="text-blue-600 hover:text-blue-800"
					>
						dimier.matt.dev@gmail.com
					</a>
					.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					6. Retour des colis
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					En cas de colis non livré et retourné à l’expéditeur, nous vous
					contacterons pour convenir d’une nouvelle expédition ou d’un
					remboursement selon votre préférence.
				</p>
			</div>
		</>
	);
}
