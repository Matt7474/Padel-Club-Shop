import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function SalesCategories() {
	const categoriesData = [
		{ name: "Vêtements", value: 42, color: "#3b82f6" },
		{ name: "Accessoires", value: 28, color: "#8b5cf6" },
		{ name: "Chaussures", value: 18, color: "#ec4899" },
		{ name: "Autres", value: 12, color: "#f59e0b" },
	];

	return (
		<>
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
		</>
	);
}
