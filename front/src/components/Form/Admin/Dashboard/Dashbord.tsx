import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Cards from "./Elements/Cards";
import SalesEvolution from "./Elements/SalesEvolution";
import SalesCategories from "./Elements/SalesCategories";

export default function Dashboard() {
	// Produits les plus vendus
	const topProduits = [
		{ nom: "T-shirt basique", ventes: 156, revenus: 3120 },
		{ nom: "Jean slim", ventes: 134, revenus: 6700 },
		{ nom: "Sneakers Classic", ventes: 98, revenus: 7840 },
		{ nom: "Sac à dos", ventes: 87, revenus: 4350 },
		{ nom: "Casquette", ventes: 76, revenus: 1520 },
	];

	// Panier moyen par mois
	const panierMoyenData = [
		{ mois: "Jan", montant: 48.3 },
		{ mois: "Fév", montant: 48.1 },
		{ mois: "Mar", montant: 48.6 },
		{ mois: "Avr", montant: 49.2 },
		{ mois: "Mai", montant: 49.2 },
		{ mois: "Juin", montant: 49.7 },
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* En-tête */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
					<p className="text-gray-600 mt-2">Vue d'ensemble de la boutique</p>
				</div>

				{/* Header : Cartes métriques */}
				<Cards />

				{/* Graphiques principaux */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Évolution des ventes */}
					<SalesEvolution />
					{/* Ventes par caategories */}
					<SalesCategories />
				</div>

				{/* Graphique visiteurs et produits top */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Trafic du site */}

					{/* Panier moyen et Stocks */}

					{/* Panier moyen */}
					<div className="bg-white lg:col-span-2 rounded-lg shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-900">
								Évolution du panier moyen
							</h2>
							<div className="text-right">
								<p className="text-2xl font-bold text-green-600">49,7 €</p>
								<p className="text-xs text-gray-500">Juin 2024</p>
							</div>
						</div>
						<ResponsiveContainer width="100%" height={288}>
							<LineChart data={panierMoyenData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="mois" />
								<YAxis domain={[45, 52]} />
								<Tooltip formatter={(value) => `${value} €`} />
								<Legend />
								<Line
									type="monotone"
									dataKey="montant"
									stroke="#10b981"
									strokeWidth={3}
									name="Panier moyen (€)"
									dot={{ fill: "#10b981", r: 5 }}
									activeDot={{ r: 7 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					{/* Top produits */}
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Top produits
						</h2>
						<div className="space-y-4">
							{topProduits.map((produit) => (
								<div
									key={produit.nom}
									className="flex items-center justify-between pb-3 border-b last:border-b-0"
								>
									<div>
										<p className="font-semibold text-gray-900">{produit.nom}</p>
										<p className="text-sm text-gray-600">
											{produit.ventes} ventes
										</p>
									</div>
									<p className="font-bold text-green-600">
										{produit.revenus} €
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
