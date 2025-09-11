import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Crumb {
	label: string;
	href?: string; // si pas de href, c’est la page courante
}

interface BreadcrumbProps {
	items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav
			className="flex items-center text-sm text-gray-600 mt-4"
			aria-label="Fil d’Ariane"
		>
			{items.map((item) => (
				<div key={item.href ?? item.label} className="flex items-center">
					{item.href ? (
						<Link
							to={item.href}
							className="hover:text-blue-600 transition-colors"
						>
							{item.label}
						</Link>
					) : (
						<span className="text-gray-800 font-medium">{item.label}</span>
					)}

					{/* séparateur */}
					{item !== items[items.length - 1] && (
						<ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
					)}
				</div>
			))}
		</nav>
	);
}
