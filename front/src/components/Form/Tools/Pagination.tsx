interface PaginationProps {
	totalPages: number;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
	totalPages,
	currentPage,
	setCurrentPage,
}: PaginationProps) {
	return (
		<>
			{/* --- Pagination --- */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-6 gap-2">
					<button
						type="button"
						onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
						disabled={currentPage === 1}
						className={`px-3 py-1 border rounded cursor-pointer ${
							currentPage === 1
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-gray-100"
						}`}
					>
						Précédent
					</button>

					{Array.from({ length: totalPages }).map((_, i) => {
						const pageNumber = i + 1;
						return (
							<button
								type="button"
								key={`page-${pageNumber}`}
								onClick={() => setCurrentPage(pageNumber)}
								className={`px-3 py-1 border rounded cursor-pointer ${
									currentPage === pageNumber
										? "bg-gray-300 font-semibold"
										: "hover:bg-gray-100"
								}`}
							>
								{pageNumber}
							</button>
						);
					})}

					<button
						type="button"
						onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
						disabled={currentPage === totalPages}
						className={`px-3 py-1 border rounded cursor-pointer ${
							currentPage === totalPages
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-gray-100"
						}`}
					>
						Suivant
					</button>
				</div>
			)}
		</>
	);
}
