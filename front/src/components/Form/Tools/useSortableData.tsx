import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";

interface SortConfig<T> {
	key: keyof T;
	direction: SortDirection;
}

export function useSortableData<T>(
	items: T[],
	initialSortConfig?: SortConfig<T>,
) {
	const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
		initialSortConfig || null,
	);

	const sortedItems = useMemo(() => {
		if (!sortConfig) return items;

		const sorted = [...items];
		const { key, direction } = sortConfig;

		sorted.sort((a, b) => {
			const aValue = a[key];
			const bValue = b[key];

			// ✅ string
			if (typeof aValue === "string" && typeof bValue === "string") {
				// vérifier si c’est une date
				const dateA = Date.parse(aValue);
				const dateB = Date.parse(bValue);

				if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
					return direction === "asc" ? dateA - dateB : dateB - dateA;
				}

				return direction === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			// ✅ number
			if (typeof aValue === "number" && typeof bValue === "number") {
				return direction === "asc" ? aValue - bValue : bValue - aValue;
			}

			return 0;
		});

		return sorted;
	}, [items, sortConfig]);

	const requestSort = (key: keyof T) => {
		let direction: SortDirection = "asc";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "asc"
		) {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	return { items: sortedItems, requestSort, sortConfig };
}
