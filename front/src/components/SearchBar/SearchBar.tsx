import { useState } from "react";

interface SearchBarProps {
	onSearch: (value: string) => void;
	className?: string;
}

export default function SearchBar({
	onSearch,
	className = "",
}: SearchBarProps) {
	const [value, setValue] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(value);
	};

	return (
		<form onSubmit={handleSubmit} className={`relative ${className}`}>
			<input
				type="text"
				className="bg-white mt-4 h-10 w-full xl:w-150 border-1 border-gray-500 rounded-sm relative pl-2 text-gray-700 pb-1"
				placeholder="rechercher"
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>

			<button
				type="submit"
				className="absolute right-3 -mt-1 top-1/2 -translate-y-1/2 opacity-60"
				aria-label="Rechercher"
			>
				<img
					src="/icons/glass.svg"
					alt=""
					className="w-5 hover:cursor-pointer mt-5 xl:mt-0"
				/>
			</button>
		</form>
	);
}
