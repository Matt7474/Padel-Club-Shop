import { Loader2 } from "lucide-react";

interface LoaderProps {
	text: string;
}

export default function Loader({ text }: LoaderProps) {
	return (
		<div className="flex flex-col items-center justify-center h-64 text-gray-600">
			<Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
			<p className="text-sm font-medium">Chargement {text}...</p>
		</div>
	);
}
