import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Cards from "./Elements/Cards";

export default function Dashboard() {
	// Données de ventes mensuelles
	const ventesData = [
		{ mois: "Jan", ventes: 4200, commandes: 87, visiteurs: 3420 },
		{ mois: "Fév", ventes: 3800, commandes: 79, visiteurs: 3180 },
		{ mois: "Mar", ventes: 5100, commandes: 105, visiteurs: 4230 },
		{ mois: "Avr", ventes: 6300, commandes: 128, visiteurs: 5120 },
		{ mois: "Mai", ventes: 5800, commandes: 118, visiteurs: 4890 },
		{ mois: "Juin", ventes: 7200, commandes: 145, visiteurs: 5680 },
	];

	// Répartition des catégories
	const categoriesData = [
		{ name: "Vêtements", value: 42, color: "#3b82f6" },
		{ name: "Accessoires", value: 28, color: "#8b5cf6" },
		{ name: "Chaussures", value: 18, color: "#ec4899" },
		{ name: "Autres", value: 12, color: "#f59e0b" },
	];

	// Produits les plus vendus
	const topProduits = [
		{ nom: "T-shirt basique", ventes: 156, revenus: 3120 },
		{ nom: "Jean slim", ventes: 134, revenus: 6700 },
		{ nom: "Sneakers Classic", ventes: 98, revenus: 7840 },
		{ nom: "Sac à dos", ventes: 87, revenus: 4350 },
		{ nom: "Casquette", ventes: 76, revenus: 1520 },
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
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Évolution des ventes
						</h2>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={ventesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="mois" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="ventes"
									stroke="#3b82f6"
									strokeWidth={2}
									name="Ventes (€)"
								/>
								<Line
									type="monotone"
									dataKey="commandes"
									stroke="#8b5cf6"
									strokeWidth={2}
									name="Commandes"
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					{/* Répartition par catégorie */}
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Ventes par catégorie
						</h2>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoriesData}
									cx="50%"
									cy="50%"
									labelLine={false}
									// label={({ name, percent }) =>
									// 	`${name} ${(percent * 100).toFixed(0)}%`
									// }
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{categoriesData.map((entry) => (
										<Cell key={`cell-${entry.name}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Graphique visiteurs et produits top */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Trafic du site */}
					<div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Trafic du site
						</h2>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={ventesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="mois" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="visiteurs" fill="#3b82f6" name="Visiteurs" />
							</BarChart>
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
