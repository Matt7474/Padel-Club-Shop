export default function TermsOfSale() {
	return (
		<>
			<div id="cgv" className="page-content">
				<h2 className="text-3xl font-bold text-blue-800 mb-6 pb-3 border-b-2 border-gray-200">
					Conditions Générales de Vente
				</h2>

				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
					<p className="text-yellow-800">
						<strong>Notice :</strong> Ces conditions générales s'appliquent dans
						le cadre d'un site fictif. Le système de paiement Stripe utilisé est
						configuré en mode test uniquement.
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					1. Objet
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Les présentes conditions générales de vente régissent les relations
					contractuelles entre Padel Club Shop et ses clients dans le cadre de
					la vente en ligne d'équipements de padel.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					2. Prix
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Les prix sont indiqués en euros toutes taxes comprises (TTC). Padel
					Club Shop se réserve le droit de modifier ses prix à tout moment,
					étant entendu que le prix figurant au catalogue le jour de la commande
					sera le seul applicable à l'acheteur.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					3. Commande
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Toute commande suppose l'adhésion sans réserve aux présentes
					conditions générales de vente. La validation de votre commande vaut
					acceptation des prix et descriptions des produits disponibles à la
					vente.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					4. Paiement
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Le paiement s'effectue par carte bancaire via notre partenaire
					sécurisé Stripe. Les cartes acceptées sont :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>Visa</li>
					<li>Mastercard</li>
					<li>American Express</li>
				</ul>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Le débit de votre compte s'effectue au moment de l'expédition de votre
					commande.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					5. Livraison
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Les livraisons sont effectuées par Colissimo ou par transporteur selon
					le poids et la nature des produits. Les délais de livraison sont :
				</p>
				<ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-2">
					<li>France métropolitaine : 2-5 jours ouvrés</li>
					<li>Corse et DOM-TOM : 5-8 jours ouvrés</li>
					<li>Union Européenne : 4-7 jours ouvrés</li>
				</ul>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					6. Droit de rétractation
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Conformément à l'article L121-21 du Code de la consommation, vous
					disposez d'un délai de 14 jours francs pour exercer votre droit de
					rétractation sans avoir à justifier de motifs ni à payer de pénalités.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					7. Garantie
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Tous nos produits bénéficient de la garantie légale de conformité et
					de la garantie contre les vices cachés. La garantie constructeur
					s'applique selon les conditions définies par chaque fabricant.
				</p>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					8. Service client
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					Notre service client est à votre disposition du lundi au vendredi de
					9h à 18h :
				</p>
				<div className="mb-4 text-gray-700 leading-relaxed">
					<p>
						<strong>Téléphone :</strong> 01 23 45 67 89
					</p>
					<p>
						<strong>Email :</strong>{" "}
						<a
							href="mailto:dimier.matt-dev@gmail.com"
							className="text-blue-600 hover:text-blue-800"
						>
							dimier.matt-dev@gmail.com
						</a>
					</p>
				</div>

				<h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">
					9. Litiges
				</h3>
				<p className="mb-4 text-gray-700 leading-relaxed">
					En cas de litige, une solution amiable sera recherchée avant toute
					action judiciaire. À défaut, les tribunaux français seront seuls
					compétents.
				</p>
			</div>
		</>
	);
}
