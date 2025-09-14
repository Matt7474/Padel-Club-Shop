import { useParams, useSearchParams } from "react-router-dom";
import Articles from "../../pages/Articles";

export default function ArticlesWrapper() {
	const { type } = useParams();
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	// Passe les deux props à Articles
	return <Articles type={type || undefined} searchQuery={searchQuery} />;
}
