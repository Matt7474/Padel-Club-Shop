import { useParams, useSearchParams } from "react-router-dom";
import Articles from "../../pages/Articles";

export default function ArticlesWrapper() {
	const { type } = useParams();
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	return <Articles type={type} searchQuery={searchQuery} />;
}
