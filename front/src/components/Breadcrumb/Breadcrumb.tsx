import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Crumb {
	label: string;
	href?: string; // si pas de href, c’est la page courante
}

interface BreadcrumbProps {
	items: Crumb[];
}

// 🗝️ Dictionnaire des traductions
const translations: Record<string, string> = {
	home: "Accueil",
	rackets: "Raquettes",
	bags: "Sacs",
	balls: "Balles",
	clothings: "Vêtements",
	shoess: "Chaussures",
	accessorys: "Accessoires",
	brand: "Marque",
	brands: "Marques",
	articles: "Articles",
	promotions: "Promotions",
};

const translateKey = (key: string) => {
	const cleanKey = key
		.toLowerCase()
		.replace(/\(s\)/g, "s") // remplace "(s)" par "s"
		.replace(/[^a-z]/g, ""); // supprime tout caractère spécial
	return translations[cleanKey] || key;
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav
			className="flex items-center text-sm text-gray-600 mt-4"
			aria-label="Fil d’Ariane"
		>
			{items.map((item, index) => (
				<div key={item.href ?? item.label} className="flex items-center">
					{item.href ? (
						<Link
							to={item.href}
							className="hover:text-blue-600 transition-colors"
						>
							{translateKey(item.label)}
						</Link>
					) : (
						<span className="text-gray-800 font-medium">
							{translateKey(item.label)}
						</span>
					)}

					{/* séparateur : uniquement entre les éléments */}
					{index < items.length - 1 && (
						<ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
					)}
				</div>
			))}
		</nav>
	);
}
